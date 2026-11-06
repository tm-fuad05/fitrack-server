import { User } from "../modules/users/user.model.js";

export const verifyAdmin = async (req, res, next) => {
  const { email } = req.decoded;
  const user = await User.findOne({ email });
  const isAdmin = user?.role === "ADMIN";
  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden access." });
  }
  next();
};

export const verifyTrainer = async (req, res, next) => {
  const { email } = req.decoded;
  const user = await User.findOne({ email });
  const isTrainer = user?.role === "TRAINER";
  if (!isTrainer) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden access" });
  }
  next();
};

export const verifyAdminORTrainer = async (req, res, next) => {
  const { email } = req.decoded;
  const user = await User.findOne({ email });
  const isTrainer = user?.role === "TRAINER";
  const isAdmin = user?.role === "ADMIN";
  if (!isTrainer && !isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden access" });
  }
  next();
};
