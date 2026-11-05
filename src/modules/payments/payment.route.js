import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { verifyAdmin } from "../../middlewares/verifyUserRole.middleware.js";
import { PaymentController } from "./payment.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { PaymentValidation } from "./payment.validation.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validateRequest(PaymentValidation.createPaymentSchema),
  PaymentController.addPayment,
);
router.get("/", verifyToken, verifyAdmin, PaymentController.getAllPayments);
router.get(
  "/recent",
  verifyToken,
  verifyAdmin,
  PaymentController.getRecentPayments,
);
router.get(
  "/user",
  verifyToken,
  validateRequest(PaymentValidation.paymentQuerySchema),
  PaymentController.getSpecificUserPayment,
);

export const PaymentRouter = router;
