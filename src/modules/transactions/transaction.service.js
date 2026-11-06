import { Transaction } from "./transaction.model.js";

// Post transaction
async function addTransactionInDB(payload) {
  const result = await Transaction.create(payload);

  return result;
}
// Get all transaction
async function getAllTransactionsFromDB() {
  const result = await Transaction.find().select("-__v").lean();
  return result;
}

// Recent 6 transaction
async function getRecentTransactionsFromDB() {
  const result = await Transaction.find().sort({ _id: -1 }).limit(6).lean();
  return result;
}
// Get Specific User's transaction
async function getSpecificUserTransactionFromDB(email) {
  const result = await Transaction.find({ email }).select("-__v").lean();
  return result;
}

export const TransactionService = {
  addTransactionInDB,
  getAllTransactionsFromDB,
  getRecentTransactionsFromDB,
  getSpecificUserTransactionFromDB,
};
