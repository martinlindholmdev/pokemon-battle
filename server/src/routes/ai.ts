import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { createBattleRecap } from "../services/aiCoach.js";

const router = Router();

const recapLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const recapSchema = z.object({
  player: z.string().min(1).max(40),
  opponent: z.string().min(1).max(40),
  result: z.enum(["win", "loss"]),
  score: z.number().int().min(0).max(999999),
  turns: z.array(z.string().min(1).max(160)).max(20)
});

router.post("/battle-recap", recapLimiter, requireAuth, async (req, res, next) => {
  try {
    const input = recapSchema.parse(req.body);
    res.json(await createBattleRecap(input));
  } catch (error) {
    next(error);
  }
});

export { router as aiRouter };
