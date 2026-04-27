import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

const baseUrl = "https://pokeapi.co/api/v2";
const detailCache = new Map<number, PokemonDetail>();
let listCache: PokemonSummary[] | null = null;

function pokemonImage(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function idFromUrl(url: string) {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}

export async function fetchPokemonList(limit = 24, offset = 0): Promise<PokemonSummary[]> {
  if (listCache && offset === 0 && limit === 24) {
    return listCache;
  }

  const response = await fetch(`${baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error("PokeAPI is unavailable right now");
  }

  const data = (await response.json()) as { results: Array<{ name: string; url: string }> };
  const list = data.results.map((pokemon) => {
    const id = idFromUrl(pokemon.url);
    return {
      ...pokemon,
      id,
      image: pokemonImage(id)
    };
  });

  if (offset === 0 && limit === 24) {
    listCache = list;
  }

  return list;
}

export async function fetchPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
  const numericId = Number(idOrName);
  if (Number.isFinite(numericId) && detailCache.has(numericId)) {
    return detailCache.get(numericId)!;
  }

  const response = await fetch(`${baseUrl}/pokemon/${idOrName}`);
  if (!response.ok) {
    throw new Error("Pokemon details could not be loaded");
  }

  const data = await response.json();
  const detail: PokemonDetail = {
    id: data.id,
    name: data.name,
    image: pokemonImage(data.id),
    types: data.types.map((item: { type: { name: string } }) => item.type.name),
    abilities: data.abilities.map((item: { ability: { name: string } }) => item.ability.name),
    stats: {
      hp: stat(data.stats, "hp"),
      attack: stat(data.stats, "attack"),
      defense: stat(data.stats, "defense"),
      speed: stat(data.stats, "speed")
    },
    height: data.height,
    weight: data.weight
  };

  detailCache.set(detail.id, detail);
  return detail;
}

function stat(stats: Array<{ base_stat: number; stat: { name: string } }>, name: string) {
  return stats.find((entry) => entry.stat.name === name)?.base_stat ?? 50;
}
