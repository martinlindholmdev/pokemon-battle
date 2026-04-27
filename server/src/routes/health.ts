import { Router } from "express";
import { env } from "../config/env.js";
import { getMongoState, pingDatabase } from "../config/db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const mongoState = getMongoState();
  let mongoPing = false;

  if (mongoState === "connected") {
    try {
      mongoPing = await pingDatabase();
    } catch {
      mongoPing = false;
    }
  }

  res.status(mongoState === "connected" && mongoPing ? 200 : 503).json({
    status: mongoState === "connected" && mongoPing ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    mongo: {
      state: mongoState,
      ping: mongoPing
    }
  });
});

export { router as healthRouter };
