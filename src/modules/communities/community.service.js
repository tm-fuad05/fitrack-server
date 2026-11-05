import { ObjectId } from "mongodb";
import { client } from "../../config/dbConnect.js";

const communityCollection = client.db("FitRackDB").collection("community");

async function addCommunityInDB(payload) {
  const result = await communityCollection.insertOne(payload);
  return result;
}

async function findCommunityByIdFromDB(forumId) {
  const filter = { _id: new ObjectId(forumId) };
  const result = await communityCollection.findOne(filter);
  return result;
}

async function getAllCommunitiesFromDB() {
  const result = await communityCollection.find().sort({ date: -1 }).toArray();
  return result;
}

async function getRecentCommunitiesFromDB() {
  const result = await communityCollection
    .find()
    .sort({ date: -1 })
    .limit(6)
    .toArray();
  return result;
}

async function voteCommunityInDB(forumId, userEmail) {
  const filter = { _id: new ObjectId(forumId) };

  const existingForum = await findCommunityByIdFromDB(forumId);

  const isAlreadyUpvoted = existingForum.votedBy?.includes(userEmail);

  let updateDoc = {};

  if (isAlreadyUpvoted) {
    updateDoc = {
      $pull: { votedBy: userEmail },
    };
  } else {
    updateDoc = {
      $addToSet: { votedBy: userEmail },
    };
  }

  const result = await communityCollection.updateOne(filter, updateDoc);

  return result;
}

export const CommunityService = {
  addCommunityInDB,
  getAllCommunitiesFromDB,
  getRecentCommunitiesFromDB,
  voteCommunityInDB,
  findCommunityByIdFromDB,
};
