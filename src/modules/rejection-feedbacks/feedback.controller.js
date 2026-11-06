import { RejectionFeedbackService } from "./feedback.service.js";

// Rejection Post
async function addRejectionFeedback(req, res) {
  try {
    const feedback = req.body;

    const result =
      await RejectionFeedbackService.addRejectionFeedbackInDB(feedback);

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Feedback posted", data: result });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: " Internal server error" });
  }
}

// Get All feedbacks
async function getAllRejectionFeedbacks(req, res) {
  try {
    const result =
      await RejectionFeedbackService.getAllRejectionFeedbacksFromDB();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

// Get specific feedback
async function getRejectionFeedbackByEmail(req, res) {
  try {
    const { email } = req.query;
    const result =
      await RejectionFeedbackService.getRejectionFeedbackByEmailFromDB(email);

    if (!result) {
      return res.status(404).json({ success: false, message: "Not found." });
    }

    return res.status(200).json({ success: false, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const RejectionFeedbackController = {
  addRejectionFeedback,
  getAllRejectionFeedbacks,
  getRejectionFeedbackByEmail,
};
