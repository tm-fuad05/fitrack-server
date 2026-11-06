import { Schema, model } from "mongoose";

const communitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "TRAINER"],
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    votedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Community = model("Community", communitySchema);
