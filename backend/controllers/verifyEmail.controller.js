import User from "../models/user.model.js";

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  console.log("📩 [verifyEmail] Received token:", token);

  if (!token) {
    console.warn("❌ No token provided.");
    return res.status(400).json({ message: "Verification token is missing", success: false });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    console.warn("❌ No user found with that token.");
    return res.status(400).json({ message: "Token is invalid", success: false });
  }

  console.log("👤 User found:", user.email);
  console.log("⏰ Token expires at:", new Date(user.tokenExpires));
  console.log("📆 Current time is:", new Date());

  if (user.tokenExpires < Date.now()) {
    console.warn("❌ Token has expired.");
    return res.status(400).json({ message: "Token has expired", success: false });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.tokenExpires = undefined;
  await user.save();

  console.log("✅ Email verified for:", user.email);

  return res.status(200).json({ message: "Email verified successfully!", success: true });
};
