import { Feedback } from "./feedback.model.js";

async function getAllRejectionFeedbacksFromDB() {
  const result = await Feedback.find().sort({ _id: -1 }).select("-__v").lean();
  return result;
}

async function getRejectionFeedbackByEmailFromDB(email) {
  const allFeedbacks = await getAllRejectionFeedbacksFromDB();

  const specificFeedback = allFeedbacks.find((f) => f.email === email);

  return specificFeedback;
}

async function addRejectionFeedbackInDB(payload) {
  const result = await Feedback.create(payload);
  return result;
}

export const RejectionFeedbackService = {
  getAllRejectionFeedbacksFromDB,
  getRejectionFeedbackByEmailFromDB,
  addRejectionFeedbackInDB,
};
