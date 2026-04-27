import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
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
        <span className="pokemon-number">#{String(pokemon.id).padStart(3, "0")}</span>
        <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
        <h3>{pokemon.name}</h3>
      </Link>
      <button className="icon-button" onClick={() => onAdd(pokemon)} title="Add to roster" type="button">
        <Plus size={18} />
      </button>
    </article>
  );
}
