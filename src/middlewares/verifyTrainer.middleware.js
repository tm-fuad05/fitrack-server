export const VerifyTrainer = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await userCollection.findOne({ email: email });
  const isTrainer = user?.role === "trainer";
  if (!isTrainer) {
    return res.status(403).json({ message: "Forbidden access" });
  }
  next();
};
