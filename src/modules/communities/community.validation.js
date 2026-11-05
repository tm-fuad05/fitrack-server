import z from "zod";

const createCommunitySchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" })
      .min(1, { error: "Title is required" })
      .trim(),
    author: z
      .string({ error: "Author name is required" })
      .min(1, { error: "Author name is required" })
      .trim(),
    category: z
      .string({ error: "Category is required" })
      .min(1, { error: "Category is required" })
      .trim(),
    role: z.enum(["ADMIN", "TRAINER"], {
      error: "Only ADMIN and TRAINER can post communities",
    }),
    description: z
      .string({ error: "Description is required" })
      .min(1, { error: "Description is required" }),
    votedBy: z.array(z.email()).default([]),
  }),
});

export const CommunityValidation = {
  createCommunitySchema,
};
