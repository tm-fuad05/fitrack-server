export const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await userCollection.findOne({ email: email });
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden access" });
  }
  next();
};

export const verifyTrainer = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await userCollection.findOne({ email: email });
  const isTrainer = user?.role === "trainer";
  if (!isTrainer) {
    return res.status(403).json({ message: "Forbidden access" });
  }
  next();
};

export const verifyAdminORTrainer = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await userCollection.findOne({ email: email });
  const isTrainer = user?.role === "trainer";
  const isAdmin = user?.role === "admin";
  if (!isTrainer && !isAdmin) {
    return res.status(403).json({ message: "Forbidden access" });
  }
  next();
};
