import mongoose, { Schema } from "mongoose";

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
      max: 999999
    },
    wins: {
      type: Number,
      default: 0,
      min: 0
    },
    losses: {
      type: Number,
      default: 0,
      min: 0
    },
    team: {
      type: [String],
      default: []
    },
    opponent: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

scoreSchema.index({ score: -1, createdAt: -1 });

export const Score = mongoose.model<ScoreDocument>("Score", scoreSchema);
