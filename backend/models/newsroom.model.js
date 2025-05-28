import mongoose from "mongoose";


const newsroomEventSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    club: { type: String, required: true },
    title: { type: String, required: true },
    src: { type: String }, // Image URL
    description: { type: String },
    date: { type: Date, required: true },
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

const NewsroomEvent = mongoose.model("NewsroomEvent", newsroomEventSchema);

export default NewsroomEvent;