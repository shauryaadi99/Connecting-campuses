import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as crypto from "node:crypto";
import sendEmail from "../config/sendEmail.js";

import dotenv from "dotenv";
import dns from "dns/promises";
// import sendEmail from "../config/sendEmail.js"; // SendGrid email sender

dotenv.config();

// Function to validate email existence via MX record
const isEmailValid = async (email) => {
  const domain = email.split("@")[1];
  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (err) {
    console.log("❌ MX lookup failed:", err);
    return false;
  }
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    console.log("📥 Incoming registration request:", req.body);

    const { name, email, phone, password, graduatingYear } = req.body;

    // --- Basic validation ---
    if (!name || !email || !phone || !password || !graduatingYear) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    if (!email.endsWith("@bitmesra.ac.in")) {
      return res.status(400).json({
        message: "Only BIT Mesra email IDs are allowed.",
        success: false,
      });
    }

    const currentYear = new Date().getFullYear();
    if (parseInt(graduatingYear) < currentYear) {
      return res.status(400).json({
        message: "Graduating year must be the current year or later.",
        success: false,
      });
    }

    // --- Validate if email actually exists ---
    const validEmail = await isEmailValid(email);
    if (!validEmail) {
      return res.status(400).json({
        message:
          "⚠️ The provided email address seems invalid. Please enter a correct BIT Mesra email.",
        success: false,
      });
    }

    // --- Check if user already exists ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          message:
            "User already exists and is verified. You can log in directly.",
          success: false,
        });
      } else {
        return res.status(400).json({
          message:
            "User exists but not verified. Please check your email or resend verification.",
          success: false,
        });
      }
    }

    // --- Generate verification token ---
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour

    // --- Create new user ---
    const newUser = await User.create({
      name,
      email,
      phone,
      password, // hashed via schema middleware
      graduatingYear,
      verificationToken,
      tokenExpires,
    });

    // --- Build verification URL ---
    const verifyURL = `${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}`;
    console.log("🔗 Verification URL:", verifyURL);

    // --- Email content ---
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Connecting Campuses, ${name}! 🎓</h2>
        <p>Thank you for registering with Connecting Campuses. Please verify your email to activate your account and start exploring the platform.</p>
        <a href="${verifyURL}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:5px;margin-top:10px;">Verify Email</a>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p><a href="${verifyURL}">${verifyURL}</a></p>
        <p style="color: #555;">This link will expire in 1 hour for security purposes.</p>
        <hr />
        <p style="font-size:12px;color:#666;">© ${new Date().getFullYear()} Connecting Campuses | BIT Mesra</p>
      </div>
    `;

    // --- Send verification email via SendGrid ---
    try {
      await sendEmail({
        to: newUser.email,
        subject: "Verify Your Connecting Campuses Account",
        text: `Please verify your email by clicking this link: ${verifyURL}`,
        html: htmlContent,
      });

      console.log("✅ Verification email sent to:", newUser.email);
    } catch (emailError) {
      console.error("❌ Failed to send verification email:", emailError);
      return res.status(500).json({
        message:
          "User registered, but failed to send verification email. Please try resending it.",
        success: false,
      });
    }

    return res.status(201).json({
      message:
        "✅ Registration successful! Please check your BIT Mesra email to verify your account.",
      success: true,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      success: false,
      error: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      graduatingYear: user.graduatingYear,
      isVerified: user.isVerified, // ✅ This was missing!
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None", // ⛳ Allows cross-site cookies (required for Vercel <-> Render)
        secure: true, // ⛳ Required for 'SameSite: None' to work properly
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user: userData,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// GET USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Not authenticated",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        graduatingYear: user.graduatingYear,
        // department: user.department, // Uncomment if you add this field later
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve user info",
      success: false,
      error: error.message,
    });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, graduatingYear } = req.body;

    const userId = req.user._id; // Fix: get userId from req.user

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (graduatingYear) {
      const currentYear = new Date().getFullYear();
      const gradYearNum = parseInt(graduatingYear, 10);
      if (isNaN(gradYearNum) || gradYearNum < currentYear) {
        return res.status(400).json({
          message:
            "Graduating year must be a valid number and current or future year",
          success: false,
        });
      }
      user.graduatingYear = gradYearNum;
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.name,
      email: user.email,
      phoneNumber: user.phone,
      graduatingYear: user.graduatingYear,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    console.log("🔁 Incoming resend verification request");

    const { email } = req.body;
    console.log("📧 Email received:", email);

    // --- Validation ---
    if (!email || !email.endsWith("@bitmesra.ac.in")) {
      console.warn("⚠️ Invalid email format or domain");
      return res.status(400).json({
        message: "A valid BIT Mesra email is required.",
        success: false,
      });
    }

    // --- Find user ---
    const user = await User.findOne({ email });
    console.log("👤 User found:", !!user);

    if (!user) {
      console.warn("❌ User not found for email:", email);
      return res.status(404).json({
        message: "User not found. Please register first.",
        success: false,
      });
    }

    if (user.isVerified) {
      console.info("✅ User already verified:", user.email);
      return res.status(400).json({
        message: "Your account is already verified. You can log in directly.",
        success: false,
      });
    }

    // --- Generate new token ---
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    user.verificationToken = verificationToken;
    user.tokenExpires = tokenExpires;

    try {
      await user.save();
      console.log("💾 User saved with new verification token");
    } catch (saveError) {
      console.error("❌ Error saving user:", saveError);
      return res.status(500).json({
        message:
          "Failed to save verification token. Please try again later.",
        success: false,
        error: saveError.message,
      });
    }

    // --- Build verification URL ---
    const verifyURL = `${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}`;
    console.log("🔗 Verification URL:", verifyURL);

    // --- Email content ---
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${user.name || "there"}! 👋</h2>
        <p>You requested to resend the verification email for your Connecting Campuses account.</p>
        <p>Please click the button below to verify your email and activate your account:</p>
        <a href="${verifyURL}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:5px;margin-top:10px;">Verify Email</a>
        <p>If the button doesn’t work, copy and paste this link in your browser:</p>
        <p><a href="${verifyURL}">${verifyURL}</a></p>
        <p>This verification link will expire in 1 hour.</p>
        <hr />
        <p style="font-size:12px;color:#666;">© ${new Date().getFullYear()} Connecting Campuses | BIT Mesra</p>
      </div>
    `;

    // --- Send email via SendGrid ---
    try {
      await sendEmail({
        to: user.email,
        subject: "Resend: Verify Your Connecting Campuses Account",
        text: `Verify your email by clicking the link: ${verifyURL}`,
        html: htmlContent,
      });
      console.log("📨 Verification email resent to:", user.email);
    } catch (emailError) {
      console.error(
        "❌ Failed to send verification email:",
        emailError
      );
      return res.status(500).json({
        message:
          "Failed to send verification email. Please try again later.",
        success: false,
        error: emailError.message,
      });
    }

    return res.status(200).json({
      message:
        "✅ Verification email resent successfully. Please check your inbox.",
      success: true,
    });
  } catch (error) {
    console.error("❌ General error:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      success: false,
      error: error.message,
    });
  }
};

// --- Forgot Password ---
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !email.endsWith("@bitmesra.ac.in")) {
      return res.status(400).json({
        message: "Please enter a valid BIT Mesra email address.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email. Please register first.",
        success: false,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    const resetURL = `${process.env.CLIENT_BASE_URL}/reset-password/${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${user.name || "there"}! 👋</h2>
        <p>We received a request to reset your Connecting Campuses password.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetURL}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:5px;margin-top:10px;">Reset Password</a>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p><a href="${resetURL}">${resetURL}</a></p>
        <p>This link will expire in 1 hour.</p>
        <hr />
        <p style="font-size:12px;color:#666;">© ${new Date().getFullYear()} Connecting Campuses | BIT Mesra</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Connecting Campuses Password",
      text: `Reset your password using this link: ${resetURL}`,
      html: htmlContent,
    });

    console.log("📨 Password reset email sent to:", user.email);

    res.status(200).json({
      message: "✅ Password reset link sent successfully. Please check your email.",
      success: true,
    });
  } catch (err) {
    console.error("❌ Error in forgotPassword:", err);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
      success: false,
      error: err.message,
    });
  }
};

// --- Reset Password ---
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset link.",
        success: false,
      });
    }

    user.password = password; // Hashing handled in pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "✅ Password reset successfully. You can now log in with your new password.",
      success: true,
    });
  } catch (err) {
    console.error("❌ Error in resetPassword:", err);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
      success: false,
      error: err.message,
    });
  }
};
