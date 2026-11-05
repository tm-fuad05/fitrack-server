import express from "express";
import { ClassController } from "./class.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { ClassValidation } from "./class.validation.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  validateRequest(ClassValidation.createClassSchema),
  ClassController.addClass,
);
router.get("/", ClassController.getAllClasses);

export const ClassRouter = router;
