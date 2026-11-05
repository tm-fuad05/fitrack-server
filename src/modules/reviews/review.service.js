import { client } from "../../config/dbConnect.js";

const reviewCollection = client.db("FitRackDB").collection("reviews");

async function addReviewInDB(payload) {
  const result = await reviewCollection.insertOne(payload);
  return result;
}

async function getAllReviewsFromDB() {
  const result = await reviewCollection.find().toArray();
  return result;
}

export const ReviewService = {
  addReviewInDB,
  getAllReviewsFromDB,
};
