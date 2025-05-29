import mongoose from "mongoose";

const sellbuySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    default: "",
  },
  whatsappNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^91\d{10}$/.test(v),
      message: (props) =>
        `${props.value} is not a valid Indian WhatsApp number!`,
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: (v) => /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SellBuy = mongoose.model("SellBuy", sellbuySchema);
export default SellBuy;
