import z from "zod";

const authSchema = z.object({
  body: z.object({
    email: z.email().toLowerCase().trim(),
  }),
});

export const AuthValidation = {
  authSchema,
};
