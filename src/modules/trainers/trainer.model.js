import { Schema, model } from "mongoose";

const trainerSchema = new Schema(
  {
    fullName: {
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
    age: {
      type: Number,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
      trim: true,
    },
    availableDays: {
      type: [String],
      required: true,
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      trim: true,
    },
    availableTime: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Trainer = model("Trainer", trainerSchema);
