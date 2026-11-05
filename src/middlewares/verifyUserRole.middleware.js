import { client } from "../config/dbConnect.js";

const userCollection = client.db("FitRackDB").collection("users");

export const verifyAdmin = async (req, res, next) => {
  const email = req?.decoded?.email;
  const user = await userCollection.findOne({ email });
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden access." });
  }
  next();
};

export const verifyTrainer = async (req, res, next) => {
  const email = req?.decoded?.email;
  const user = await userCollection.findOne({ email: email });
  const isTrainer = user?.role === "trainer";
  if (!isTrainer) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden access" });
  }
  next();
};

export const verifyAdminORTrainer = async (req, res, next) => {
  const email = req?.decoded?.email;
  const user = await userCollection.findOne({ email: email });
  const isTrainer = user?.role === "trainer";
  const isAdmin = user?.role === "admin";
  if (!isTrainer && !isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden access" });
  }
  next();
};
