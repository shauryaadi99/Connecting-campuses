import mongoose from "mongoose";

const newsroomEventSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    club: { type: String, required: true },
    title: { type: String, required: true },
    photo: {
      data: Buffer,
      contentType: String,
    },
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
