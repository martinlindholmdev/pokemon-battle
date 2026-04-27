import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import type { PokemonSummary } from "../types/pokemon";

export function PokemonCard({
  pokemon,
  onAdd
}: {
  pokemon: PokemonSummary;
  onAdd: (pokemon: PokemonSummary) => void;
}) {
  return (
    <article className="pokemon-card">
      <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card__main">
        <header>
          <span className="pokemon-number">#{String(pokemon.id).padStart(3, "0")}</span>
          <span className="scan-dot">SCAN</span>
        </header>
        <div className="sprite-stage">
          <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
        </div>
        <h3>{pokemon.name}</h3>
        <span className="card-link"><Search size={14} /> inspect</span>
      </Link>
      <button className="icon-button" onClick={() => onAdd(pokemon)} title="Add to roster" type="button">
        <Plus size={18} />
      </button>
    </article>
  );
}
