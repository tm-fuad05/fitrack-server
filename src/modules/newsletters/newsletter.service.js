import { client } from "../../config/dbConnect.js";

const newsletterCollection = client.db("FitRackDB").collection("newsletter");

async function addNewsletterInDB(payload) {
  const result = await newsletterCollection.insertOne(payload);
  return result;
}

async function getAllNewsletterFromDB() {
  const result = await newsletterCollection.find().toArray();
  return result;
}

export const NewsletterService = {
  addNewsletterInDB,
  getAllNewsletterFromDB,
};
