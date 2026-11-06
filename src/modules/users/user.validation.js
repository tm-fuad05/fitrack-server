import z from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min("3", { error: "Name must be at least 3 characters" })
      .trim(),
    email: z.email().trim().toLowerCase(),
    role: z
      .enum(["ADMIN", "TRAINER", "MEMBER"], {
        error: "Role can be ADMIN, TRAINER or MEMBER",
      })
      .default("MEMBER"),
  }),
});

const updateUserSchema = createUserSchema.shape.body
  .omit({
    role: true,
  })
  .partial();

const updateUserRoleSchema = createUserSchema.shape.body.pick({
  role: true,
});

const userQuerySchema = z.object({
  params: z.object({
    email: z.email().trim().toLowerCase(),
  }),
});

// export type createUserSchemaType =z.infer<typeof createUserSchema>

export const UserValidation = {
  createUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
  userQuerySchema,
};
