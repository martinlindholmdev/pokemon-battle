import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { createBattleRecap } from "../services/aiCoach.js";

const router = Router();

const recapSchema = z.object({
  player: z.string().min(1).max(40),
  opponent: z.string().min(1).max(40),
  result: z.enum(["win", "loss"]),
  score: z.number().int().min(0).max(999999),
  turns: z.array(z.string().min(1).max(160)).max(20)
});

router.post("/battle-recap", requireAuth, async (req, res, next) => {
  try {
    const input = recapSchema.parse(req.body);
    res.json(await createBattleRecap(input));
  } catch (error) {
    next(error);
  }
});

export { router as aiRouter };
