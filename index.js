require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

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
    const trainerCollection = database.collection("trainers");
    const classCollection = database.collection("classes");
    // const confirmedTrainerCollection =
    //   database.collection("Confirmed Trainers");
    const appliedTrainerCollection = database.collection("applied trainers");
    const userApplicationForTrainerCollection = database.collection(
      "User Application For Trainer"
    );
    const rejectionFeedbackCollection =
      database.collection("Rejection Feedback");
    const newsletterCollection = database.collection("newsletter");

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

    app.patch("/users/:id", async (req, res) => {
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
    app.patch("/users/make-admin/:id", async (req, res) => {
      const userId = req.params.id;
      const filter = { _id: new ObjectId(userId) };
      const updatedRole = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedRole);
      res.send(result);
    });

    // Make user Trainer ----------------
    app.patch("/users/make-trainer/:id", async (req, res) => {
      const userId = req.params.id;
      const filter = { _id: new ObjectId(userId) };
      const updatedRole = {
        $set: {
          role: "trainer",
        },
      };
      const result = await userCollection.updateOne(filter, updatedRole);
      res.send(result);
    });

    // Make Trainer Member ----------------
    app.patch("/users/make-member/:id", async (req, res) => {
      const userId = req.params.id;
      const filter = { _id: new ObjectId(userId) };
      const updatedRole = {
        $set: {
          role: "member",
        },
      };
      const result = await userCollection.updateOne(filter, updatedRole);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const result = await userCollection.deleteOne({
        _id: new ObjectId(userId),
      });
      res.send(result);
    });

    // All Classes API -------------------------------
    app.post("/classes", async (req, res) => {
      const classInfo = req.body;
      const result = await classCollection.insertOne(classInfo);
      res.send(result);
    });
    app.get("/classes", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    // All Trainers Api -------------------------------
    app.post("/trainers", async (req, res) => {
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

    // Applied Trainer -------------------------
    app.post("/applied-as-trainer", async (req, res) => {
      const trainerInfo = req.body;
      const result = await appliedTrainerCollection.insertOne(trainerInfo);
      res.send(result);
    });
    app.get("/applied-as-trainer", async (req, res) => {
      const result = await appliedTrainerCollection.find().toArray();
      res.send(result);
    });
    app.get("/applied-as-trainer/:id", async (req, res) => {
      const id = req.params.id;
      const result = await appliedTrainerCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });
    app.patch("/applied-as-trainer/:id", async (req, res) => {
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
    });
    app.delete("/applied-as-trainer/:id", async (req, res) => {
      const id = req.params.id;
      const result = await appliedTrainerCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Rejection Feedback-----------------------
    app.post("/rejection-feedback", async (req, res) => {
      const feedback = req.body;
      const result = await rejectionFeedbackCollection.insertOne(feedback);
      res.send(result);
    });
    app.get("/rejection-feedback", async (req, res) => {
      const result = await rejectionFeedbackCollection.find().toArray();
      res.send(result);
    });

    // Newsletter Api-----------------------------
    app.post("/newsletter", async (req, res) => {
      const newsletterInfo = req.body;
      const result = await newsletterCollection.insertOne(newsletterInfo);
      res.send(result);
    });
    app.get("/newsletter", async (req, res) => {
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
