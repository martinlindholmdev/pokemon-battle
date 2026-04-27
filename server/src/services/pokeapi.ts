import { HttpError } from "../utils/httpError.js";

export interface BattlePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  height: number;
  weight: number;
}

const baseUrl = "https://pokeapi.co/api/v2";

function pokemonImage(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function stat(stats: Array<{ base_stat: number; stat: { name: string } }>, name: string) {
  return stats.find((entry) => entry.stat.name === name)?.base_stat ?? 50;
}

export async function fetchBattlePokemon(id: number): Promise<BattlePokemon> {
  const response = await fetch(`${baseUrl}/pokemon/${id}`);
  if (!response.ok) {
    throw new HttpError(503, "Pokemon data is unavailable");
  }

  const data = await response.json();
  return {
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
}
