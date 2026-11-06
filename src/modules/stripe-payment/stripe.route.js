import express from "express";
import stripe from "stripe";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Payment intent
router.post("/", verifyToken, async (req, res) => {
  const { price } = req.body;

  const amount = parseInt(price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

export const StripeRouter = router;
