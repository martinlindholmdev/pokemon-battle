import { env } from "../config/env.js";

interface BattleRecapInput {
  player: string;
  opponent: string;
  result: "win" | "loss";
  score: number;
  turns: string[];
}

export async function createBattleRecap(input: BattleRecapInput) {
  const fallback = `${input.player} ${input.result === "win" ? "won" : "fell"} against ${input.opponent} after ${input.turns.length} turns and earned ${input.score} points.`;

  if (!env.WBS_LLM_URL || !env.WBS_LLM_API_KEY || !env.WBS_LLM_MODEL) {
    return { recap: fallback, source: "local" as const };
  }

  try {
    const response = await fetch(env.WBS_LLM_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.WBS_LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: env.WBS_LLM_MODEL,
        messages: [
          {
            role: "system",
            content: "Write a concise, upbeat Pokemon battle recap in one sentence."
          },
          {
            role: "user",
            content: JSON.stringify(input)
          }
        ],
        max_tokens: 80
      })
    });

    if (!response.ok) {
      return { recap: fallback, source: "local" as const };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      output_text?: string;
    };
    const text = data.choices?.[0]?.message?.content ?? data.output_text;
    return { recap: text?.trim() || fallback, source: text ? ("ai" as const) : ("local" as const) };
  } catch {
    return { recap: fallback, source: "local" as const };
  }
}
