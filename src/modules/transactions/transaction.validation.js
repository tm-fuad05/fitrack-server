import z from "zod";

const createPaymentSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(1, { error: "Name is required" })
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

const paymentQuerySchema = z.object({
  query: z.object({
    email: z.email().toLowerCase().trim(),
  }),
});

export const TransactionValidation = {
  createPaymentSchema,
  paymentQuerySchema,
};
