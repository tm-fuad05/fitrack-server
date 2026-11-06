import { ApplicantService } from "./applicant.service.js";

// Apply as a trainer
async function applyForTrainer(req, res) {
  try {
    const trainerInfo = req.body;

    const existingApplicant = await ApplicantService.findApplicantByEmailFromDB(
      trainerInfo?.email,
    );

    if (existingApplicant) {
      return res.status(409).json({
        success: false,
        message: "Already applied.",
      });
    }
    const result = await ApplicantService.applyForTrainerInDB(trainerInfo);

    if (result) {
      return res.status(201).json({
        success: true,
        message: "Application submitted",
        data: result,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Applied trainers get-------------------------
async function getAllApplicants(req, res) {
  try {
    const result = await ApplicantService.getAllApplicantsFromDB();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Single applicant get----------------------
async function getApplicantById(req, res) {
  try {
    const applicantId = req.params.id;

    const result = await ApplicantService.getApplicantByIdFromDB(applicantId);

    if (!result) {
      return res.status(404).json({ success: false, message: "Not found." });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
// Reject applicant ---------------------------
async function rejectApplication(req, res) {
  try {
    const applicantId = req.params.id;

    const existingApplicant =
      await ApplicantService.getApplicantByIdFromDB(applicantId);

    if (!existingApplicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found." });
    }

    const result = await ApplicantService.rejectApplicationInDB(applicantId);

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Application rejected" });
    }
    return res
      .status(200)
      .json({ success: false, message: "No changes were made." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error." });
  }
}
//  Delete applicant -------------------------------
async function deleteApplication(req, res) {
  try {
    const applicantId = req.params.id;

    const existingApplicant =
      await ApplicantService.getApplicantByIdFromDB(applicantId);

    if (!existingApplicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found.",
      });
    }

    const result = await ApplicantService.deleteApplicationFromDB(applicantId);

    if (result) {
      return res.status(200).json({
        success: true,
        message: "Application deleted successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const ApplicantController = {
  applyForTrainer,
  getAllApplicants,
  getApplicantById,
  rejectApplication,
  deleteApplication,
};
