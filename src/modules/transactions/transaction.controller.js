import { TransactionService } from "./transaction.service.js";

// Post transaction
async function addTransaction(req, res) {
  try {
    const transactionInfo = req.body;

    if (!transactionInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction info required." });
    }
    const result = await TransactionService.addTransactionInDB(transactionInfo);

    if (result.insertedId) {
      return res
        .status(200)
        .json({ success: true, message: "Transaction successfull" });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to record Transaction information.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Get all transaction
async function getAllTransactions(req, res) {
  try {
    const result = await TransactionService.getAllTransactionsFromDB();

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

// Recent 6 transaction
async function getRecentTransactions(req, res) {
  try {
    const result = await TransactionService.getRecentTransactionsFromDB();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Get Specific User's transaction
async function getSpecificUserTransaction(req, res) {
  try {
    const { email } = req.query;
    const result =
      await TransactionService.getSpecificUserTransactionFromDB(email);

    if (!result) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const TransactionController = {
  addTransaction,
  getAllTransactions,
  getSpecificUserTransaction,
  getRecentTransactions,
};
