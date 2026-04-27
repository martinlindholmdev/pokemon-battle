import type { NextFunction, Request, Response } from "express";
import { getMongoState } from "../config/db.js";

export function requireDatabase(_req: Request, res: Response, next: NextFunction) {
  if (getMongoState() !== "connected") {
    res.status(503).json({
      error: "Database unavailable",
      details: "MongoDB Atlas is not reachable from the server. Check Atlas Network Access for the Render service."
    });
    return;
  }

  next();
}
