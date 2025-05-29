import mongoose from "mongoose";

const lostFoundItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
      data: Buffer,
      contentType: String,
    },
  contact: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date(); // Date must not be in the future
      },
      message: "Date cannot be in the future.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LostFoundItem = mongoose.model("LostFoundItem", lostFoundItemSchema);
export default LostFoundItem;
