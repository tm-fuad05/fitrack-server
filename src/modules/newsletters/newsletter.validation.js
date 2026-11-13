import z from "zod";

const createNewsletterSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(3, { error: "Name must be at least 3 characters" })
      .trim(),
    email: z.email({ error: "Invalid email address" }).trim().toLowerCase(),
    phone: z.string({ error: "Phone number is required" }).min(10).trim(),
    subject: z
      .string({ error: "Subject is required" })
      .min(1, { error: "Subject is required" })
      .trim(),
    message: z
      .string({ error: "Message is required" })
      .min(1, { error: "Message is required" })
      .trim(),
  }),
});

export const NewsletterValidation = {
  createNewsletterSchema,
};
