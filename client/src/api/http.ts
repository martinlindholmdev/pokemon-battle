import type { PokemonDetail } from "../types/pokemon";

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    displayName: string;
  };
}

export interface ScoreEntry {
  id: string;
  displayName: string;
  score: number;
  wins: number;
  losses: number;
  team: string[];
  opponent: string;
  createdAt: string;
}

export type BattleMove = "strike" | "guard" | "focus";

export interface BattleStart {
  battleToken: string;
  player: PokemonDetail;
  opponent: PokemonDetail;
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

export interface PostedBattle {
  score: ScoreEntry;
  result: VerifiedBattleResult;
  recap: {
    recap: string;
    source: "ai" | "local";
  };
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.details ?? data.error ?? "Request failed");
  }

  return data as T;
}

export function registerUser(input: { email: string; password: string; displayName: string }) {
  return request<AuthPayload>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function loginUser(input: { email: string; password: string }) {
  return request<AuthPayload>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getLeaderboard() {
  return request<{ scores: ScoreEntry[] }>("/api/leaderboard");
}

export function startBattleSession(token: string, input: { playerId: number; teamIds: number[] }) {
  return request<BattleStart>(
    "/api/battles/start",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    token
  );
}

export function postScore(token: string, input: { battleToken: string; moves: BattleMove[] }) {
  return request<PostedBattle>(
    "/api/leaderboard",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    token
  );
}

export function getBattleRecap(token: string, input: { battleToken: string; moves: BattleMove[] }) {
  return request<{ recap: string; source: "ai" | "local" }>(
    "/api/ai/battle-recap",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    token
  );
}
