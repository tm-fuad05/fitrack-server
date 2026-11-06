import z from "zod";

const createApplicantSchema = z.object({
  body: z.object({
    fullName: z
      .string({ error: "Name is required" })
      .min(3, { error: "Name must be at least 3 characters" })
      .trim(),
    email: z.email().toLowerCase().trim(),
    age: z.coerce
      .number({ error: "Age is required" })
      .gte(18, { error: "Under 18 is not allowed to be a trainer" }),
    profileImage: z.url({ error: "Please enter a valid url" }),
    yearsOfExperience: z.coerce
      .number({ error: "Experience year is required" })
      .gte(2, {
        error: "You must have 2 years of experiecne to apply as a trainer",
      }),
    skills: z
      .array(
        z
          .string({ error: "Skills are required" })
          .min(1, { error: "Can't be empty string" })
          .trim(),
      )
      .nonempty({ error: "Skills are required" }),
    availableDays: z
      .array(
        z.enum(
          [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          {
            error: "Please enter a valid day's name, e.g. (Saturday,Sunday...)",
          },
        ),
      )
      .nonempty(),
    availableTime: z
      .string({ error: "Available time is required" })
      .min(1, { error: "Available time is required" })
      .trim(),
    status: z.enum(["pending", "rejected"]).default("pending"),
  }),
});

const updateApplicantSchema = z.object({
  body: createApplicantSchema.shape.body
    .omit({
      status: true,
    })
    .partial(),
});

export const ApplicantValidation = {
  createApplicantSchema,
  updateApplicantSchema,
};
