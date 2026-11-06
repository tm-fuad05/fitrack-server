import { Schema, model } from "mongoose";

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    trainers: {
      type: [String],
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Class = model("Class", classSchema);
