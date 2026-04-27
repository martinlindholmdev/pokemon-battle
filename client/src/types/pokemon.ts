export interface PokemonSummary {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonDetail {
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

export interface BattleResult {
  player: PokemonDetail;
  opponent: PokemonDetail;
  outcome: "win" | "loss";
  score: number;
  turns: string[];
}
