import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as crypto from "node:crypto";
import nodemailer from "nodemailer";
import sendEmail from "../config/sendEmail.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    console.log("📥 Incoming request to register user:", req.body);

    const { name, email, phone, password, graduatingYear } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !graduatingYear) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    if (!email.endsWith("@bitmesra.ac.in")) {
      return res.status(400).json({
        message: "Only BIT Mesra email IDs are allowed",
        success: false,
      });
    }

    const currentYear = new Date().getFullYear();
    if (parseInt(graduatingYear) < currentYear) {
      return res.status(400).json({
        message: "Graduating year must be current or future",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "User already exists and is verified",
          success: false,
        });
      } else {
        return res.status(400).json({
          message: "User already exists but not verified",
          success: false,
        });
      }
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour

    const newUser = await User.create({
      name,
      email,
      phone,
      password, // ✅ plain password - will be hashed by schema
      graduatingYear,
      verificationToken,
      tokenExpires,
    });

    const verifyURL = `${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"CONNECTING CAMPUSES" <${process.env.EMAIL_USER}>`,
        to: newUser.email,
        subject: "Verify Your Email",
        html: `<p>Hi ${newUser.name},</p>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyURL}">${verifyURL}</a>
        <p>This link will expire in 1 hour.</p>`,
      });
    } catch (mailErr) {
      console.error("❌ Email send error:", mailErr);
      return res.status(500).json({
        message: "User created, but failed to send verification email.",
        success: false,
      });
    }

    return res.status(201).json({
      message:
        "User registered. Please check your email to verify your account.",
      success: true,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
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
    const { email } = req.body;

    if (!email || !email.endsWith("@bitmesra.ac.in")) {
      return res.status(400).json({
        message: "A valid BIT Mesra email is required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User already verified", success: false });
    }

    // Generate a new token and expiry
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour

    user.verificationToken = verificationToken;
    user.tokenExpires = tokenExpires;
    await user.save();

    const verifyURL = `${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CONNECTING CAMPUSES" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Resend: Verify Your Email",
      html: `<p>Hi ${user.name},</p>
             <p>Click the link below to verify your account:</p>
             <a href="${verifyURL}">${verifyURL}</a>
             <p>This link will expire in 1 hour.</p>`,
    });

    return res.status(200).json({
      message: "Verification email resent. Please check your inbox.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    const resetURL = `${process.env.CLIENT_BASE_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetURL}`,
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Not expired
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password; // Hashing should be handled in a pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
