import { Link } from "react-router-dom";
import { Check, Plus, Search } from "lucide-react";
import type { PokemonSummary } from "../types/pokemon";

export function PokemonCard({
  pokemon,
  onAdd,
  selected = false
}: {
  pokemon: PokemonSummary;
  onAdd: (pokemon: PokemonSummary) => void;
  selected?: boolean;
}) {
  return (
    <article className={selected ? "pokemon-card selected" : "pokemon-card"}>
      <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card__main">
        <header>
          <span className="pokemon-number">#{String(pokemon.id).padStart(3, "0")}</span>
          <span className="scan-dot" aria-label="Details"><Search size={15} /></span>
        </header>
        <div className="sprite-stage">
          <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
        </div>
        <h3>{pokemon.name}</h3>
        <span className="card-link"><Search size={14} /> Look</span>
      </Link>
      <button
        aria-label={selected ? `${pokemon.name} is already in your roster` : `Add ${pokemon.name} to roster`}
        className={selected ? "icon-button selected" : "icon-button"}
        onClick={() => onAdd(pokemon)}
        title={selected ? "Already in roster" : "Add to roster"}
        type="button"
      >
        {selected ? <Check size={18} /> : <Plus size={18} />}
      </button>
    </article>
  );
}
