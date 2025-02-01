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

    // JWT API --------------------------(Done✅)
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
        return res.status(500).json({
          message:
            "Server was unable to fulfill a request due to an unexpected condition!",
        });
      }
    });

    // Admin Check ---------------------
    app.get("/user/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).json({ message: "Forbidden access!" });
      }

      const user = await userCollection.findOne({ email: email });
      let isAdmin = false;
      if (user) {
        isAdmin = user?.role === "admin";
      }
      res.json({ isAdmin });
    });

    // Trainer check---------------

    app.get("/user/trainer/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).json({ message: "Forbidden access!" });
      }

      const user = await userCollection.findOne({ email: email });
      let isTrainer = false;
      if (user) {
        isTrainer = user?.role === "trainer";
      }
      res.json({ isTrainer });
    });

    // User API---------------------------------(Done✅)
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
        } else {
          const result = await userCollection.insertOne(user);

          return res.status(201).json({
            success: true,
            data: result,
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message:
            "Server was unable to fulfill a request due to an unexpected condition!",
        });
      }
    });

    app.get("/users", verifyToken, async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        return res.status(200).json({ success: true, data: result });
      } catch (error) {
        return res
          .status(404)
          .json({ success: false, message: "Users not found!" });
      }
    });

    // Update User Info : (Name)-------------------(Done✅)
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
        return res.status(200).json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Bad request." });
      }
    });

    //  Make user admin------------------(Done✅)
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
          res.status(200).json({ success: true, data: result });
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }
      }
    );

    // Make user Trainer ----------------(Done✅)
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
          res.status(200).json({ success: true, data: result });
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }
      }
    );

    // Make Trainer Member ----------------(Done✅)
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
          res.status(200).json({ success: true, data: result });
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }
      }
    );
    //  User Delete --------------------------------(Done✅)
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

        return res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });

    // All Classes API -------------------------------
    app.post("/classes", verifyToken, VerifyAdmin, async (req, res) => {
      const classInfo = req.body;
      const result = await classCollection.insertOne(classInfo);
      res.json(result);
    });
    app.get("/classes", async (req, res) => {
      const search = req.query?.search;
      const query = {};

      if (search) {
        query.name = {
          $regex: search,
          $options: "i",
        };
      }
      const result = await classCollection.find(query).toArray();
      res.json(result);
    });

    // Community API -----------------------
    app.post(
      "/community",
      verifyToken,
      VerifyAdminORTrainer,
      async (req, res) => {
        const forumInfo = req.body;
        const result = await communityCollection.insertOne(forumInfo);
        res.json(result);
      }
    );
    app.get("/community", async (req, res) => {
      const result = await communityCollection.find().toArray();
      res.json(result);
    });
    // Recent Community
    app.get("/recent-community", async (req, res) => {
      const result = await communityCollection
        .find()
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.json(result);
    });
    // UpVote
    app.patch("/community/upvote/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedVoteNumber = {
        $inc: {
          votes: 1,
        },
      };
      const result = await communityCollection.updateOne(
        filter,
        updatedVoteNumber
      );
      res.json(result);
    });
    // DownVote
    app.patch("/community/downvote/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedVoteNumber = {
        $inc: {
          votes: -1,
        },
      };
      const result = await communityCollection.updateOne(
        filter,
        updatedVoteNumber
      );
      res.json(result);
    });

    // All Trainers Api -------------------------------
    app.post("/trainers", verifyToken, VerifyAdmin, async (req, res) => {
      const trainer = req.body;
      const result = await trainerCollection.insertOne(trainer);
      res.json(result);
    });

    app.get("/trainers", async (req, res) => {
      const result = await trainerCollection.find().toArray();
      res.json(result);
    });

    app.get("/trainers/:trainerName", async (req, res) => {
      const trainerName = req.params.trainerName;

      const result = await trainerCollection.findOne({
        fullName: trainerName,
      });
      res.json(result);
    });

    // Manage Slots : (Delete)
    app.patch(
      "/trainers/deleteSlot/:id",
      verifyToken,
      VerifyTrainer,
      async (req, res) => {
        const managedSlots = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedSlots = {
          $set: {
            availableDays: managedSlots.availableDays,
          },
        };
        const result = await trainerCollection.updateOne(filter, updatedSlots);
        res.json(result);
      }
    );
    // Add Slot
    app.patch(
      "/trainers/addSlot/:id",
      verifyToken,
      VerifyTrainer,
      async (req, res) => {
        const addedSlots = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedSlots = {
          $set: {
            availableDays: addedSlots.availableDays,
          },
        };
        const result = await trainerCollection.updateOne(filter, updatedSlots);
        res.json(result);
      }
    );

    // Payments---------------------------
    app.post("/payments", verifyToken, async (req, res) => {
      const paymentInfo = req.body;
      const result = await paymentCollection.insertOne(paymentInfo);
      res.json(result);
    });

    app.get("/payments", verifyToken, async (req, res) => {
      const result = await paymentCollection.find().toArray();
      res.json(result);
    });
    // Recent 6 transaction
    app.get("/recent-payments", verifyToken, VerifyAdmin, async (req, res) => {
      const result = await paymentCollection
        .find()
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.json(result);
    });

    app.get("/payments/user", verifyToken, async (req, res) => {
      const email = req.query.email;
      const result = await paymentCollection.find({ email }).toArray();
      res.json(result);
    });

    // Applied Trainer -------------------------
    app.post("/applied-as-trainer", verifyToken, async (req, res) => {
      const trainerInfo = req.body;
      const result = await appliedTrainerCollection.insertOne(trainerInfo);
      res.json(result);
    });
    app.get("/applied-as-trainer", verifyToken, async (req, res) => {
      const result = await appliedTrainerCollection.find().toArray();
      res.json(result);
    });
    app.get("/applied-as-trainer/:id", async (req, res) => {
      const id = req.params.id;
      const result = await appliedTrainerCollection.findOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });
    app.patch(
      "/applied-as-trainer/:id",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        const applicantId = req.params.id;
        const filter = { _id: new ObjectId(applicantId) };
        const updateStatus = {
          $set: {
            status: "rejected",
          },
        };
        const result = await appliedTrainerCollection.updateOne(
          filter,
          updateStatus
        );
        res.json(result);
      }
    );
    app.delete("/applied-as-trainer/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await appliedTrainerCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    // Rejection Feedback-----------------------
    app.post(
      "/rejection-feedback",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        const feedback = req.body;
        const result = await rejectionFeedbackCollection.insertOne(feedback);
        res.json(result);
      }
    );
    app.get("/rejection-feedback", verifyToken, async (req, res) => {
      const result = await rejectionFeedbackCollection.find().toArray();
      res.json(result);
    });

    // Newsletter Api-----------------------------
    app.post("/newsletter", async (req, res) => {
      const newsletterInfo = req.body;
      const result = await newsletterCollection.insertOne(newsletterInfo);
      res.json(result);
    });
    app.get("/newsletter", verifyToken, VerifyAdmin, async (req, res) => {
      const result = await newsletterCollection.find().toArray();
      res.json(result);
    });

    // Reviews Api----------------------------
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.json(result);
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
