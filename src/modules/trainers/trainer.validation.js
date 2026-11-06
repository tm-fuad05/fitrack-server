import z from "zod";
import { ApplicantValidation } from "../applicants/applicant.validation.js";

const createTrainerSchema = z.object({
  body: ApplicantValidation.createApplicantSchema.shape.body.omit({
    status: true,
  }),
});

const trainerSlotSchema = z.object({
  body: ApplicantValidation.createApplicantSchema.shape.body.pick({
    availableDays: true,
  }),
});

export const TrainerValidation = {
  createTrainerSchema,
  trainerSlotSchema,
};
