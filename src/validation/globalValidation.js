import z from "zod";

const emailQuerySchema = z.object({
  query: z
    .object({
      email: z.email({ error: "Invalid email address" }).toLowerCase().trim(),
    })
    .partial(),
});

export const globalValidation = {
  emailQuerySchema,
};
