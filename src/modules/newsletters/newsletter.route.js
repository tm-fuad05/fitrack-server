import express from "express";
import { NewsletterController } from "./newsletter.controller.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { NewsletterValidation } from "./newsletter.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  verifyAdmin,
  NewsletterController.getAllNewsletter,
);

router.post(
  "/",
  validateRequest(NewsletterValidation.createNewsletterSchema),
  NewsletterController.addNewsletter,
);

export const NewsletterRouter = router;
