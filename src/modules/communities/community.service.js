import { Community } from "./community.model.js";

async function addCommunityInDB(payload) {
  const result = await Community.create(payload);
  return result;
}

async function findCommunityByIdFromDB(forumId) {
  const result = await Community.findById(forumId).select("-__v");
  return result;
}

async function getAllCommunitiesFromDB() {
  const result = await Community.find()
    .sort({ date: -1 })
    .select("-__v")
    .lean();
  return result;
}

async function getRecentCommunitiesFromDB() {
  const result = await Community.find()
    .sort({ date: -1 })
    .limit(6)
    .select("-__v")
    .lean();
  return result;
}

async function voteCommunityInDB(forumId, userEmail) {
  const existingForum = await findCommunityByIdFromDB(forumId);

  const isAlreadyVoted = existingForum.votedBy?.includes(userEmail);

  let updateDoc = {};

  if (isAlreadyVoted) {
    updateDoc = {
      $pull: { votedBy: userEmail },
    };
  } else {
    updateDoc = {
      $addToSet: { votedBy: userEmail },
    };
  }

  const result = await Community.updateOne({ _id: forumId }, updateDoc);

  return result;
}

export const CommunityService = {
  addCommunityInDB,
  getAllCommunitiesFromDB,
  getRecentCommunitiesFromDB,
  voteCommunityInDB,
  findCommunityByIdFromDB,
};
