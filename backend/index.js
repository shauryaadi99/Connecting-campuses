// index.js
import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from './routes/user.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';





// Load environment variables
dotenv.config();










// DB connection
connectDB();

// App setup
const app = express();
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/newsroom', newsroomRoutes);
// app.use('/api/carpool', carpoolRoutes);
// app.use('/api/lostfound', lostAndFoundRoutes);
// app.use('/api/sellbuy', sellAndBuyRoutes);
// app.use('/api/attendance', attendanceRoutes);


app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials :true
}
app.use(cors(corsOptions));


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/user', userRoutes);
app.use('/api/attendance', attendanceRoutes);
