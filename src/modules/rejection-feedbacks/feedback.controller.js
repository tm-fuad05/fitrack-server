import { RejectionFeedbackService } from "./feedback.service.js";

// Rejection Post
async function addRejectionFeedback(req, res) {
  try {
    const feedback = req.body;

    if (!feedback) {
      return res
        .status(400)
        .json({ success: false, message: "Feedback not found." });
    }

    const result =
      await RejectionFeedbackService.addRejectionFeedbackInDB(feedback);

    if (result.insertedId) {
      return res
        .status(200)
        .json({ success: true, message: "Feedback posted" });
    }
    return res
      .status(500)
      .json({ success: false, message: " Internal server error" });
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
    const { email } = req.params;
    const result =
      await RejectionFeedbackService.getRejectionFeedbackByEmailFromDB(email);
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
