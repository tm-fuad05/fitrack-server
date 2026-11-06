import express from "express";
import { UserController } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { UserValidation } from "./user.validation.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, UserController.getAllUsers);

router.post(
  "/",
  validateRequest(UserValidation.createUserSchema),
  UserController.addUser,
);
router.get("/:id", verifyToken, verifyAdmin, UserController.getUserById);

router.get(
  "/check-user-role/:email",
  verifyAdmin,
  validateRequest(UserValidation.emailSchema),
  UserController.checkUserRole,
);
router.patch(
  "/:id",
  verifyToken,
  validateRequest(UserValidation.updateUserSchema),
  UserController.editUserInfo,
);
router.patch(
  "/change-user-role/:id",
  verifyAdmin,
  validateRequest(UserValidation.updateUserRoleSchema),
  UserController.changeUserRole,
);
router.delete("/:id", verifyAdmin, UserController.deleteUser);

export const UserRouter = router;
