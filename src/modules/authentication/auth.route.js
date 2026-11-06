import express from "express";
import { AuthController } from "./auth.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { AuthValidation } from "./auth.validation.js";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.authSchema),
  AuthController.login,
);

export const AuthRouter = router;
