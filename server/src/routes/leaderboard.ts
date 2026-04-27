import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import { Score } from "../models/Score.js";
import {
  battleSubmissionSchema,
  isPublicScoreLike,
  maxVerifiedScore,
  verifyBattleSubmission
} from "../services/battle.js";
import { createBattleRecap } from "../services/aiCoach.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

const scoreLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

router.get("/", async (_req, res, next) => {
  try {
    const scores = await Score.find({
      score: { $gte: 0, $lte: maxVerifiedScore },
      wins: { $in: [0, 1] },
      losses: { $in: [0, 1] }
    })
      .sort({ score: -1, createdAt: -1 })
      .limit(100)
      .populate("userId", "displayName")
      .lean();

    res.json({
      scores: scores.filter(isPublicScoreLike).slice(0, 25).map((entry) => {
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
    if (!req.user) {
      throw new HttpError(401, "Authentication required");
    }

    const input = battleSubmissionSchema.parse(req.body);
    const result = verifyBattleSubmission(req.user.id, input);
    const score = await Score.create({
      score: result.score,
      wins: result.wins,
      losses: result.losses,
      team: result.team,
      opponent: result.opponent,
      userId: req.user.id
    });
    const recap = await createBattleRecap({
      player: result.team[0] ?? "trainer",
      opponent: result.opponent,
      result: result.outcome,
      score: result.score,
      turns: result.turns
    });

    res.status(201).json({
      score: {
        id: String(score._id),
        score: score.score,
        wins: score.wins,
        losses: score.losses,
        team: score.team,
        opponent: score.opponent,
        createdAt: score.createdAt,
        displayName: req.user.displayName
      },
      result,
      recap
    });
  } catch (error) {
    next(error);
  }
});

export { router as leaderboardRouter };
