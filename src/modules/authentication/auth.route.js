import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("jwt", AuthController.login);

export const AuthRouter = router;
