import { ReviewService } from "./review.service.js";

// Post review
async function addReview(req, res) {
  try {
    const review = req.body;

    const result = await ReviewService.addReviewInDB(review);

    if (result) {
      return res
        .status(201)
        .json({ success: true, message: "Review posted", data: result });
    }
  } catch (error) {
    console.error("POST REVIEW ERROR", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

async function getAllReviews(req, res) {
  try {
    const result = await ReviewService.getAllReviewsFromDB();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET REVIEW ERROR", error);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error." });
  }
}

export const ReviewController = {
  addReview,
  getAllReviews,
};
