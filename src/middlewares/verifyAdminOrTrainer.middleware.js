export const VerifyAdminORTrainer = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await userCollection.findOne({ email: email });
  const isTrainer = user?.role === "trainer";
  const isAdmin = user?.role === "admin";
  if (!isTrainer && !isAdmin) {
    return res.status(403).json({ message: "Forbidden access" });
  }
  next();
};
