require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
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
    const rejectionFeedbackCollection =
      database.collection("Rejection Feedback");
    const newsletterCollection = database.collection("newsletter");

    // MiddleWares
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "Unauthorized access!" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            return res.status(401).send({ message: "Unauthorized access!" });
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
        return res.status(403).send({ message: "Forbidden access" });
      }
      next();
    };

    // JWT API --------------------------
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "24h",
      });
      res.send({ token });
    });

    // Admin Check ---------------------
    app.get("/user/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "Forbidden access!" });
      }

      const user = await userCollection.findOne({ email: email });
      let isAdmin = false;
      if (user) {
        isAdmin = user?.role === "admin";
      }
      res.send({ isAdmin });
    });

    // User API---------------------------------
    app.post("/users", async (req, res) => {
      const user = req.body;
      // Except registration
      const query = { email: user.email };
      const axsisting = await userCollection.findOne(query);
      if (axsisting) {
        return res.send({ message: "User already axist" });
      } else {
        const result = await userCollection.insertOne(user);
        res.send(result);
      }
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.patch("/users/:id", verifyToken, async (req, res) => {
      const userId = req.params.id;
      const updatedUserInfo = req.body;
      const filter = { _id: new ObjectId(userId) };
      const updatedProfile = {
        $set: {
          name: updatedUserInfo.name,
        },
      };
      const result = await userCollection.updateOne(filter, updatedProfile);
      res.send(result);
    });

    //  Make user admin------------------
    app.patch(
      "/users/make-admin/:id",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        const userId = req.params.id;
        const filter = { _id: new ObjectId(userId) };
        const updatedRole = {
          $set: {
            role: "admin",
          },
        };
        const result = await userCollection.updateOne(filter, updatedRole);
        res.send(result);
      }
    );

    // Make user Trainer ----------------
    app.patch(
      "/users/make-trainer/:id",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        const userId = req.params.id;
        const filter = { _id: new ObjectId(userId) };
        const updatedRole = {
          $set: {
            role: "trainer",
          },
        };
        const result = await userCollection.updateOne(filter, updatedRole);
        res.send(result);
      }
    );

    // Make Trainer Member ----------------
    app.patch(
      "/users/make-member/:id",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        const userId = req.params.id;
        const filter = { _id: new ObjectId(userId) };
        const updatedRole = {
          $set: {
            role: "member",
          },
        };
        const result = await userCollection.updateOne(filter, updatedRole);
        res.send(result);
      }
    );

    app.delete("/users/:id", verifyToken, VerifyAdmin, async (req, res) => {
      const userId = req.params.id;
      const result = await userCollection.deleteOne({
        _id: new ObjectId(userId),
      });
      res.send(result);
    });

    // All Classes API -------------------------------
    app.post("/classes", verifyToken, VerifyAdmin, async (req, res) => {
      const classInfo = req.body;
      const result = await classCollection.insertOne(classInfo);
      res.send(result);
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
      res.send(result);
    });

    // Community API -----------------------
    app.post("/community", verifyToken, VerifyAdmin, async (req, res) => {
      const forumInfo = req.body;
      const result = await communityCollection.insertOne(forumInfo);
      res.send(result);
    });
    app.get("/community", async (req, res) => {
      const result = await communityCollection.find().toArray();
      res.send(result);
    });
    // Recent Community
    app.get("/recent-community", async (req, res) => {
      const result = await communityCollection
        .find()
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });
    // UpVote
    app.patch("/community/upvote/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedVoteNumber = {
        $inc: {
          votes: 1,
        },
        $set: {
          isLike: true,
        },
      };
      const result = await communityCollection.updateOne(
        filter,
        updatedVoteNumber
      );
      res.send(result);
    });
    // DownVote
    app.patch("/community/downvote/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedVoteNumber = {
        $inc: {
          votes: -1,
        },
        $set: {
          isDisike: true,
        },
      };
      const result = await communityCollection.updateOne(
        filter,
        updatedVoteNumber
      );
      res.send(result);
    });

    // All Trainers Api -------------------------------
    app.post("/trainers", verifyToken, VerifyAdmin, async (req, res) => {
      const trainer = req.body;
      const result = await trainerCollection.insertOne(trainer);
      res.send(result);
    });

    app.get("/trainers", async (req, res) => {
      const result = await trainerCollection.find().toArray();
      res.send(result);
    });

    app.get("/trainers/:trainerName", async (req, res) => {
      const trainerName = req.params.trainerName;
      const result = await trainerCollection.findOne({
        fullName: trainerName,
      });
      res.send(result);
    });
    app.get("/trainer-booking/:trainerName/:days", async (req, res) => {
      const days = req.params.days;
      const trainerName = req.params.trainerName;
      // const skills = req.params.skills;
      const query = {
        fullName: trainerName,
        availableDays: days,
      };
      const result = await trainerCollection.findOne(query);
      res.send(result);
    });

    // Applied Trainer -------------------------
    app.post("/applied-as-trainer", verifyToken, async (req, res) => {
      const trainerInfo = req.body;
      const result = await appliedTrainerCollection.insertOne(trainerInfo);
      res.send(result);
    });
    app.get("/applied-as-trainer", verifyToken, async (req, res) => {
      const result = await appliedTrainerCollection.find().toArray();
      res.send(result);
    });
    app.get("/applied-as-trainer/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await appliedTrainerCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
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
        res.send(result);
      }
    );
    app.delete("/applied-as-trainer/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await appliedTrainerCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Rejection Feedback-----------------------
    app.post(
      "/rejection-feedback",
      verifyToken,
      VerifyAdmin,
      async (req, res) => {
        const feedback = req.body;
        const result = await rejectionFeedbackCollection.insertOne(feedback);
        res.send(result);
      }
    );
    app.get("/rejection-feedback", verifyToken, async (req, res) => {
      const result = await rejectionFeedbackCollection.find().toArray();
      res.send(result);
    });

    // Newsletter Api-----------------------------
    app.post("/newsletter", async (req, res) => {
      const newsletterInfo = req.body;
      const result = await newsletterCollection.insertOne(newsletterInfo);
      res.send(result);
    });
    app.get("/newsletter", verifyToken, VerifyAdmin, async (req, res) => {
      const result = await newsletterCollection.find().toArray();
      res.send(result);
    });

    // Reviews Api----------------------------
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
