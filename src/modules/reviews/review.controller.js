import { ReviewService } from "./review.service";

// Post review
async function addReview(req, res) {
  try {
    const review = req.body;

    if (!review || Object.keys(review).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Review data is required." });
    }

    const result = await ReviewService.addReviewInDB(review);

    if (result.insertedId) {
      return res.status(201).json({ success: true, message: "Review posted" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to post review." });
  } catch (error) {
    console.error("POST REVIEW ERROR", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

async function getAllReviews(req, res) {
  try {
    const result = ReviewService.getAllReviewsFromDB();
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
