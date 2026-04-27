import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToRoster } from "../auth/roster";
import { fetchPokemonDetail } from "../api/pokeapi";
import { TypeBadge } from "../components/TypeBadge";
import type { PokemonDetail } from "../types/pokemon";

export function PokemonDetailPage() {
  const { id = "" } = useParams();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchPokemonDetail(id).then(setPokemon).catch((err) => setError(err instanceof Error ? err.message : "Could not load Pokemon"));
  }, [id]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!pokemon) {
    return <div className="skeleton detail-skeleton" />;
  }

  return (
    <section className="detail-layout">
      <div className="panel pokemon-portrait">
        <span className="pokemon-number">#{String(pokemon.id).padStart(3, "0")}</span>
        <div className="sprite-stage large">
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
        <h1>{pokemon.name}</h1>
        <div className="badge-row">{pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
        <button
          className="primary"
          type="button"
          onClick={() => {
            addToRoster({ id: pokemon.id, name: pokemon.name, image: pokemon.image, url: "" });
            setNotice(`${pokemon.name} added to roster`);
          }}
        >
          Add to roster
        </button>
        {notice && <p className="notice">{notice}</p>}
      </div>
      <div className="panel">
        <p className="eyebrow">Pokedex report</p>
        <h2>Battle stats</h2>
        {Object.entries(pokemon.stats).map(([name, value]) => (
          <div className="stat" key={name}>
            <span>{name}</span>
            <strong>{value}</strong>
            <meter min="0" max="160" value={value} />
          </div>
        ))}
        <h2>Abilities</h2>
        <div className="badge-row">{pokemon.abilities.map((ability) => <span className="chip" key={ability}>{ability}</span>)}</div>
        <div className="status-strip vertical">
          <span>Height: {pokemon.height}</span>
          <span>Weight: {pokemon.weight}</span>
          <span>Higher attack and speed improve battle damage.</span>
        </div>
      </div>
    </section>
  );
}
