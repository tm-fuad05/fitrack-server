import z from "zod";

const createClassSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Class name is required" })
      .min(1, { error: "Class name is required" })
      .trim(),
    description: z
      .string({ error: "Description is required" })
      .min(1, { error: "Description is required" })
      .trim(),
    trainers: z
      .array(z.string().min(1, { error: "Can't be empty" }))
      .nonempty({ error: "At least one trainer is required" }),
  }),
});

export const ClassValidation = {
  createClassSchema,
};
