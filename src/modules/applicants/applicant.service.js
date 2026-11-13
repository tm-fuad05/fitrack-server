import { Applicant } from "./applicant.model.js";

async function findApplicantByEmailFromDB(email) {
  const result = await Applicant.findOne({
    email,
  }).select("-__v");
  return result;
}

async function applyForTrainerInDB(payload) {
  const result = await Applicant.create(payload);
  return result;
}

async function getAllApplicantsFromDB() {
  const result = await Applicant.find().select("-__v").lean();
  return result;
}

async function getApplicantByEmailFromDB(email) {
  const result = await Applicant.findOne({ email }).select("-__v");
  return result;
}

async function getApplicantByIdFromDB(applicantId) {
  const result = await Applicant.findById(applicantId).select("-__v");
  return result;
}

async function rejectApplicationInDB(applicantId) {
  const updateStatus = {
    $set: {
      status: "rejected",
    },
  };
  const result = await Applicant.updateOne({ _id: applicantId }, updateStatus);
  return result;
}

async function deleteApplicationFromDB(email) {
  const result = await Applicant.deleteOne({ email });
  return result;
}

export const ApplicantService = {
  findApplicantByEmailFromDB,
  applyForTrainerInDB,
  getAllApplicantsFromDB,
  getApplicantByEmailFromDB,
  rejectApplicationInDB,
  deleteApplicationFromDB,
  getApplicantByIdFromDB,
};
