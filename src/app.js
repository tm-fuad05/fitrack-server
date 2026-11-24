import express from "express";
import cors from "cors";
import { AuthRouter } from "./modules/authentication/auth.route.js";
import { UserRouter } from "./modules/users/user.route.js";
import { ReviewRouter } from "./modules/reviews/review.route.js";
import { NewsletterRouter } from "./modules/newsletters/newsletter.route.js";
import { ClassRouter } from "./modules/classes/class.route.js";
import { CommunityRouter } from "./modules/communities/community.route.js";
import { RejectionFeedbackRouter } from "./modules/rejection-feedbacks/feedback.route.js";
import { TransactionRouter } from "./modules/transactions/transaction.route.js";
import { ApplicantRouter } from "./modules/applicants/applicant.route.js";
import { TrainerRouter } from "./modules/trainers/trainer.route.js";
import { StripeRouter } from "./modules/stripe-payment/stripe.route.js";
import { UploadRouter } from "./modules/upload/upload.router.js";

const app = express();
const root = express.Router();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://fitrackbd.vercel.app"],
  }),
);
app.use(express.json());

// Root Api
app.use("/api/v1");

// Project APIs
root.use("/auth", AuthRouter);
root.use("/users", UserRouter);
root.use("/reviews", ReviewRouter);
root.use("/newsletters", NewsletterRouter);
root.use("/classes", ClassRouter);
root.use("/communities", CommunityRouter);
root.use("/rejection-feedback", RejectionFeedbackRouter);
root.use("/transactions", TransactionRouter);
root.use("/applicants", ApplicantRouter);
root.use("/trainers", TrainerRouter);
root.use("/create-payment-intent", StripeRouter);
root.use("/upload-image", UploadRouter);

// Health Check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fitrack server running...",
  });
});

export default app;
