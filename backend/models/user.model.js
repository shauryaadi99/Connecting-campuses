import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^btech\d{5}\.\d{2}@bitmesra\.ac\.in$/,
        "Please use your registered college email (e.g., btech10467.23@bitmesra.ac.in)",
      ],
    },

    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    graduatingYear: {
      type: Number,
      required: true,
    },

    verificationToken: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    tokenExpires: {
      type: Date,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add this pre-save hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
