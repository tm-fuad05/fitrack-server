import z from "zod";

const authSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email address" }).toLowerCase().trim(),
  }),
});

export const AuthValidation = {
  authSchema,
};
