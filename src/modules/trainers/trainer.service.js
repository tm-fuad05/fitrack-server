import { Trainer } from "./trainer.model.js";

async function getTrainerByEmailFromDB(email) {
  const result = await Trainer.findOne({ email }).select("-__v");
  return result;
}

async function getTrainerByIdFromDB(trainerId) {
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

async function deleteTrainerFromDB(email) {
  const result = await Trainer.deleteOne({ email });
  return result;
}

// Manage Slots : (Add)
async function editTrainerInDB(trainerId, payload) {
  const updatedSlots = {
    $set: {
      availableDays: payload.availableDays,
      availableTime: payload.availableTime,
    },
  };

  const result = await Trainer.updateOne({ _id: trainerId }, updatedSlots, {
    timestamps: false,
  });

  return result;
}

export const TrainerService = {
  addTrainerInDB,
  getAllTrainersFromDB,
  getTrainerByNameFromDB,
  editTrainerInDB,
  getTrainerByEmailFromDB,
  getTrainerByIdFromDB,
  deleteTrainerFromDB,
};
