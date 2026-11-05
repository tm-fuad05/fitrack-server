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

const rejectionFeedbackParamsSchema = z.object({
  params: z.object({
    email: z.email().toLowerCase().trim(),
  }),
});

export const RejectionFeedbackValidation = {
  createRejectionFeedbackSchema,
  rejectionFeedbackParamsSchema,
};
