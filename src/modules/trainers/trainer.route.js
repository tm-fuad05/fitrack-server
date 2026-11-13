import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import {
  verifyAdmin,
  verifyTrainer,
} from "../../middlewares/verifyUserRole.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { TrainerValidation } from "./trainer.validation.js";
import { TrainerController } from "./trainer.controller.js";
import { globalValidation } from "../../validation/globalValidation.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  validateRequest(TrainerValidation.createTrainerSchema),
  TrainerController.addTrainer,
);
router.get("/", TrainerController.getAllTrainers);
router.get(
  "/me",
  validateRequest(globalValidation.emailQuerySchema),
  TrainerController.getTrainerByEmail,
);
router.get("/:trainerName", TrainerController.getTrainerByName);
router.patch(
  "/add-slot/:id",
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
router.delete(
  "/delete",
  verifyToken,
  verifyAdmin,
  validateRequest(globalValidation.emailQuerySchema),
  TrainerController.deleteTrainer,
);
export const TrainerRouter = router;
