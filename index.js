require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SEC_KEY);
const port = process.env.PORT || 5000;
var jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmsil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Database & Collection
    const database = client.db("FitRackDB");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");
    const communityCollection = database.collection("community");
    const trainerCollection = database.collection("trainers");
    const classCollection = database.collection("classes");
    const appliedTrainerCollection = database.collection("applied trainers");
    const paymentCollection = database.collection("payments");
    const rejectionFeedbackCollection =
      database.collection("Rejection Feedback");
    const newsletterCollection = database.collection("newsletter");

    // MiddleWares
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized access!" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            return res.status(401).json({ message: "Unauthorized access!" });
          }
          req.decoded = decoded;
          next();
        }
      );
    };
    // VerifyAdmin;
    const VerifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
      }
      next();
    };
    // VerifyTrainer
    const VerifyTrainer = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await userCollection.findOne({ email: email });
      const isTrainer = user?.role === "trainer";
      if (!isTrainer) {
        return res.status(403).json({ message: "Forbidden access" });
      }
      next();
    };

    // VerifyAdminORTrainer
    const VerifyAdminORTrainer = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await userCollection.findOne({ email: email });
      const isTrainer = user?.role === "trainer";
      const isAdmin = user?.role === "admin";
      if (!isTrainer && !isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
      }
      next();
    };

    // JWT API --------------------------
    app.post("/jwt", async (req, res) => {
      try {
        const user = req.body;
        if (!user?.email) {
          return res
            .status(400)
            .json({ success: false, message: "invalid email" });
        }
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "24h",
        });

        return res.status(200).json({
          success: true,
          token,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // Admin Check ---------------------
    app.get("/user/admin/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;

        if (!email) {
          return res
            .status(400)
            .json({ success: false, message: "Email is required" });
        }

        if (email !== req.decoded.email) {
          return res
            .status(403)
            .json({ success: false, message: "Forbidden access!" });
        }

        const user = await userCollection.findOne({ email: email });

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        }

        const isAdmin = user?.role === "admin";

        return res.status(200).json({ isAdmin });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // Trainer check---------------

    app.get("/user/trainer/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;

        if (!email) {
          return res
            .status(400)
            .json({ success: false, message: "Email is required." });
        }

        if (email !== req.decoded.email) {
          return res
            .status(403)
            .json({ success: false, message: "Forbidden access!" });
        }

        const user = await userCollection.findOne({ email: email });

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        }
        const isTrainer = user?.role === "trainer";
        return res.status(200).json({ isTrainer });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // User API---------------------------------
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;

        if (!user?.email) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid email" });
        }
        // Except registration
        const query = { email: user?.email };
        const existing = await userCollection.findOne(query);
        if (existing) {
          return res
            .status(409)
            .json({ success: false, message: "User already exists" });
        }
        const result = await userCollection.insertOne(user);

        if (result.insertedId) {
          return res.status(201).json({
            success: true,
            data: result,
          });
        }
        return res.status(500).json({
          success: false,
          message: "Failed to add the user.",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message:
            "Server was unable to fulfill a request due to an unexpected condition!",
        });
      }
    });
    //  Users get-----------------------------
    app.get("/users", verifyToken, async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        return res.status(200).json(result);
      } catch (error) {
        return res
          .status(404)
          .json({ success: false, message: "Users not found!" });
      }
    });

    // Update User Info : (Name)-------------------
    app.patch("/users/:id", verifyToken, async (req, res) => {
      try {
        const userId = req.params.id;
        const updatedUserInfo = req.body;

        if (!updatedUserInfo?.name) {
          return res
            .status(404)
            .json({ success: false, message: "UserInfo not found." });
        }
        const filter = { _id: new ObjectId(userId) };
        const updatedProfile = {
          $set: {
            name: updatedUserInfo.name,
          },
        };

        const existingUser = await userCollection.findOne(filter);
        if (!existingUser) {
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        }

        const result = await userCollection.updateOne(filter, updatedProfile);
        if (result.modifiedCount > 0) {
          return res.status(200).json({ success: true });
        }
        return res
          .status(200)
          .json({ success: false, message: "No changes made." });
      } catch (error) {
        console.error(error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request." });
      }
    });

    //  Make user admin------------------
    app.patch(
      "/users/make-admin/:id",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        try {
          const userId = req.params.id;
          const filter = { _id: new ObjectId(userId) };
          const updatedRole = {
            $set: {
              role: "admin",
            },
          };

          const existingUser = await userCollection.findOne(filter);
          if (!existingUser) {
            res
              .status(404)
              .json({ success: false, message: "User not found." });
          }

          const result = await userCollection.updateOne(filter, updatedRole);
          if (result.modifiedCount > 0) {
            return res.status(200).json({ success: true });
          }
          return res.status(200).json({
            success: false,
            message: "No changes made.",
          });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }
      }
    );

    // Make user Trainer ----------------
    app.patch(
      "/users/make-trainer/:id",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        try {
          const userId = req.params.id;
          const filter = { _id: new ObjectId(userId) };
          const updatedRole = {
            $set: {
              role: "trainer",
            },
          };

          const existingUser = await userCollection.findOne(filter);
          if (!existingUser) {
            res
              .status(404)
              .json({ success: false, message: "User not found." });
          }

          const result = await userCollection.updateOne(filter, updatedRole);
          if (result.modifiedCount > 0) {
            res.status(200).json({ success: true, data: result });
          }
          return res.status(200).json({
            success: false,
            message: "No changes made.",
          });
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }
      }
    );

    // Make Trainer Member ----------------
    app.patch(
      "/users/make-member/:id",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        try {
          const userId = req.params.id;
          const filter = { _id: new ObjectId(userId) };
          const updatedRole = {
            $set: {
              role: "member",
            },
          };

          const existingUser = await userCollection.findOne(filter);
          if (!existingUser) {
            res
              .status(404)
              .json({ success: false, message: "User not found." });
          }

          const result = await userCollection.updateOne(filter, updatedRole);
          if (result.modifiedCount > 0) {
            return res.status(200).json({ success: true });
          }
          return res.status(200).json({
            success: false,
            message: "No changes made.",
          });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }
      }
    );
    //  User Delete --------------------------------
    app.delete("/users/:id", verifyToken, VerifyAdmin, async (req, res) => {
      try {
        const userId = req.params.id;
        const query = {
          _id: new ObjectId(userId),
        };

        const existingUser = await userCollection.findOne(query);
        if (!existingUser) {
          res.status(404).json({ success: false, message: "User not found." });
        }

        const result = await userCollection.deleteOne(query);

        if (result.deletedCount > 0) {
          return res.status(200).json({ success: true, data: result });
        }
        return res.status(404).json({
          success: false,
          message: "Applicant not found or already deleted.",
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // All Classes API --------------------------
    app.post("/classes", verifyToken, VerifyAdmin, async (req, res) => {
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
        return res
          .status(500)
          .json({ success: false, message: "Failed to post." });
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
        const search = req.query?.search;
        const query = {};

        if (search) {
          query.name = {
            $regex: search,
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
    app.post(
      "/community",
      verifyToken,
      VerifyAdminORTrainer,
      async (req, res) => {
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
      }
    );

    // Community get-----------------------
    app.get("/community", async (req, res) => {
      try {
        const result = await communityCollection.find().toArray();
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

    // UpVote---------------------
    app.patch("/community/upvote/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid ID format." });
        }

        const filter = { _id: new ObjectId(id) };
        const updatedVoteNumber = {
          $inc: {
            votes: 1,
          },
        };

        const existingForum = await communityCollection.findOne(filter);
        if (!existingForum) {
          return res
            .status(404)
            .json({ success: false, message: "Forum not found." });
        }

        const result = await communityCollection.updateOne(
          filter,
          updatedVoteNumber
        );
        if (result.modifiedCount > 0) {
          return res.status(200).json({ success: true });
        }
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
    // DownVote---------------------
    app.patch("/community/downvote/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid ID format." });
        }

        const filter = { _id: new ObjectId(id) };
        const updatedVoteNumber = {
          $inc: {
            votes: -1,
          },
        };

        const exisitingForum = await communityCollection.findOne(filter);
        if (!exisitingForum) {
          return res
            .status(404)
            .json({ success: false, message: "Forum not found." });
        }

        const result = await communityCollection.updateOne(
          filter,
          updatedVoteNumber
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
          .json({ success: false, message: "Internal server error." });
      }
    });

    // All Trainers Api -------------------------------
    app.post("/trainers", verifyToken, VerifyAdmin, async (req, res) => {
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
      VerifyTrainer,
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

          const result = await trainerCollection.updateOne(
            filter,
            updatedSlots
          );
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
      }
    );

    // Add Slot----------------------------------
    app.patch(
      "/trainers/addSlot/:id",
      verifyToken,
      VerifyTrainer,
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
          const result = await trainerCollection.updateOne(
            filter,
            updatedSlots
          );
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
      }
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
    app.get("/recent-payments", verifyToken, VerifyAdmin, async (req, res) => {
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
          return res
            .status(404)
            .json({ success: false, message: "not found." });
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
      VerifyAdmin,
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

          const existingApplicant = await appliedTrainerCollection.findOne(
            filter
          );

          if (!existingApplicant) {
            return res
              .status(404)
              .json({ success: false, message: "Applicant not found." });
          }

          const result = await appliedTrainerCollection.updateOne(
            filter,
            updateStatus
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
      }
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
    app.post(
      "/rejection-feedback",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
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
      }
    );

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

    // Newsletter Api-----------------------------
    app.post("/newsletter", async (req, res) => {
      try {
        const newsletterInfo = req.body;
        if (!newsletterInfo) {
          return res
            .status(400)
            .json({ success: false, message: "Newsletter not found." });
        }
        const result = await newsletterCollection.insertOne(newsletterInfo);
        if (result.insertedId) {
          return res.status(200).json({ success: true });
        }
        return res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // Newsletter get-----------------------------
    app.get("/newsletter", verifyToken, VerifyAdmin, async (req, res) => {
      try {
        const result = await newsletterCollection.find().toArray();
        return res.status(200).json(result);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // Reviews Api----------------------------
    app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;

        if (!review || Object.keys(review).length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "Review data is required." });
        }

        const result = await reviewCollection.insertOne(review);
        if (result.insertedId) {
          return res.status(201).json({ success: true });
        }
        return res
          .status(500)
          .json({ success: false, message: "Failed to post review." });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // Review showing ----------------------
    app.get("/reviews", async (req, res) => {
      try {
        const result = await reviewCollection.find().toArray();
        return res.status(200).json(result);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: true, message: "Internal server error." });
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

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.json("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
