import express from "express";
import { UserController } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { UserValidation } from "./user.validation.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { globalValidation } from "../../validation/globalValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, UserController.getAllUsers);
router.post(
  "/",
  validateRequest(UserValidation.createUserSchema),
  UserController.addUser,
);
router.get(
  "/user",
  validateRequest(globalValidation.emailQuerySchema),
  UserController.getUserByEmail,
);
router.get(
  "/check-user-role",
  verifyToken,
  validateRequest(globalValidation.emailQuerySchema),
  UserController.checkUserRole,
);

router.patch(
  "/change-user-role",
  verifyToken,
  verifyAdmin,
  validateRequest(globalValidation.emailQuerySchema),
  validateRequest(UserValidation.updateUserRoleSchema),
  UserController.changeUserRole,
);

router.get("/:id", verifyToken, verifyAdmin, UserController.getUserById);

router.patch(
  "/:id",
  verifyToken,
  validateRequest(UserValidation.updateUserSchema),
  UserController.editUserInfo,
);
router.delete(
  "/delete/:id",
  verifyToken,
  verifyAdmin,
  UserController.deleteUser,
);

export const UserRouter = router;
