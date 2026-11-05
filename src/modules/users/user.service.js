import { ObjectId } from "mongodb";
import { client } from "../../config/dbConnect.js";

const userCollection = client.db("FitRackDB").collection("users");

async function getAllUsersfromDB() {
  const result = await userCollection.find().toArray();
  return result;
}

async function findUserByEmailFromDB(email) {
  const existing = await userCollection.findOne({ email });
  return existing;
}

async function findUserByIdFromDB(userId) {
  const existing = await userCollection.findOne({ _id: new ObjectId(userId) });
  return existing;
}

async function addUserInDB(payload) {
  const result = await userCollection.insertOne(payload);
  return result;
}

async function editUserInfoFromDB(userId, payload) {
  const filter = { _id: new ObjectId(userId) };

  const updatedProfile = {
    $set: {
      name: payload.name,
    },
  };
  const result = await userCollection.updateOne(filter, updatedProfile);
  return result;
}

async function deleteUserFromDB(userId) {
  const filter = { _id: new ObjectId(userId) };
  const result = await userCollection.deleteOne(filter);
  return result;
}

async function changeUserRoleFromDB(userId, role) {
  const filter = { _id: new ObjectId(userId) };
  const updatedRole = {
    $set: {
      role: role,
    },
  };
  const result = await userCollection.updateOne(filter, updatedRole);
  return result;
}

export const UserService = {
  getAllUsersfromDB,
  findUserByEmailFromDB,
  addUserInDB,
  findUserByIdFromDB,
  editUserInfoFromDB,
  deleteUserFromDB,
  changeUserRoleFromDB,
};
