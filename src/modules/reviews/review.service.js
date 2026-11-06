import { Review } from "./review.model.js";

async function addReviewInDB(payload) {
  const result = await Review.create(payload);
  return result;
}

async function getAllReviewsFromDB() {
  const result = await Review.find().select("-__v").lean();
  return result;
}

export const ReviewService = {
  addReviewInDB,
  getAllReviewsFromDB,
};
