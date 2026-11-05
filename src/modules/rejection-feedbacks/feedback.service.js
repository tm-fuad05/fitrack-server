import { client } from "../../config/dbConnect.js";

const rejectionFeedbackCollection = client
  .db("FitRackDB")
  .collection("Rejection Feedback");

async function getAllRejectionFeedbacksFromDB() {
  const result = await rejectionFeedbackCollection
    .find()
    .sort({ _id: -1 })
    .toArray();
  return result;
}

async function getRejectionFeedbackByEmailFromDB(email) {
  const allFeedbacks = await getAllRejectionFeedbacksFromDB();

  const specificFeedback = allFeedbacks.find((f) => f.email === email);

  return specificFeedback;
}

async function addRejectionFeedbackInDB(payload) {
  const result = await rejectionFeedbackCollection.insertOne(payload);
  return result;
}

export const RejectionFeedbackService = {
  getAllRejectionFeedbacksFromDB,
  getRejectionFeedbackByEmailFromDB,
  addRejectionFeedbackInDB,
};
