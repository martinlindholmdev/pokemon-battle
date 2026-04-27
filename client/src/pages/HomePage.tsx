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
          <p className="eyebrow">Pokedex dashboard</p>
          <h1>Choose your battle roster</h1>
        </div>
        <p className="muted">Browse starter candidates, inspect details, and add up to six Pokemon.</p>
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
