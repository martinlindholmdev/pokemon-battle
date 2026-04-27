export interface AuthPayload {
  token: string;
  user: {
    id: string;
    email: string;
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

export function postScore(
  token: string,
  input: { score: number; wins: number; losses: number; team: string[]; opponent: string }
) {
  return request<{ score: unknown }>(
    "/api/leaderboard",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    token
  );
}

export function getBattleRecap(
  token: string,
  input: { player: string; opponent: string; result: "win" | "loss"; score: number; turns: string[] }
) {
  return request<{ recap: string; source: "ai" | "local" }>(
    "/api/ai/battle-recap",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    token
  );
}
