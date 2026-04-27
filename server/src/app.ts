import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import express from "express";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { leaderboardRouter } from "./routes/leaderboard.js";
import { healthRouter } from "./routes/health.js";
import { aiRouter } from "./routes/ai.js";
import { errorHandler } from "./middleware/error.js";
import { requireDatabase } from "./middleware/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(express.json({ limit: "100kb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", requireDatabase, authRouter);
  app.use("/api/leaderboard", requireDatabase, leaderboardRouter);
  app.use("/api/ai", requireDatabase, aiRouter);

  app.use("/auth", requireDatabase, authRouter);
  app.use("/leaderboard", requireDatabase, leaderboardRouter);

  const clientDistCandidates = [
    path.resolve(process.cwd(), "client/dist"),
    path.resolve(__dirname, "../../client/dist")
  ];
  const clientDist = clientDistCandidates.find((candidate) => fs.existsSync(path.join(candidate, "index.html"))) ?? clientDistCandidates[0];
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(clientDist, "index.html"));
      return;
    }
    next();
  });

  app.use(errorHandler);

  return app;
}
