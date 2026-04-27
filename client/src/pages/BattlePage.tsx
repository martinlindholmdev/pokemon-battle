import { useState } from "react";
import { Link } from "react-router-dom";
import { postScore } from "../api/http";
import { fetchPokemonDetail } from "../api/pokeapi";
import { getRoster } from "../auth/roster";
import { useAuth } from "../auth/AuthContext";
import { HpBar } from "../components/HpBar";
import type { BattleResult, PokemonDetail, PokemonSummary } from "../types/pokemon";

function power(pokemon: PokemonDetail) {
  return pokemon.stats.attack * 1.4 + pokemon.stats.defense + pokemon.stats.speed + pokemon.stats.hp;
}

function simulate(player: PokemonDetail, opponent: PokemonDetail): BattleResult {
  let playerHp = 100;
  let opponentHp = 100;
  const turns: string[] = [];

  for (let turn = 1; turn <= 8 && playerHp > 0 && opponentHp > 0; turn += 1) {
    const playerHit = Math.max(8, Math.round(player.stats.attack / 7 + player.stats.speed / 12));
    const opponentHit = Math.max(8, Math.round(opponent.stats.attack / 7 + opponent.stats.speed / 12));
    opponentHp -= playerHit;
    turns.push(`${player.name} hits ${opponent.name} for ${playerHit}`);
    if (opponentHp <= 0) break;
    playerHp -= opponentHit;
    turns.push(`${opponent.name} counters for ${opponentHit}`);
  }

  const outcome = playerHp > opponentHp || power(player) >= power(opponent) ? "win" : "loss";
  const score = outcome === "win" ? Math.round(power(player) + Math.max(0, playerHp) * 3) : Math.round(power(player) / 2);
  return { player, opponent, outcome, score, turns };
}

export function BattlePage() {
  const { token } = useAuth();
  const [roster] = useState<PokemonSummary[]>(() => getRoster());
  const [selected, setSelected] = useState(() => String(getRoster()[0]?.id ?? ""));
  const [result, setResult] = useState<BattleResult | null>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function startBattle() {
    if (!selected) return;
    setLoading(true);
    setNotice("");
    try {
      const [player, opponent] = await Promise.all([
        fetchPokemonDetail(selected),
        fetchPokemonDetail(Math.floor(Math.random() * 151) + 1)
      ]);
      const next = simulate(player, opponent);
      setResult(next);

      if (token) {
        await postScore(token, {
          score: next.score,
          wins: next.outcome === "win" ? 1 : 0,
          losses: next.outcome === "loss" ? 1 : 0,
          team: roster.map((pokemon) => pokemon.name),
          opponent: opponent.name
        });
        setNotice("Score posted to leaderboard");
      } else {
        setNotice("Log in to post this score");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Battle failed");
    } finally {
      setLoading(false);
    }
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
            {loading ? "Battling..." : "Start battle"}
          </button>
        </div>
      </div>
      <div className="status-strip">
        <span>Pick one roster Pokemon</span>
        <span>Opponent is random</span>
        <span>Score posts after the match</span>
      </div>
      {notice && <p className="notice">{notice}</p>}
      {result ? (
        <div className="battle-grid">
          <div className="panel fighter">
            <div className="sprite-stage large attack-pulse">
              <img src={result.player.image} alt={result.player.name} />
            </div>
            <h2>{result.player.name}</h2>
            <HpBar label="HP" value={result.outcome === "win" ? 64 : 18} />
          </div>
          <div className="panel result-panel">
            <p className="eyebrow">{result.outcome === "win" ? "Victory" : "Defeat"}</p>
            <h2>{result.score} points</h2>
            <div className="versus">VS</div>
            <ol className="battle-log">{result.turns.map((turn, index) => <li key={`${turn}-${index}`}>{turn}</li>)}</ol>
          </div>
          <div className="panel fighter">
            <div className="sprite-stage large">
              <img src={result.opponent.image} alt={result.opponent.name} />
            </div>
            <h2>{result.opponent.name}</h2>
            <HpBar label="HP" value={result.outcome === "win" ? 0 : 55} />
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
