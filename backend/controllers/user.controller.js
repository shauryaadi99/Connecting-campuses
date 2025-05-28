import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  console.log(req.body); // See what's actually being received
  try {
    const {
      name,
      email,
      phone,
      password,
      // department,
      graduatingYear,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      // !department ||
      !graduatingYear
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
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
        message: "Graduating year must be current or future year",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      // department,
      graduatingYear,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.fullname,
        email: newUser.email,
        // department: newUser.department,
        graduatingYear: newUser.graduatingYear,
      },
    });
  } catch (error) {
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
      return res.status(400).json({
        message: "Invalid email or password",
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
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict", // or 'lax' depending on frontend/backend setup
        secure: process.env.NODE_ENV === "production", // only HTTPS in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
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
        message: 'Not authenticated',
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
      message: 'Failed to retrieve user info',
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

    const userId = req.user._id;  // Fix: get userId from req.user

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
          message: "Graduating year must be a valid number and current or future year",
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
