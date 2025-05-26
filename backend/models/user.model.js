import mongoose from "mongoose";

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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
