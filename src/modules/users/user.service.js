import { User } from "./user.model.js";

async function getAllUsersfromDB() {
  const result = await User.find().select("-__v").lean();
  return result;
}

async function getUserByEmailFromDB(email) {
  const result = await User.findOne({ email }).select("-__v");
  return result;
}

async function getUserByIdFromDB(userId) {
  const result = await User.findById(userId).select("-__v");
  return result;
}

async function addUserInDB(payload) {
  const result = await User.create(payload);
  return result;
}

async function editUserInfoFromDB(email, payload) {
  const updatedProfile = {
    $set: {
      name: payload.name,
    },
  };
  const result = await User.updateOne({ email }, updatedProfile, {
    timestamps: false,
  });
  return result;
}

async function deleteUserFromDB(userId) {
  const result = await User.findByIdAndDelete(userId);
  return result;
}

async function changeUserRoleFromDB(email, role) {
  const updatedRole = {
    $set: {
      role: role,
    },
  };
  const result = await User.updateOne({ email }, updatedRole);
  return result;
}

export const UserService = {
  getAllUsersfromDB,
  getUserByEmailFromDB,
  addUserInDB,
  getUserByIdFromDB,
  editUserInfoFromDB,
  deleteUserFromDB,
  changeUserRoleFromDB,
};
