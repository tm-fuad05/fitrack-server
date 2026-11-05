import { PaymentService } from "./payment.service.js";

// Post transaction
async function addPayment(req, res) {
  try {
    const paymentInfo = req.body;

    if (!paymentInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Payment info required." });
    }
    const result = await PaymentService.addPaymentInDB(paymentInfo);

    if (result.insertedId) {
      return res
        .status(200)
        .json({ success: true, message: "Payment successfull" });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to record payment information.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Get all transaction
async function getAllPayments(req, res) {
  try {
    const result = await PaymentService.getAllPaymentsFromDB();

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

// Recent 6 transaction
async function getRecentPayments(req, res) {
  try {
    const result = await PaymentService.getRecentPaymentsFromDB();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Get Specific User's transaction
async function getSpecificUserPayment(req, res) {
  try {
    const { email } = req.query;
    const result = await PaymentService.getSpecificUserPaymentFromDB(email);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const PaymentController = {
  addPayment,
  getAllPayments,
  getSpecificUserPayment,
  getRecentPayments,
};
