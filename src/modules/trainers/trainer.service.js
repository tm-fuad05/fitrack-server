import { Trainer } from "./trainer.model.js";

async function findTrainerByEmailFromDB(email) {
  const result = await Trainer.findOne({ email }).select("-__v");
  return result;
}

async function findTrainerByIdFromDB(trainerId) {
  const result = await Trainer.findById(trainerId).select("-__v");
  return result;
}

// Post Trainer
async function addTrainerInDB(payload) {
  const result = await Trainer.create(payload);
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
  const result = await Trainer.find().sort(sortQuery).select("-__v").lean();

  return result;
}
// Get Specific Trainer
async function getTrainerByNameFromDB(trainerName) {
  const result = await Trainer.findOne({
    fullName: trainerName,
  });

  return result;
}

// Manage Slots : (Add)
async function addTrainerSlotInDB(trainerId, payload) {
  const updatedSlots = {
    $set: {
      availableDays: payload,
    },
  };

  const result = await Trainer.updateOne({ _id: trainerId }, updatedSlots);

  return result;
}

// Manage Slots : (Delete)
async function deleteTrainerSlotFromDB(trainerId, payload) {
  const updatedSlots = {
    $set: {
      availableDays: payload,
    },
  };

  const result = await Trainer.updateOne({ _id: trainerId }, updatedSlots);

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
