import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import {
  verifyAdmin,
  verifyTrainer,
} from "../../middlewares/verifyUserRole.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { TrainerValidation } from "./trainer.validation.js";
import { TrainerController } from "./trainer.controller.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  validateRequest(TrainerValidation.createTrainerSchema),
  TrainerController.addTrainer,
);
router.get("/", TrainerController.getAllTrainers);
router.get("/:trainerName", TrainerController.getTrainerByName);
router.patch(
  "/addSlot/:id",
  verifyToken,
  verifyTrainer,
  validateRequest(TrainerValidation.trainerSlotSchema),
  TrainerController.addTrainerSlot,
);
router.patch(
  "/deleteSlot/:id",
  verifyToken,
  verifyTrainer,
  validateRequest(TrainerValidation.trainerSlotSchema),
  TrainerController.deleteTrainerSlot,
);
export const TrainerRouter = router;
