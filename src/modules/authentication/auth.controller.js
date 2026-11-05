import jwt from "jsonwebtoken";
const secret = process.env.ACCESS_TOKEN_SECRET;

async function login(req, res) {
  try {
    const user = req.body;
    if (!user?.email) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const token = jwt.sign(user, secret, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      data: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}
export const AuthController = {
  login,
};
