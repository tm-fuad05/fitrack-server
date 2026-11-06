import { ApplicantValidation } from "../applicants/applicant.validation.js";

const createTrainerSchema =
  ApplicantValidation.createApplicantSchema.shape.body.omit({
    status: true,
  });

export const TrainerValidation = {
  createTrainerSchema,
};
