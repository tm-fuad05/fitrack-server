import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUser);
router.get("/check-user-role/:email", UserController.checkUserRole);
router.patch("/:id", UserController.editUserInfo);
router.patch("/change-user-role/:id", UserController.changeUserRole);
router.delete("/:id", UserController.deleteUser);

export const UserRouter = router;
