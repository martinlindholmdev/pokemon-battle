import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import type { BattlePokemon } from "./pokeapi.js";

export const moveSchema = z.enum(["strike", "guard", "focus"]);
export const battleSubmissionSchema = z.object({
  battleToken: z.string().min(1),
  moves: z.array(moveSchema).min(1).max(8)
});

export type BattleMove = z.infer<typeof moveSchema>;
export type BattleSubmission = z.infer<typeof battleSubmissionSchema>;

export const maxVerifiedScore = 1200;
export const pokemonNamePattern = /^[a-z0-9-]+$/;
const firstGenerationPokemonNames = new Set([
  "bulbasaur",
  "ivysaur",
  "venusaur",
  "charmander",
  "charmeleon",
  "charizard",
  "squirtle",
  "wartortle",
  "blastoise",
  "caterpie",
  "metapod",
  "butterfree",
  "weedle",
  "kakuna",
  "beedrill",
  "pidgey",
  "pidgeotto",
  "pidgeot",
  "rattata",
  "raticate",
  "spearow",
  "fearow",
  "ekans",
  "arbok",
  "pikachu",
  "raichu",
  "sandshrew",
  "sandslash",
  "nidoran-f",
  "nidorina",
  "nidoqueen",
  "nidoran-m",
  "nidorino",
  "nidoking",
  "clefairy",
  "clefable",
  "vulpix",
  "ninetales",
  "jigglypuff",
  "wigglytuff",
  "zubat",
  "golbat",
  "oddish",
  "gloom",
  "vileplume",
  "paras",
  "parasect",
  "venonat",
  "venomoth",
  "diglett",
  "dugtrio",
  "meowth",
  "persian",
  "psyduck",
  "golduck",
  "mankey",
  "primeape",
  "growlithe",
  "arcanine",
  "poliwag",
  "poliwhirl",
  "poliwrath",
  "abra",
  "kadabra",
  "alakazam",
  "machop",
  "machoke",
  "machamp",
  "bellsprout",
  "weepinbell",
  "victreebel",
  "tentacool",
  "tentacruel",
  "geodude",
  "graveler",
  "golem",
  "ponyta",
  "rapidash",
  "slowpoke",
  "slowbro",
  "magnemite",
  "magneton",
  "farfetchd",
  "doduo",
  "dodrio",
  "seel",
  "dewgong",
  "grimer",
  "muk",
  "shellder",
  "cloyster",
  "gastly",
  "haunter",
  "gengar",
  "onix",
  "drowzee",
  "hypno",
  "krabby",
  "kingler",
  "voltorb",
  "electrode",
  "exeggcute",
  "exeggutor",
  "cubone",
  "marowak",
  "hitmonlee",
  "hitmonchan",
  "lickitung",
  "koffing",
  "weezing",
  "rhyhorn",
  "rhydon",
  "chansey",
  "tangela",
  "kangaskhan",
  "horsea",
  "seadra",
  "goldeen",
  "seaking",
  "staryu",
  "starmie",
  "mr-mime",
  "scyther",
  "jynx",
  "electabuzz",
  "magmar",
  "pinsir",
  "tauros",
  "magikarp",
  "gyarados",
  "lapras",
  "ditto",
  "eevee",
  "vaporeon",
  "jolteon",
  "flareon",
  "porygon",
  "omanyte",
  "omastar",
  "kabuto",
  "kabutops",
  "aerodactyl",
  "snorlax",
  "articuno",
  "zapdos",
  "moltres",
  "dratini",
  "dragonair",
  "dragonite",
  "mewtwo",
  "mew"
]);

interface BattleTokenPayload {
  kind: "battle";
  userId: string;
  player: BattlePokemon;
  opponent: BattlePokemon;
  team: string[];
}

export interface VerifiedBattleResult {
  outcome: "win" | "loss";
  score: number;
  wins: number;
  losses: number;
  team: string[];
  opponent: string;
  turns: string[];
}

const battlePokemonSchema = z.object({
  id: z.number().int().min(1).max(151),
  name: z.string().refine((name) => firstGenerationPokemonNames.has(name)),
  image: z.string().url(),
  types: z.array(z.string().regex(pokemonNamePattern)).min(1).max(2),
  abilities: z.array(z.string().min(1).max(80)).max(6),
  stats: z.object({
    hp: z.number().int().min(1).max(255),
    attack: z.number().int().min(1).max(255),
    defense: z.number().int().min(1).max(255),
    speed: z.number().int().min(1).max(255)
  }),
  height: z.number().int().min(0).max(1000),
  weight: z.number().int().min(0).max(10000)
});

const battleTokenSchema = z.object({
  kind: z.literal("battle"),
  userId: z.string().min(1),
  player: battlePokemonSchema,
  opponent: battlePokemonSchema,
  team: z.array(z.string().refine((name) => firstGenerationPokemonNames.has(name))).min(1).max(6)
});

function power(pokemon: BattlePokemon) {
  return pokemon.stats.attack * 1.4 + pokemon.stats.defense + pokemon.stats.speed + pokemon.stats.hp;
}

function scoreBattle(player: BattlePokemon, playerHp: number, turn: number, outcome: "win" | "loss") {
  return outcome === "win"
    ? Math.round(power(player) + Math.max(0, playerHp) * 3 + turn * 12)
    : Math.round(power(player) / 2 + turn * 5);
}

function moveDamage(player: BattlePokemon, move: BattleMove, focus: number) {
  if (move === "focus") return 0;
  const base = Math.max(10, Math.round(player.stats.attack / 6 + player.stats.speed / 14));
  return move === "strike" ? base + focus * 8 : Math.round(base * 0.55);
}

export function createBattleToken(payload: BattleTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30m" });
}

export function verifyBattleSubmission(userId: string, input: BattleSubmission): VerifiedBattleResult {
  let battle: BattleTokenPayload;

  try {
    battle = battleTokenSchema.parse(jwt.verify(input.battleToken, env.JWT_SECRET));
  } catch {
    throw new HttpError(400, "Battle could not be verified. Start a new battle.");
  }

  if (battle.userId !== userId) {
    throw new HttpError(403, "Battle token does not belong to this trainer");
  }

  let playerHp = 100;
  let opponentHp = 100;
  let turn = 1;
  let focus = 0;
  const log = [`${battle.player.name} entered the arena. ${battle.opponent.name} appeared.`];

  for (const move of input.moves) {
    const playerDamage = moveDamage(battle.player, move, focus);
    opponentHp = Math.max(0, opponentHp - playerDamage);
    log.unshift(
      move === "focus"
        ? `${battle.player.name} focused for a stronger next strike.`
        : `${battle.player.name} used ${move} for ${playerDamage} damage.`
    );

    if (opponentHp <= 0) {
      const score = scoreBattle(battle.player, playerHp, turn, "win");
      return {
        outcome: "win",
        score,
        wins: 1,
        losses: 0,
        team: battle.team,
        opponent: battle.opponent.name,
        turns: [`${battle.player.name} wins the match.`, ...log].slice(0, 12)
      };
    }

    const counterBase = Math.max(
      8,
      Math.round(battle.opponent.stats.attack / 7 + battle.opponent.stats.speed / 15)
    );
    const counterDamage = move === "guard" ? Math.round(counterBase * 0.35) : counterBase;
    playerHp = Math.max(0, playerHp - counterDamage);
    log.unshift(`${battle.opponent.name} countered for ${counterDamage} damage.`);
    turn += 1;

    if (playerHp <= 0 || turn > 8) {
      const outcome = playerHp > opponentHp || power(battle.player) >= power(battle.opponent) ? "win" : "loss";
      const score = scoreBattle(battle.player, playerHp, turn, outcome);
      return {
        outcome,
        score,
        wins: outcome === "win" ? 1 : 0,
        losses: outcome === "loss" ? 1 : 0,
        team: battle.team,
        opponent: battle.opponent.name,
        turns: [`${outcome === "win" ? battle.player.name : battle.opponent.name} wins the match.`, ...log].slice(0, 12)
      };
    }

    focus = move === "focus" ? Math.min(3, focus + 1) : 0;
  }

  throw new HttpError(400, "Battle is not complete");
}

export function isPublicScoreLike(score: {
  score: number;
  wins: number;
  losses: number;
  team: string[];
  opponent: string;
}) {
  return (
    score.score >= 0 &&
    score.score <= maxVerifiedScore &&
    (score.wins === 0 || score.wins === 1) &&
    (score.losses === 0 || score.losses === 1) &&
    score.wins + score.losses === 1 &&
    score.team.length >= 1 &&
    score.team.length <= 6 &&
    score.team.every((name) => firstGenerationPokemonNames.has(name)) &&
    firstGenerationPokemonNames.has(score.opponent)
  );
}
