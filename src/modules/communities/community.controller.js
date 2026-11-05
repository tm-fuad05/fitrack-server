import { CommunityService } from "./community.service.js";

// Post community
async function addCommunity(req, res) {
  try {
    const forumInfo = req.body;

    if (!forumInfo || Object.keys(forumInfo).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Forum info is required." });
    }

    const result = await CommunityService.addCommunityInDB(forumInfo);

    if (result.insertedId) {
      return res
        .status(201)
        .json({ success: true, message: "Community posted" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to post forum." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

// All Communities-----------------------
async function getAllCommunities(req, res) {
  try {
    const result = await CommunityService.getAllCommunitiesFromDB();
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
// Recent Communities---------------------
async function getRecentCommunities(req, res) {
  try {
    const result = await CommunityService.getRecentCommunitiesFromDB();
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

// UpVote---------------------
async function voteCommunity(req, res) {
  try {
    const forumId = req.params.id;
    const userEmail = req.decoded?.email;

    const existingForum =
      await CommunityService.findCommunityByIdFromDB(forumId);

    if (!existingForum) {
      return res
        .status(404)
        .json({ success: false, message: "Forum not found." });
    }

    const result = await CommunityService.voteCommunityInDB(forumId, userEmail);

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true });
    }

    return res
      .status(200)
      .json({ success: false, message: "No changess were made." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const CommunityController = {
  addCommunity,
  getAllCommunities,
  getRecentCommunities,
  voteCommunity,
};
