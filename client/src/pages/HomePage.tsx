import { useEffect, useMemo, useState } from "react";
import { PokemonCard } from "../components/PokemonCard";
import { addToRoster, getRoster, rosterChangedEvent } from "../auth/roster";
import { fetchPokemonList } from "../api/pokeapi";
import type { PokemonSummary } from "../types/pokemon";

export function HomePage() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([]);
  const [roster, setRoster] = useState<PokemonSummary[]>(() => getRoster());
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(48);

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

  useEffect(() => {
    const syncRoster = () => setRoster(getRoster());
    window.addEventListener(rosterChangedEvent, syncRoster);
    return () => window.removeEventListener(rosterChangedEvent, syncRoster);
  }, []);

  const filteredPokemon = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return pokemon.slice(0, visibleCount);
    }
    return pokemon.filter((item) => item.name.includes(normalized) || String(item.id) === normalized);
  }, [pokemon, query, visibleCount]);

  const rosterIds = new Set(roster.map((item) => item.id));

  function handleAdd(item: PokemonSummary) {
    const before = getRoster();
    const next = addToRoster(item);
    setRoster(next);

    if (before.some((pokemon) => pokemon.id === item.id)) {
      setMessage(`${item.name} is already in your roster`);
      return;
    }

    if (before.length >= 6) {
      setMessage("Roster is full. Remove a Pokemon before adding another.");
      return;
    }

    setMessage(`${item.name} added. ${next.length}/6 roster slots filled.`);
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Pokemon cards</p>
          <h1>Pick your team</h1>
        </div>
        <div className="mission-card">
          <strong>Ready?</strong>
          <span>Pick favorites</span>
          <span>Press Battle</span>
          <span>Win trophies</span>
        </div>
      </div>
      <div className="pokedex-toolbar">
        <label>
          Find Pokemon
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(48);
            }}
            placeholder="pikachu, charizard, or 25"
            type="search"
          />
        </label>
        <div className="trainer-steps">
          <strong>Next</strong>
          <span>{roster.length === 0 ? "Tap plus or press Battle." : roster.length < 6 ? "Pick more or battle." : "Team full. Battle time."}</span>
        </div>
      </div>
      <div className="status-strip">
        <span>{pokemon.length} Pokemon</span>
        <span>{filteredPokemon.length} shown</span>
        <span className="roster-counter" aria-live="polite">
          <strong>{roster.length}/6</strong> team
        </span>
        <span>{query ? "Matches" : "More cards below"}</span>
      </div>
      {message && <p className={status === "error" ? "error" : "notice"}>{message}</p>}
      {status === "loading" && <div className="grid">{Array.from({ length: 8 }, (_, index) => <div className="skeleton" key={index} />)}</div>}
      {status === "ready" && (
        <div className="grid">
          {filteredPokemon.map((item) => (
            <PokemonCard key={item.id} pokemon={item} onAdd={handleAdd} selected={rosterIds.has(item.id)} />
          ))}
        </div>
      )}
      {status === "ready" && !query && visibleCount < pokemon.length && (
        <div className="load-more">
          <button type="button" onClick={() => setVisibleCount((count) => Math.min(count + 48, pokemon.length))}>
            More Pokemon
          </button>
          <span>
            {filteredPokemon.length} / {pokemon.length}
          </span>
        </div>
      )}
    </section>
  );
}
