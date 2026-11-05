import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { TransactionController } from "./transaction.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { TransactionValidation } from "./transaction.validation.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validateRequest(TransactionValidation.createTransactionSchema),
  TransactionController.addTransaction,
);
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  TransactionController.getAllTransactions,
);
router.get(
  "/recent",
  verifyToken,
  verifyAdmin,
  TransactionController.getRecentTransactions,
);
router.get(
  "/user",
  verifyToken,
  validateRequest(TransactionValidation.transactionQuerySchema),
  TransactionController.getSpecificUserTransaction,
);

export const TransactionRouter = router;
