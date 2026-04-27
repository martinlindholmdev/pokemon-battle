import { useState } from "react";
import { Link } from "react-router-dom";
import { postScore } from "../api/http";
import { fetchPokemonDetail } from "../api/pokeapi";
import { getRoster } from "../auth/roster";
import { useAuth } from "../auth/AuthContext";
import { HpBar } from "../components/HpBar";
import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

type Move = "strike" | "guard" | "focus";

interface ArenaState {
  player: PokemonDetail;
  opponent: PokemonDetail;
  playerHp: number;
  opponentHp: number;
  turn: number;
  guard: boolean;
  focus: number;
  log: string[];
  outcome?: "win" | "loss";
  score?: number;
  posted?: boolean;
}

function power(pokemon: PokemonDetail) {
  return pokemon.stats.attack * 1.4 + pokemon.stats.defense + pokemon.stats.speed + pokemon.stats.hp;
}

function scoreBattle(arena: ArenaState, outcome: "win" | "loss") {
  return outcome === "win"
    ? Math.round(power(arena.player) + Math.max(0, arena.playerHp) * 3 + arena.turn * 12)
    : Math.round(power(arena.player) / 2 + arena.turn * 5);
}

function moveDamage(player: PokemonDetail, move: Move, focus: number) {
  if (move === "focus") return 0;
  const base = Math.max(10, Math.round(player.stats.attack / 6 + player.stats.speed / 14));
  return move === "strike" ? base + focus * 8 : Math.round(base * 0.55);
}

export function BattlePage() {
  const { token } = useAuth();
  const [roster] = useState<PokemonSummary[]>(() => getRoster());
  const [selected, setSelected] = useState(() => String(getRoster()[0]?.id ?? ""));
  const [arena, setArena] = useState<ArenaState | null>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedPokemon = roster.find((pokemon) => String(pokemon.id) === selected);

  async function startBattle() {
    if (!selected) return;
    setLoading(true);
    setNotice("");
    try {
      const [player, opponent] = await Promise.all([
        fetchPokemonDetail(selected),
        fetchPokemonDetail(Math.floor(Math.random() * 151) + 1)
      ]);
      setArena({
        player,
        opponent,
        playerHp: 100,
        opponentHp: 100,
        turn: 1,
        guard: false,
        focus: 0,
        log: [`${player.name} entered the arena. ${opponent.name} appeared.`]
      });
      setNotice("Arena ready. Choose a move.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Arena failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function finishBattle(next: ArenaState, outcome: "win" | "loss") {
    const score = scoreBattle(next, outcome);
    const finished = {
      ...next,
      outcome,
      score,
      log: [`${outcome === "win" ? next.player.name : next.opponent.name} wins the match.`, ...next.log].slice(0, 12)
    };
    setArena(finished);

    if (!token) {
      setNotice("Battle complete. Log in to post this score.");
      return;
    }

    try {
      await postScore(token, {
        score,
        wins: outcome === "win" ? 1 : 0,
        losses: outcome === "loss" ? 1 : 0,
        team: roster.map((pokemon) => pokemon.name),
        opponent: next.opponent.name
      });
      setArena({ ...finished, posted: true });
      setNotice("Score posted to leaderboard");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Score could not be posted");
    }
  }

  async function performMove(move: Move) {
    if (!arena || arena.outcome) return;

    const playerDamage = moveDamage(arena.player, move, arena.focus);
    const nextOpponentHp = Math.max(0, arena.opponentHp - playerDamage);
    const log = [
      move === "focus"
        ? `${arena.player.name} focused for a stronger next strike.`
        : `${arena.player.name} used ${move} for ${playerDamage} damage.`,
      ...arena.log
    ];

    if (nextOpponentHp <= 0) {
      await finishBattle({ ...arena, opponentHp: 0, log }, "win");
      return;
    }

    const counterBase = Math.max(8, Math.round(arena.opponent.stats.attack / 7 + arena.opponent.stats.speed / 15));
    const counterDamage = move === "guard" ? Math.round(counterBase * 0.35) : counterBase;
    const nextPlayerHp = Math.max(0, arena.playerHp - counterDamage);
    const counterLog = [`${arena.opponent.name} countered for ${counterDamage} damage.`, ...log].slice(0, 12);

    const next: ArenaState = {
      ...arena,
      playerHp: nextPlayerHp,
      opponentHp: nextOpponentHp,
      turn: arena.turn + 1,
      guard: move === "guard",
      focus: move === "focus" ? Math.min(3, arena.focus + 1) : 0,
      log: counterLog
    };

    if (nextPlayerHp <= 0 || next.turn > 8) {
      await finishBattle(next, nextPlayerHp > nextOpponentHp || power(arena.player) >= power(arena.opponent) ? "win" : "loss");
      return;
    }

    setArena(next);
  }

  if (roster.length === 0) {
    return (
      <section className="empty-state">
        <h1>No battle roster yet</h1>
        <p>Add at least one Pokemon before starting a match.</p>
        <Link className="primary link-button" to="/">Build roster</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Battle terminal</p>
          <h1>Start the match</h1>
        </div>
        <div className="battle-controls">
          <select value={selected} onChange={(event) => setSelected(event.target.value)}>
            {roster.map((pokemon) => (
              <option value={pokemon.id} key={pokemon.id}>{pokemon.name}</option>
            ))}
          </select>
          <button className="primary" onClick={startBattle} disabled={loading} type="button">
            {loading ? "Loading arena..." : arena ? "New opponent" : "Start battle"}
          </button>
        </div>
      </div>
      <div className="status-strip">
        <span>Pick one roster Pokemon</span>
        <span>Opponent is random</span>
        <span>Score posts after the match</span>
      </div>
      <div className="battle-setup">
        <article className="panel">
          <p className="eyebrow">1. Choose fighter</p>
          <h2>{selectedPokemon?.name ?? "No Pokemon selected"}</h2>
          {selectedPokemon && (
            <div className="sprite-stage">
              <img src={selectedPokemon.image} alt={selectedPokemon.name} />
            </div>
          )}
        </article>
        <article className="panel">
          <p className="eyebrow">2. Rule check</p>
          <div className="status-strip vertical">
            <span>Battle lasts up to 8 turns</span>
            <span>Attack and speed drive damage</span>
            <span>Remaining HP boosts winning score</span>
          </div>
        </article>
        <article className="panel">
          <p className="eyebrow">3. Result</p>
          <h2>{arena?.outcome ? `${arena.outcome}: ${arena.score} pts` : "Waiting for battle"}</h2>
          <p>After the match, your score is sent to the leaderboard automatically.</p>
        </article>
      </div>
      {notice && <p className="notice">{notice}</p>}
      {arena ? (
        <div className="battle-arena">
          <div className="panel fighter">
            <div className="sprite-stage large attack-pulse">
              <img src={arena.player.image} alt={arena.player.name} />
            </div>
            <h2>{arena.player.name}</h2>
            <HpBar label="HP" value={arena.playerHp} />
          </div>
          <div className="panel result-panel arena-controls">
            <p className="eyebrow">Turn {Math.min(arena.turn, 8)} / 8</p>
            <h2>{arena.outcome ? `${arena.score} points` : "Choose move"}</h2>
            <div className="versus">VS</div>
            <div className="move-grid">
              <button type="button" onClick={() => void performMove("strike")} disabled={Boolean(arena.outcome)}>
                Strike
                <small>Damage</small>
              </button>
              <button type="button" onClick={() => void performMove("guard")} disabled={Boolean(arena.outcome)}>
                Guard
                <small>Reduce counter</small>
              </button>
              <button type="button" onClick={() => void performMove("focus")} disabled={Boolean(arena.outcome)}>
                Focus
                <small>Charge next hit</small>
              </button>
            </div>
            <ol className="battle-log">{arena.log.map((turn, index) => <li key={`${turn}-${index}`}>{turn}</li>)}</ol>
          </div>
          <div className="panel fighter">
            <div className="sprite-stage large">
              <img src={arena.opponent.image} alt={arena.opponent.name} />
            </div>
            <h2>{arena.opponent.name}</h2>
            <HpBar label="HP" value={arena.opponentHp} />
          </div>
        </div>
      ) : (
        <div className="panel empty-state">
          <h2>Battle station ready</h2>
          <p>Pick your lead Pokemon, press start, and the terminal will roll the full turn log.</p>
        </div>
      )}
    </section>
  );
}
