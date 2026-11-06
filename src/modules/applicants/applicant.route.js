import express from "express";
import { ApplicantController } from "./applicant.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { ApplicantValidation } from "./applicant.validation.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validateRequest(ApplicantValidation.createApplicantSchema),
  ApplicantController.applyForTrainer,
);
router.get("/", verifyToken, verifyAdmin, ApplicantController.getAllApplicants);
router.get("/:id", verifyToken, ApplicantController.getApplicantById);
router.patch(
  "/:id",
  verifyToken,
  verifyAdmin,
  ApplicantController.rejectApplication,
);
router.delete("/:id", verifyToken, ApplicantController.deleteApplication);

export const ApplicantRouter = router;
