import { client } from "../../config/dbConnect.js";

const classCollection = client.db("FitRackDB").collection("classes");

async function addClassInDB(payload) {
  const result = await classCollection.insertOne(payload);
  return result;
}

async function getAllClassesFromDB(search) {
  const query = {};

  if (search) {
    query.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  const result = await classCollection.find(query).toArray();
  return result;
}

export const ClassService = {
  addClassInDB,
  getAllClassesFromDB,
};
