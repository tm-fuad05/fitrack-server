import { client } from "./config/dbConnect.js";

import express from "express";
import cors from "cors";
import stripe from "stripe";
import {
  verifyAdmin,
  verifyTrainer,
} from "./middlewares/verifyUserRole.middleware.js";
import { AuthRouter } from "./modules/authentication/auth.route.js";
import { UserRouter } from "./modules/users/user.route.js";
import { verifyToken } from "./middlewares/verifyToken.middleware.js";
import { ReviewRouter } from "./modules/reviews/review.route.js";
import { NewsletterRouter } from "./modules/newsletters/newsletter.route.js";
import { ClassRouter } from "./modules/classes/class.route.js";
import { CommunityRouter } from "./modules/communities/community.route.js";
import { RejectionFeedbackRouter } from "./modules/rejection-feedbacks/feedback.route.js";
import { TransactionRouter } from "./modules/transactions/transaction.route.js";
import { ApplicantRouter } from "./modules/applicants/applicant.route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://fitrackbd.vercel.app"],
  }),
);
app.use(express.json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/newsletters", NewsletterRouter);
app.use("/api/v1/classes", ClassRouter);
app.use("/api/v1/communities", CommunityRouter);
app.use("/api/v1/rejection-feedback", RejectionFeedbackRouter);
app.use("/api/v1/transactions", TransactionRouter);
app.use("/api/v1/applicants", ApplicantRouter);

// Database & Collection
const database = client.db("FitRackDB");

const trainerCollection = database.collection("trainers");

// All Trainers Api -------------------------------
app.post("/trainers", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const trainer = req.body;

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainers not found." });
    }
    const existingTrainer = await trainerCollection.findOne({
      email: trainer.email,
    });

    if (existingTrainer) {
      return res.status(409).json({
        success: false,
        message: "The trainer is already exists.",
      });
    }

    const result = await trainerCollection.insertOne(trainer);

    if (result.insertedId) {
      return res.status(201).json({ success: true, data: result });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to add trainer." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});
// All trainers get ---------------------------
app.get("/trainers", async (req, res) => {
  try {
    const sort = req.query?.sort;
    let sortQuery = {};

    if (sort === "age") {
      sortQuery = { age: 1 };
    }
    if (sort === "trainer experience") {
      sortQuery = { yearsOfExperience: -1 };
    }
    const result = await trainerCollection.find().sort(sortQuery).toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});
// Single trainer get for details---------------
app.get("/trainers/:trainerName", async (req, res) => {
  try {
    const trainerName = req.params.trainerName;

    if (!trainerName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Trainer is required." });
    }
    const query = {
      fullName: trainerName,
    };

    const result = await trainerCollection.findOne(query);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "trainer not found." });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// Manage Slots : (Delete)------------------------
app.patch(
  "/trainers/deleteSlot/:id",
  verifyToken,
  verifyTrainer,
  async (req, res) => {
    try {
      const id = req.params.id;
      const managedSlots = req.body;
      if (!managedSlots?.availableDays) {
        return res
          .status(404)
          .json({ success: false, message: "availabledays not found." });
      }

      const filter = { _id: new ObjectId(id) };
      const updatedSlots = {
        $set: {
          availableDays: managedSlots.availableDays,
        },
      };

      const existingSlot = await trainerCollection.findOne(filter);

      if (!existingSlot) {
        return res
          .status(404)
          .json({ success: false, message: "Trainer not found." });
      }

      const result = await trainerCollection.updateOne(filter, updatedSlots);
      if (result.modifiedCount > 0) {
        return res.status(200).json({ success: true });
      }
      return res
        .status(200)
        .json({ success: false, message: "No changes made." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: true, message: "Internal server error." });
    }
  },
);

// Add Slot----------------------------------
app.patch(
  "/trainers/addSlot/:id",
  verifyToken,
  verifyTrainer,
  async (req, res) => {
    try {
      const id = req.params.id;
      const addedSlots = req.body;

      if (!addedSlots?.availableDays) {
        return res
          .status(404)
          .json({ success: false, message: "availableDays not found." });
      }

      const filter = { _id: new ObjectId(id) };
      const updatedSlots = {
        $set: {
          availableDays: addedSlots.availableDays,
        },
      };

      const existingSlot = await trainerCollection.findOne(filter);

      if (!existingSlot) {
        return res
          .status(404)
          .json({ success: false, message: "Trainer not found" });
      }
      const result = await trainerCollection.updateOne(filter, updatedSlots);
      if (result.modifiedCount > 0) {
        return res.status(200).json({ success: true });
      }
      return res
        .status(200)
        .json({ success: false, message: "No changes made." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: " Internal server error." });
    }
  },
);

// Payment intent
app.post("/create-payment-intent", verifyToken, async (req, res) => {
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

app.get("/", (req, res) => {
  res.json("Hello World!");
});

export default app;
