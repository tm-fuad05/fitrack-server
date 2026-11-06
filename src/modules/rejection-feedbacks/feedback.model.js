import { Schema, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Feedback = model("Feedback", feedbackSchema);
