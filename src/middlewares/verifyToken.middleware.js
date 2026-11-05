import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access!" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }
    req.decoded = decoded;
    next();
  });
};
