import type { PokemonSummary } from "../types/pokemon";

const rosterKey = "pokemon-battle-roster";

export function getRoster(): PokemonSummary[] {
  try {
    const raw = localStorage.getItem(rosterKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export function saveRoster(roster: PokemonSummary[]) {
  localStorage.setItem(rosterKey, JSON.stringify(roster.slice(0, 6)));
}

export function addToRoster(pokemon: PokemonSummary) {
  const roster = getRoster();
  if (roster.some((item) => item.id === pokemon.id)) {
    return roster;
  }
  const next = [...roster, pokemon].slice(0, 6);
  saveRoster(next);
  return next;
}

export function removeFromRoster(id: number) {
  const next = getRoster().filter((pokemon) => pokemon.id !== id);
  saveRoster(next);
  return next;
}
