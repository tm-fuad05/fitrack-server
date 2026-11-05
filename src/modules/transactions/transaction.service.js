import { client } from "../../config/dbConnect.js";

const transactionCollection = client.db("FitRackDB").collection("transactions");

// Post transaction
async function addTransactionInDB(payload) {
  const result = await transactionCollection.insertOne(payload);

  return result;
}
// Get all transaction
async function getAllTransactionsFromDB() {
  const result = await transactionCollection.find().toArray();
  return result;
}

// Recent 6 transaction
async function getRecentTransactionsFromDB() {
  const result = await transactionCollection
    .find()
    .sort({ _id: -1 })
    .limit(6)
    .toArray();
  return result;
}
// Get Specific User's transaction
async function getSpecificUserTransactionFromDB(email) {
  const result = await transactionCollection.find({ email }).toArray();
  return result;
}

export const TransactionService = {
  addTransactionInDB,
  getAllTransactionsFromDB,
  getRecentTransactionsFromDB,
  getSpecificUserTransactionFromDB,
};
