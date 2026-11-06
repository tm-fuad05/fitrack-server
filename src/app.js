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

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://fitrackbd.vercel.app"],
  }),
);
app.use(express.json());

// Root Api
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fitrack server running...",
  });
});

// Project APIs
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/newsletters", NewsletterRouter);
app.use("/api/v1/classes", ClassRouter);
app.use("/api/v1/communities", CommunityRouter);
app.use("/api/v1/rejection-feedback", RejectionFeedbackRouter);
app.use("/api/v1/transactions", TransactionRouter);
app.use("/api/v1/applicants", ApplicantRouter);
app.use("/api/v1/trainers", TrainerRouter);
app.use("/api/v1/create-payment-intent", StripeRouter);

export default app;
