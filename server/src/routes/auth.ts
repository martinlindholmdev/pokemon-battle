import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const registerSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(2).max(32)
});

const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(1).max(128)
});

function profile(user: { id: string; displayName: string }) {
  return {
    id: user.id,
    displayName: user.displayName
  };
}

router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const email = input.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      throw new HttpError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await User.create({
      email,
      displayName: input.displayName,
      passwordHash
    });
    const safeUser = profile(user);
    res.status(201).json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    next(error);
  }
});

router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await User.findOne({ email: input.email.toLowerCase() });

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const matches = await bcrypt.compare(input.password, user.passwordHash);
    if (!matches) {
      throw new HttpError(401, "Invalid email or password");
    }

    const safeUser = profile(user);
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
