import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "TRAINER", "MEMBER"],
      default: "MEMBER",
      trim: true,
    },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
