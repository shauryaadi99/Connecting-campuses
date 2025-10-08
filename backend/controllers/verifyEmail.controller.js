import User from "../models/user.model.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("📩 [verifyEmail] Received token:", token);

    if (!token) {
      console.warn("❌ No token provided.");
      return res.status(400).json({
        success: false,
        message: "Verification token is missing.",
      });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      console.warn("❌ No user found with that token.");
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    if (user.tokenExpires < Date.now()) {
      console.warn("❌ Token has expired.");
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please request a new verification email.",
      });
    }

    if (user.isVerified) {
      console.info("✅ User already verified:", user.email);
      return res.status(200).json({
        success: true,
        message: "Your email is already verified. Redirecting to login...",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpires = undefined;
    await user.save();

    console.log("✅ Email verified successfully for:", user.email);
    return res.status(200).json({
      success: true,
      message: "Your email has been verified successfully! Redirecting to login...",
    });
  } catch (error) {
    console.error("❌ Error during email verification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
