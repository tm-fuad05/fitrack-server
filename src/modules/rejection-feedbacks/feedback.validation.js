import z from "zod";

const createRejectionFeedbackSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email address" }).toLowerCase().trim(),
    feedback: z
      .string({ error: "Feedback message is required" })
      .min(1, { error: "Feedback message is required" })
      .trim(),
  }),
});

export const RejectionFeedbackValidation = {
  createRejectionFeedbackSchema,
};
