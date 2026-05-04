import { useState } from "react";
import { Link } from "react-router-dom";
import { getRoster, removeFromRoster } from "../auth/roster";
import type { PokemonSummary } from "../types/pokemon";

export function RosterPage() {
  const [roster, setRoster] = useState<PokemonSummary[]>(() => getRoster());

  if (roster.length === 0) {
    return (
      <section className="empty-state">
        <h1>Your team is empty</h1>
        <p>Starter picks still work in Battle. Add favorites when you want.</p>
        <Link className="primary link-button" to="/">Open cards</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Team</p>
          <h1>My squad</h1>
        </div>
        <div className="mission-card">
          <strong>{roster.length}/6 spots</strong>
          <span>Pick a lead in Battle</span>
          <span>Swap anytime</span>
        </div>
      </div>
      <div className="grid">
        {roster.map((pokemon) => (
          <article className="pokemon-card" key={pokemon.id}>
            <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card__main">
              <div className="sprite-stage">
                <img src={pokemon.image} alt={pokemon.name} />
              </div>
              <h3>{pokemon.name}</h3>
            </Link>
            <button type="button" onClick={() => setRoster(removeFromRoster(pokemon.id))}>
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
