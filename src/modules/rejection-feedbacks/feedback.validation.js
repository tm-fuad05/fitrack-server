import z from "zod";

const createRejectionFeedbackSchema = z.object({
  body: z.object({
    email: z.email().toLowerCase().trim(),
    feedback: z
      .string({ error: "Feedback message is required" })
      .min(1, { error: "Feedback message is required" })
      .trim(),
  }),
});

const rejectionFeedbackQuerySchema = z.object({
  query: createRejectionFeedbackSchema.shape.body.pick({ email: true }),
});

export const RejectionFeedbackValidation = {
  createRejectionFeedbackSchema,
  rejectionFeedbackQuerySchema,
};
