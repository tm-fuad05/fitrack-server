export const VerifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await userCollection.findOne({ email: email });
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden access" });
  }
  next();
};
