import { client } from "../../config/dbConnect.js";

const paymentCollection = client.db("FitRackDB").collection("payments");

// Post transaction
async function addPaymentInDB(payload) {
  const result = await paymentCollection.insertOne(payload);

  return result;
}
// Get all transaction
async function getAllPaymentsFromDB() {
  const result = await paymentCollection.find().toArray();
  return result;
}

// Recent 6 transaction
async function getRecentPaymentsFromDB() {
  const result = await paymentCollection
    .find()
    .sort({ _id: -1 })
    .limit(6)
    .toArray();
  return result;
}
// Get Specific User's transaction
async function getSpecificUserPaymentFromDB(email) {
  const result = await paymentCollection.find({ email }).toArray();
  return result;
}

export const PaymentService = {
  addPaymentInDB,
  getAllPaymentsFromDB,
  getRecentPaymentsFromDB,
  getSpecificUserPaymentFromDB,
};
