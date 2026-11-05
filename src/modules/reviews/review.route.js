import express from "express";
import { ReviewController } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.post(
  "/",
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.addReview,
);

export const ReviewRouter = router;
