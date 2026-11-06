import { ApplicantValidation } from "../applicants/applicant.validation.js";

const createTrainerSchema =
  ApplicantValidation.createApplicantSchema.shape.body.omit({
    status: true,
  });

const trainerSlotSchema =
  ApplicantValidation.createApplicantSchema.shape.body.pick({
    availableDays: true,
  });

export const TrainerValidation = {
  createTrainerSchema,
  trainerSlotSchema,
};
