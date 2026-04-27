import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import { battleSubmissionSchema, verifyBattleSubmission } from "../services/battle.js";
import { createBattleRecap } from "../services/aiCoach.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

const recapLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const recapSchema = battleSubmissionSchema;

router.post("/battle-recap", recapLimiter, requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Authentication required");
    }

    const input = recapSchema.parse(req.body);
    const result = verifyBattleSubmission(req.user.id, input);
    res.json(
      await createBattleRecap({
        player: result.team[0] ?? "trainer",
        opponent: result.opponent,
        result: result.outcome,
        score: result.score,
        turns: result.turns
      })
    );
  } catch (error) {
    next(error);
  }
});

export { router as aiRouter };
