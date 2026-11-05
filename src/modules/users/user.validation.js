import z from "zod";

const createUserSchema = z.object({
  body: {
    name: z
      .string({ error: "Name is required" })
      .min("3", { error: "Name must be at least 3 characters" })
      .trim(),
    email: z.email({ error: "Invalid email address" }).trim().toLowerCase(),
    role: z.enum(["ADMIN", "TRAINER", "MEMBER"], {
      error: "Role can be ADMIN, TRAINER or MEMBER",
    }),
  },
});

const updateUserSchema = createUserSchema.partial();

// export type createUserSchemaType =z.infer<typeof createUserSchema>

export const UserValidation = {
  createUserSchema,
  updateUserSchema,
};
