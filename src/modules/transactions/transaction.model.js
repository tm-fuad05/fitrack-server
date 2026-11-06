import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    slot: {
      type: String,
      required: true,
      trim: true,
    },
    membershipType: {
      type: String,
      required: true,
      trim: true,
    },
    trainer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Transaction = model("Transaction", transactionSchema);
