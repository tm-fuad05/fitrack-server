import express from "express";
import { ReviewController } from "./review.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { ReviewValidation } from "./review.validation.js";

const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.post(
  "/",
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.addReview,
);

export const ReviewRouter = router;
