import { client } from "./config/dbConnect.js";

import express from "express";
import cors from "cors";
import stripe from "stripe";
import {
  verifyAdmin,
  verifyTrainer,
  verifyAdminORTrainer,
} from "./middlewares/verifyUserRole.middleware.js";
import { AuthRouter } from "./modules/authentication/auth.route.js";
import { UserRouter } from "./modules/users/user.route.js";
import { verifyToken } from "./middlewares/verifyToken.middleware.js";
import { ReviewRouter } from "./modules/reviews/review.route.js";
import { NewsletterRouter } from "./modules/newsletters/newsletter.route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://fitrackbd.vercel.app"],
  }),
);
app.use(express.json());

// Auth
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/newsletters", NewsletterRouter);

// Database & Collection
const database = client.db("FitRackDB");

const communityCollection = database.collection("community");
const trainerCollection = database.collection("trainers");
const classCollection = database.collection("classes");
const appliedTrainerCollection = database.collection("applied trainers");
const paymentCollection = database.collection("payments");
const rejectionFeedbackCollection = database.collection("Rejection Feedback");

// All Classes API --------------------------
app.post("/classes", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const classInfo = req.body;

    if (!classInfo || Object.keys(classInfo).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Class data is required." });
    }

    const result = await classCollection.insertOne(classInfo);
    if (result.insertedId) {
      return res.status(201).json({ success: true });
    }
    return res.status(500).json({ success: false, message: "Failed to post." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Classes get -----------------------------
app.get("/classes", async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const result = await classCollection.find(query).toArray();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Community API -----------------------
app.post("/community", verifyToken, verifyAdminORTrainer, async (req, res) => {
  try {
    const forumInfo = req.body;

    if (!forumInfo || Object.keys(forumInfo).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Forum info is required." });
    }

    const result = await communityCollection.insertOne(forumInfo);
    if (result.insertedId) {
      return res.status(201).json({ success: true });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to post forum." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Community get-----------------------
app.get("/community", async (req, res) => {
  try {
    const result = await communityCollection
      .find()
      .sort({ date: -1 })
      .toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});
// Recent Community---------------------
app.get("/recent-community", async (req, res) => {
  try {
    const result = await communityCollection
      .find()
      .sort({ date: -1 })
      .limit(6)
      .toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// UpVote---------------------
app.patch("/community/upvote/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userEmail = req.decoded?.email;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format." });
    }

    const filter = { _id: new ObjectId(id) };
    const existingForum = await communityCollection.findOne(filter);
    if (!existingForum) {
      return res
        .status(404)
        .json({ success: false, message: "Forum not found." });
    }

    const isAlreadyUpvoted = existingForum.votedBy?.includes(userEmail);

    let updateDoc = {};

    if (isAlreadyUpvoted) {
      updateDoc = {
        $pull: { votedBy: userEmail },
      };
    } else {
      updateDoc = {
        $addToSet: { votedBy: userEmail },
      };
    }

    const result = await communityCollection.updateOne(filter, updateDoc);
    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true });
    }
    console.log(result.modifiedCount);
    return res
      .status(200)
      .json({ success: false, message: "No changess were made." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

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

// app.delete(
//   "/trainers/:email",
//   verifyToken,
//   VerifyAdmin,
//   async (req, res) => {
//     try {
//       const email = req.params.email;
//       const result = await trainerCollection.deleteOne(email);
//       if (result.deletedCount > 0) {
//         return res.status(200).json({ success: true, data: result });
//       }
//       return res.status(404).json({
//         success: false,
//         message: "Trainer not found or already deleted.",
//       });
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal server error." });
//     }
//   },
// );

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

// Payments---------------------------
app.post("/payments", verifyToken, async (req, res) => {
  try {
    const paymentInfo = req.body;

    if (!paymentInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Payment info required." });
    }
    const result = await paymentCollection.insertOne(paymentInfo);
    if (result.insertedId) {
      return res.status(200).json({ success: true });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to record payment information.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});
// Payments get------------
app.get("/payments", verifyToken, async (req, res) => {
  try {
    const result = await paymentCollection.find().toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Recent 6 transaction---------------------------
app.get("/recent-payments", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await paymentCollection
      .find()
      .sort({ _id: -1 })
      .limit(6)
      .toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});
// ------------------------
app.get("/payments/user", verifyToken, async (req, res) => {
  try {
    const email = req.query.email;
    const result = await paymentCollection.find({ email }).toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Applied Trainer -------------------------
app.post("/applied-as-trainer", verifyToken, async (req, res) => {
  try {
    const trainerInfo = req.body;

    if (!trainerInfo || Object.keys(trainerInfo).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Trainer Info not found." });
    }
    const existingApplicant = await appliedTrainerCollection.findOne({
      email: trainerInfo.email,
    });
    if (existingApplicant) {
      return res.status(409).json({
        success: false,
        message: "Already applied.",
      });
    }
    const result = await appliedTrainerCollection.insertOne(trainerInfo);

    if (result.insertedId) {
      return res.status(201).json({ success: true });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to apply." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});
// Applied trainers get-------------------------
app.get("/applied-as-trainer", verifyToken, async (req, res) => {
  try {
    const result = await appliedTrainerCollection.find().toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});
// Single applicant get----------------------
app.get("/applied-as-trainer/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format." });
    }

    const result = await appliedTrainerCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!result) {
      return res.status(404).json({ success: false, message: "not found." });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});
// Reject applicant ---------------------------
app.patch(
  "/applied-as-trainer/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const applicantId = req.params.id;

      if (!ObjectId.isValid(applicantId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid ID format." });
      }

      const filter = { _id: new ObjectId(applicantId) };
      const updateStatus = {
        $set: {
          status: "rejected",
        },
      };

      const existingApplicant = await appliedTrainerCollection.findOne(filter);

      if (!existingApplicant) {
        return res
          .status(404)
          .json({ success: false, message: "Applicant not found." });
      }

      const result = await appliedTrainerCollection.updateOne(
        filter,
        updateStatus,
      );
      if (result.modifiedCount > 0) {
        return res.status(200).json({ success: true });
      }
      return res
        .status(200)
        .json({ success: false, message: "No changes were made." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "internal server error." });
    }
  },
);
//  Delete applicant -------------------------------
app.delete("/applied-as-trainer/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };

    const existingApplicant = await appliedTrainerCollection.findOne(query);
    if (!existingApplicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found.",
      });
    }

    const result = await appliedTrainerCollection.deleteOne(query);

    if (result.deletedCount > 0) {
      return res.status(200).json({ success: true });
    }
    return res.status(404).json({
      success: false,
      message: "Applicant not found or already deleted.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Rejection Feedback-----------------------
app.post("/rejection-feedback", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const feedback = req.body;

    if (!feedback) {
      return res
        .status(400)
        .json({ success: false, message: "Feedback not found." });
    }

    const result = await rejectionFeedbackCollection.insertOne(feedback);
    if (result.insertedId) {
      return res.status(200).json({ success: true });
    }
    return res
      .status(500)
      .json({ success: false, message: " Internal server error" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: " Internal server error" });
  }
});

// ------------------
app.get("/rejection-feedback", verifyToken, async (req, res) => {
  try {
    const result = await rejectionFeedbackCollection.find().toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

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
