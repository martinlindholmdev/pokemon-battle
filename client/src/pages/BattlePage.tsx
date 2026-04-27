import { useState } from "react";
import { Link } from "react-router-dom";
import { postScore, startBattleSession } from "../api/http";
import type { BattleMove } from "../api/http";
import { getRoster } from "../auth/roster";
import { useAuth } from "../auth/AuthContext";
import { HpBar } from "../components/HpBar";
import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

type Move = BattleMove;

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
  recap?: string;
  recapSource?: "ai" | "local";
  battleToken: string;
  moves: Move[];
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
    if (!token) {
      setNotice("Log in to start a verified battle.");
      return;
    }

    setLoading(true);
    setNotice("");
    try {
      const battle = await startBattleSession(token, {
        playerId: Number(selected),
        teamIds: roster.map((pokemon) => pokemon.id)
      });
      setArena({
        player: battle.player,
        opponent: battle.opponent,
        playerHp: 100,
        opponentHp: 100,
        turn: 1,
        guard: false,
        focus: 0,
        log: [`${battle.player.name} entered the arena. ${battle.opponent.name} appeared.`],
        battleToken: battle.battleToken,
        moves: []
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
      const posted = await postScore(token, {
        battleToken: next.battleToken,
        moves: next.moves
      });
      setArena({
        ...finished,
        outcome: posted.result.outcome,
        score: posted.result.score,
        posted: true,
        recap: posted.recap.recap,
        recapSource: posted.recap.source
      });
      setNotice(posted.recap.source === "ai" ? "Score posted. Coach recap generated." : "Score posted. Local coach recap shown.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Score could not be posted");
    }
  }

  async function performMove(move: Move) {
    if (!arena || arena.outcome) return;

    const moves = [...arena.moves, move];
    const playerDamage = moveDamage(arena.player, move, arena.focus);
    const nextOpponentHp = Math.max(0, arena.opponentHp - playerDamage);
    const log = [
      move === "focus"
        ? `${arena.player.name} focused for a stronger next strike.`
        : `${arena.player.name} used ${move} for ${playerDamage} damage.`,
      ...arena.log
    ];

    if (nextOpponentHp <= 0) {
      await finishBattle({ ...arena, opponentHp: 0, log, moves }, "win");
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
      log: counterLog,
      moves
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
          <p className="eyebrow">Battle arena</p>
          <h1>{arena ? "Battle arena" : "Start the match"}</h1>
        </div>
        <div className="battle-controls">
          <select value={selected} onChange={(event) => setSelected(event.target.value)}>
            {roster.map((pokemon) => (
              <option value={pokemon.id} key={pokemon.id}>{pokemon.name}</option>
            ))}
          </select>
          <button className="primary" onClick={startBattle} disabled={loading} type="button">
            {loading ? "Loading arena..." : arena ? "Start new battle" : "Start battle"}
          </button>
        </div>
      </div>
      {notice && <p className="notice">{notice}</p>}
      {arena ? (
        <div className="battle-arena">
          <div className="panel fighter player">
            <div className="sprite-stage large attack-pulse">
              <img src={arena.player.image} alt={arena.player.name} />
            </div>
            <h2>{arena.player.name}</h2>
            <HpBar label="HP" value={arena.playerHp} />
          </div>
          <div className="panel result-panel arena-controls">
            <p className="eyebrow">Turn {Math.min(arena.turn, 8)} / 8</p>
            <h2>{arena.outcome ? `${arena.outcome}: ${arena.score} pts` : "Choose move"}</h2>
            <div className="versus">VS</div>
            <div className="move-grid">
              <button type="button" onClick={() => void performMove("strike")} disabled={Boolean(arena.outcome)}>
                Strike
                <small>Full damage</small>
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
            {arena.outcome && (
              <div className="coach-recap">
                <p className="eyebrow">{arena.recapSource === "ai" ? "LLM coach online" : "Local coach fallback"}</p>
                <h3>Coach recap</h3>
                <p>{arena.recap ?? "Waiting for the coach report..."}</p>
              </div>
            )}
          </div>
          <div className="panel fighter opponent">
            <div className="sprite-stage large">
              <img src={arena.opponent.image} alt={arena.opponent.name} />
            </div>
            <h2>{arena.opponent.name}</h2>
            <HpBar label="HP" value={arena.opponentHp} />
          </div>
        </div>
      ) : (
        <div className="battle-setup">
          <article className="panel">
            <p className="eyebrow">Lead fighter</p>
            <h2>{selectedPokemon?.name ?? "No Pokemon selected"}</h2>
            {selectedPokemon && (
              <div className="sprite-stage">
                <img src={selectedPokemon.image} alt={selectedPokemon.name} />
              </div>
            )}
          </article>
          <article className="panel">
            <p className="eyebrow">Commands</p>
            <div className="status-strip vertical">
              <span>Strike: full damage</span>
              <span>Guard: reduce counter</span>
              <span>Focus: charge next hit</span>
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Arena status</p>
            <h2>Ready</h2>
            <p>Press Start Battle. The arena will replace this setup screen.</p>
          </article>
        </div>
      )}
    </section>
  );
}
