import { client } from "../../config/dbConnect.js";

const applicantCollection = client.db("FitRackDB").collection("applicants");

async function findApplicantByEmailFromDB(email) {
  const result = await applicantCollection.findOne({
    email,
  });
  return result;
}

async function applyForTrainerInDB(payload) {
  const result = await applicantCollection.insertOne(payload);
  return result;
}

async function getAllApplicantsFromDB() {
  const result = await applicantCollection.find().toArray();
  return result;
}

async function getApplicantByIdFromDB(applicantId) {
  const filter = {
    _id: new ObjectId(applicantId),
  };
  const result = await applicantCollection.findOne(filter);
  return result;
}

async function rejectApplicationInDB(applicantId) {
  const filter = { _id: new ObjectId(applicantId) };
  const updateStatus = {
    $set: {
      status: "rejected",
    },
  };

  const result = await applicantCollection.updateOne(filter, updateStatus);
  return result;
}

async function deleteApplicationFromDB(applicantId) {
  const filter = {
    _id: new ObjectId(applicantId),
  };
  const result = await applicantCollection.deleteOne(filter);
  return result;
}

export const ApplicantService = {
  findApplicantByEmailFromDB,
  applyForTrainerInDB,
  getAllApplicantsFromDB,
  getApplicantByIdFromDB,
  rejectApplicationInDB,
  deleteApplicationFromDB,
};
