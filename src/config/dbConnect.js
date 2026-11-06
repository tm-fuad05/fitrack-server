import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

export async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Mongoose connected successfully");
  } catch (error) {
    console.log(error);
  }
}
