import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Score } from "../models/Score.js";

const router = Router();

const scoreLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const scoreSchema = z.object({
  score: z.number().int().min(0).max(999999),
  wins: z.number().int().min(0).max(999).default(0),
  losses: z.number().int().min(0).max(999).default(0),
  team: z.array(z.string().trim().min(1).max(40)).max(6).default([]),
  opponent: z.string().trim().max(40).default("")
});

router.get("/", async (_req, res, next) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1, createdAt: -1 })
      .limit(25)
      .populate("userId", "displayName")
      .lean();

    res.json({
      scores: scores.map((entry) => {
        const user = entry.userId as unknown as { displayName?: string };
        return {
          id: String(entry._id),
          score: entry.score,
          wins: entry.wins,
          losses: entry.losses,
          team: entry.team,
          opponent: entry.opponent,
          createdAt: entry.createdAt,
          displayName: user.displayName ?? "Trainer"
        };
      })
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", scoreLimiter, requireAuth, async (req, res, next) => {
  try {
    const input = scoreSchema.parse(req.body);
    const score = await Score.create({
      ...input,
      userId: req.user?.id
    });

    res.status(201).json({ score });
  } catch (error) {
    next(error);
  }
});

export { router as leaderboardRouter };
