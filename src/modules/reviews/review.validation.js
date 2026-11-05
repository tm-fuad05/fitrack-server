import z from "zod";

const createReviewSchema = z.object({
  body: {
    name: z
      .string({ error: "Name is required" })
      .min("3", { error: "Name must be at least 3 characters" })
      .trim(),
    rating: z.coerce.number({ error: "Ratings are required" }),
    review: z.string({ error: "Review message is required" }).trim(),
  },
});

export const ReviewValidation = {
  createReviewSchema,
};
