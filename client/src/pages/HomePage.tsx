import { useEffect, useState } from "react";
import { PokemonCard } from "../components/PokemonCard";
import { addToRoster } from "../auth/roster";
import { fetchPokemonList } from "../api/pokeapi";
import type { PokemonSummary } from "../types/pokemon";

export function HomePage() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPokemonList()
      .then((items) => {
        setPokemon(items);
        setStatus("ready");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Could not load Pokemon");
        setStatus("error");
      });
  }, []);

  function handleAdd(item: PokemonSummary) {
    addToRoster(item);
    setMessage(`${item.name} added to roster`);
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Pokedex link active</p>
          <h1>Choose your squad</h1>
        </div>
        <div className="mission-card">
          <strong>How to play</strong>
          <span>1. scan cards</span>
          <span>2. add up to 6</span>
          <span>3. battle for points</span>
        </div>
      </div>
      <div className="status-strip">
        <span>24 Pokemon loaded per scan</span>
        <span>Roster limit: 6</span>
        <span>Click a card for stats</span>
      </div>
      {message && <p className={status === "error" ? "error" : "notice"}>{message}</p>}
      {status === "loading" && <div className="grid">{Array.from({ length: 8 }, (_, index) => <div className="skeleton" key={index} />)}</div>}
      {status === "ready" && (
        <div className="grid">
          {pokemon.map((item) => (
            <PokemonCard key={item.id} pokemon={item} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </section>
  );
}
