import express from "express";
import { RejectionFeedbackController } from "./feedback.controller.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { RejectionFeedbackValidation } from "./feedback.validation.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  verifyAdmin,
  RejectionFeedbackController.getAllRejectionFeedbacks,
);
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  validateRequest(RejectionFeedbackValidation.createRejectionFeedbackSchema),
  RejectionFeedbackController.addRejectionFeedback,
);
router.get(
  "/:email",
  verifyToken,
  verifyAdmin,
  validateRequest(RejectionFeedbackValidation.rejectionFeedbackParamsSchema),
  RejectionFeedbackController.getRejectionFeedbackByEmail,
);

export const RejectionFeedbackRouter = router;
