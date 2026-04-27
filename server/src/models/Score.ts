import mongoose, { Schema } from "mongoose";

const maxServerVerifiedScore = 1200;

export interface ScoreDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  wins: number;
  losses: number;
  team: string[];
  opponent: string;
  createdAt: Date;
}

const scoreSchema = new Schema<ScoreDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: maxServerVerifiedScore
    },
    wins: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    losses: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    team: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length >= 1 && value.length <= 6,
        message: "Team must contain between one and six Pokemon"
      }
    },
    opponent: {
      type: String,
      default: "",
      maxlength: 40
    }
  },
  { timestamps: true }
);

scoreSchema.index({ score: -1, createdAt: -1 });

export const Score = mongoose.model<ScoreDocument>("Score", scoreSchema);
