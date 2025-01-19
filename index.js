require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    // Newsletter Api
    app.post("/newsletter", async (req, res) => {
      const newsletterInfo = req.body;
      const result = await newsletterCollection.insertOne(newsletterInfo);
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
