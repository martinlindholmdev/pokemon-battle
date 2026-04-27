import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  void _next;
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }

  res.status(500).json({
    error: "Unexpected server error",
    details: env.isProduction ? undefined : err instanceof Error ? err.message : String(err)
  });
};
