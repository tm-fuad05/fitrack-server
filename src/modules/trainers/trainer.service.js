import { ObjectId } from "mongodb";
import { client } from "../../config/dbConnect.js";

const trainerCollection = client.db("FitRackDB").collection("trainers");

async function findTrainerByEmailFromDB(email) {
  const result = await trainerCollection.findOne({ email });
  return result;
}

async function findTrainerByIdFromDB(trainerId) {
  const result = await trainerCollection.findOne({
    _id: new ObjectId(trainerId),
  });
  return result;
}

// Post Trainer
async function addTrainerInDB(payload) {
  const result = await trainerCollection.insertOne(payload);
  return result;
}
// Get All trainers
async function getAllTrainersFromDB(sort) {
  let sortQuery = {};

  if (sort === "age") {
    sortQuery = { age: 1 };
  }
  if (sort === "trainer experience") {
    sortQuery = { yearsOfExperience: -1 };
  }
  const result = await trainerCollection.find().sort(sortQuery).toArray();

  return result;
}
// Get Specific Trainer
async function getTrainerByNameFromDB(trainerName) {
  const result = await trainerCollection.findOne({
    fullName: trainerName,
  });

  return result;
}

// Manage Slots : (Add)
async function addTrainerSlotInDB(trainerId, payload) {
  const filter = { _id: new ObjectId(trainerId) };

  const updatedSlots = {
    $set: {
      availableDays: payload,
    },
  };

  const result = await trainerCollection.updateOne(filter, updatedSlots);

  return result;
}

// Manage Slots : (Delete)
async function deleteTrainerSlotFromDB(trainerId, payload) {
  const filter = { _id: new ObjectId(trainerId) };

  const updatedSlots = {
    $set: {
      availableDays: payload,
    },
  };

  const result = await trainerCollection.updateOne(filter, updatedSlots);

  return result;
}

export const TrainerService = {
  addTrainerInDB,
  getAllTrainersFromDB,
  getTrainerByNameFromDB,
  addTrainerSlotInDB,
  deleteTrainerSlotFromDB,
  findTrainerByEmailFromDB,
  findTrainerByIdFromDB,
};
