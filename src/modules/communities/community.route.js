import express from "express";
import { CommunityController } from "./community.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { verifyAdminORTrainer } from "../../middlewares/verifyUserRole.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { CommunityValidation } from "./community.validation.js";

const router = express.Router();

router.get("/", CommunityController.getAllCommunities);
router.get("/recent", CommunityController.getRecentCommunities);
router.post(
  "/",
  verifyToken,
  verifyAdminORTrainer,
  validateRequest(CommunityValidation.createCommunitySchema),
  CommunityController.addCommunity,
);
router.patch("/vote/:id", verifyToken, CommunityController.voteCommunity);

export const CommunityRouter = router;
