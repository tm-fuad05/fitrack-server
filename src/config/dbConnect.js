import mongoose from "mongoose";

import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

export async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Mongoose connected successfully");
  } catch (error) {
    console.log(error);
  }
}

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
