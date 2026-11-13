import express from "express";
import { ApplicantController } from "./applicant.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { ApplicantValidation } from "./applicant.validation.js";
import { globalValidation } from "../../validation/globalValidation.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validateRequest(ApplicantValidation.createApplicantSchema),
  ApplicantController.applyForTrainer,
);

router.get("/", verifyToken, verifyAdmin, ApplicantController.getAllApplicants);

router.get(
  "/my-application",
  verifyToken,
  validateRequest(globalValidation.emailQuerySchema),
  ApplicantController.getApplicantByEmail,
);

router.get(
  "/:id",
  verifyToken,
  verifyAdmin,
  ApplicantController.getApplicantById,
);

router.patch(
  "/reject/:id",
  verifyToken,
  verifyAdmin,
  ApplicantController.rejectApplication,
);
router.delete(
  "/delete",
  verifyToken,
  validateRequest(globalValidation.emailQuerySchema),
  ApplicantController.deleteApplication,
);

export const ApplicantRouter = router;
