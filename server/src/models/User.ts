import mongoose, { Schema } from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160
    },
    passwordHash: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
