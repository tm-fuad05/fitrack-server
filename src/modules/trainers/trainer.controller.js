import { TrainerService } from "./trainer.service.js";

// Post Trainer
async function addTrainer(req, res) {
  try {
    const trainer = req.body;

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainers not found." });
    }
    const existingTrainer = await TrainerService.findTrainerByEmailFromDB(
      trainer?.email,
    );

    if (existingTrainer) {
      return res.status(409).json({
        success: false,
        message: "The trainer is already exists.",
      });
    }

    const result = await TrainerService.addTrainerInDB(trainer);

    if (result.insertedId) {
      return res.status(201).json({ success: true, data: result });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to add trainer." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Get All trainers
async function getAllTrainers(req, res) {
  try {
    const { sort } = req.query;

    const result = await TrainerService.getAllTrainersFromDB(sort);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
// Get Specific Trainer
async function getTrainerByName(req, res) {
  try {
    const { trainerName } = req.params;

    if (!trainerName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Trainer is required." });
    }

    const result = await TrainerService.getTrainerByNameFromDB(trainerName);

    if (!result) {
      return res.status(404).json({ success: false, message: "Not found." });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Manage Slots : (Add)
async function addTrainerSlot(req, res) {
  try {
    const trainerId = req.params.id;
    const addedSlots = req.body;

    if (!addedSlots?.availableDays) {
      return res
        .status(404)
        .json({ success: false, message: "availableDays not found." });
    }

    const existingSlot = await TrainerService.findTrainerByIdFromDB(trainerId);

    if (!existingSlot) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    const result = await TrainerService.addTrainerSlotInDB(
      trainerId,
      addedSlots?.availableDays,
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true });
    }
    return res
      .status(200)
      .json({ success: false, message: "No changes made." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: " Internal server error." });
  }
}

// Manage Slots : (Delete)
async function deleteTrainerSlot(req, res) {
  try {
    const trainerId = req.params.id;
    const managedSlots = req.body;

    if (!managedSlots?.availableDays) {
      return res
        .status(404)
        .json({ success: false, message: "availabledays not found." });
    }

    const existingSlot = await TrainerService.findTrainerByIdFromDB(trainerId);

    if (!existingSlot) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found." });
    }

    const result = await TrainerService.deleteTrainerSlotFromDB(
      trainerId,
      managedSlots?.availableDays,
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true });
    }
    return res
      .status(200)
      .json({ success: false, message: "No changes made." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error." });
  }
}

export const TrainerController = {
  addTrainer,
  getAllTrainers,
  getTrainerByName,
  addTrainerSlot,
  deleteTrainerSlot,
};
