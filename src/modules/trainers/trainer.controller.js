import { TrainerService } from "./trainer.service.js";

// Post Trainer
async function addTrainer(req, res) {
  try {
    const trainer = req.body;

    const existingTrainer = await TrainerService.getTrainerByEmailFromDB(
      trainer?.email,
    );

    if (existingTrainer) {
      return res.status(409).json({
        success: false,
        message: "The trainer is already exists.",
      });
    }

    const result = await TrainerService.addTrainerInDB(trainer);

    if (result) {
      return res
        .status(201)
        .json({ success: true, message: "Successfully added", data: result });
    }
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
        .json({ success: false, message: "Trainer name is required." });
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

// Get Specific Trainer
async function getTrainerByEmail(req, res) {
  try {
    const { email } = req.query;

    const result = await TrainerService.getTrainerByEmailFromDB(email);

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

async function deleteTrainer(req, res) {
  const { email } = req.query;

  const existing = await TrainerService.getTrainerByEmailFromDB(email);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: "Trainer not found",
    });
  }

  const result = await TrainerService.deleteTrainerFromDB(email);

  if (result.deletedCount > 0) {
    return res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
    });
  }
}

// Edit trainer data
async function editTrainer(req, res) {
  try {
    const trainerId = req.params.id;
    const slots = req.body;

    const existingSlot = await TrainerService.getTrainerByIdFromDB(trainerId);

    if (!existingSlot) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    const result = await TrainerService.editTrainerInDB(trainerId, slots);

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Updated successfully" });
    }
    return res.status(200).json({ success: true, message: "No changes made." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: " Internal server error." });
  }
}

export const TrainerController = {
  addTrainer,
  getAllTrainers,
  getTrainerByName,
  editTrainer,
  deleteTrainer,
  getTrainerByEmail,
};
