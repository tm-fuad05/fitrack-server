import express from "express";
import { upload } from "../../config/multer.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { UploadController } from "./upload.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { fileSchema } from "./upload.validation.js";

const router = express.Router();

router.post(
  "/users",
  upload.single("image"),
  validateRequest(fileSchema),
  UploadController.addUserImage,
);
router.post(
  "/trainers",
  verifyToken,
  upload.single("image"),
  validateRequest(fileSchema),
  UploadController.addTrainerImage,
);

export const UploadRouter = router;
