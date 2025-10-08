// index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import newsroomRoutes from "./routes/newsroom.routes.js";
import lostfounditemRoutes from "./routes/lostFound.routes.js";
import carpoolRoutes from "./routes/carpool.routes.js"; // Assuming carpoolRoutes is defined and imported
import sellbuysRoutes from "./routes/sellbuy.routes.js"; // Assuming sellbuysRoutes is defined and imported

// Load environment variables
dotenv.config();

// DB connection
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://connecting-campuses.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, Postman, or file uploads)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS rejected for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// App setup
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use("/api/user", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/college-events", newsroomRoutes);
app.use("/api/l-f-items", lostfounditemRoutes);
app.use("/api", carpoolRoutes); // Assuming carpoolRoutes is defined and imported
app.use("/api/sellbuys", sellbuysRoutes); // Assuming carpoolRoutes is defined and imported
