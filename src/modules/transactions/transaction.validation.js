import z from "zod";

const createTransactionSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(3, { error: "Name must be at least 3 characters" })
      .trim(),
    email: z.email().toLowerCase().trim(),
    price: z.coerce
      .number({ error: "Price is required" })
      .min(1, { error: "Price is required" }),
    slot: z
      .string({ error: "Slot is required" })
      .min(1, { error: "Slot is required" })
      .trim(),
    membershipType: z
      .string({ error: "Membership is required" })
      .min(1, { error: "Membership is required" })
      .trim(),
    trainer: z
      .string({ error: "Trainer name is required" })
      .min(1, { error: "Trainer name is required" })
      .trim(),
  }),
});

const transactionQuerySchema = z.object({
  query: createTransactionSchema.shape.body.pick({ email: true }),
});

export const TransactionValidation = {
  createTransactionSchema,
  transactionQuerySchema,
};
