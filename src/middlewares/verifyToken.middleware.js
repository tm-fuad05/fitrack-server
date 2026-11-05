export const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    req.decoded = decoded;
    next();
  });
};
