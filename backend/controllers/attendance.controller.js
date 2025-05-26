import Attendance from "../models/attendance.model.js";
import mongoose from "mongoose";

// Get all attendance records for a user (all subjects)
export const getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("[getUserAttendance] userId:", userId);

    const records = await Attendance.find({ userId });
    console.log(
      "[getUserAttendance] fetched records:",
      JSON.stringify(records, null, 2)
    );

    res.json(records);
  } catch (err) {
    console.error("[getUserAttendance] Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get attendance for a specific subject for a user
export const getSubjectAttendance = async (req, res) => {
  try {
    const { userId, subject } = req.params;
    console.log("[getSubjectAttendance] userId:", userId, "subject:", subject);

    const record = await Attendance.findOne({ userId, subject });
    if (!record) {
      console.log("[getSubjectAttendance] No attendance record found");
      return res.status(404).json({ error: "Attendance not found" });
    }
    console.log(
      "[getSubjectAttendance] found record:",
      JSON.stringify(record, null, 2)
    );

    res.json(record);
  } catch (err) {
    console.error("[getSubjectAttendance] Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create or update attendance status for a specific date & subject
export const upsertAttendance = async (req, res) => {
  try {
    console.log("[upsertAttendance] req.body:", req.body);

    const { subject, date, status } = req.body;
    const userId = req.user?._id;
    console.log(
      "[upsertAttendance] userId:", userId,
      "subject:", subject,            
      "date:", date,
      "status:", status 
    );

    if (!["present", "absent", "cancelled"].includes(status)) {
      console.log("[upsertAttendance] Invalid status:", status);
      return res.status(400).json({ error: "Invalid status" });
    }

    const upperCaseSubject = subject.toUpperCase(); // Convert subject to uppercase

    const record = await Attendance.findOneAndUpdate(
      { userId, subject: upperCaseSubject },
      { $set: { [`records.${date}`]: status, subject: upperCaseSubject } },
      { upsert: true, new: true }
    );

    console.log(
      "[upsertAttendance] updated record:",
      JSON.stringify(record, null, 2)
    );
    res.json(record);
  } catch (err) {
    console.error("[upsertAttendance] Failed to update attendance:", err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
};

export const deleteSubjectForUser = async (req, res) => {
  console.log("[deleteSubjectForUser] DELETE request received.");

  // Log req.user to check if middleware passed the user correctly
  console.log("[deleteSubjectForUser] req.user:", req.user);

    const userId = req.user?._id;
  const { subject } = req.params;

  if (!userId) {
    console.error(
      "[deleteSubjectForUser] No user ID found in request. Authentication middleware may have failed."
    );
    return res.status(401).json({ error: "Unauthorized: User ID missing" });
  }

  if (!subject) {
    console.warn(
      "[deleteSubjectForUser] Subject parameter is missing in request."
    );
    return res.status(400).json({ error: "Subject name is required" });
  }

  try {
    console.log(
      `[deleteSubjectForUser] Attempting to delete subject "${subject}" for user "${userId}"`
    );

    const result = await Attendance.deleteOne({
      userId: new mongoose.Types.ObjectId(userId), // <-- Use `new` here
      subject,
    });

    console.log("[deleteSubjectForUser] MongoDB deleteOne result:", result);

    if (result.deletedCount === 0) {
      console.warn(
        `[deleteSubjectForUser] Subject "${subject}" not found for user "${userId}"`
      );
      return res
        .status(404)
        .json({ error: "Subject not found or already deleted" });
    }

    console.log(
      `[deleteSubjectForUser] Subject "${subject}" deleted successfully for user "${userId}"`
    );
    return res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("[deleteSubjectForUser] Unexpected error occurred:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/attendance.controller.js
export const clearAllAttendance = async (req, res) => {
  try {
    console.log("[clearAllAttendance] Request received");

    // Optional: You might want to restrict this to admins only.
    // For now, just clear all attendance documents.
    const result = await Attendance.deleteMany({});

    console.log(
      `[clearAllAttendance] Deleted ${result.deletedCount} attendance records`
    );

    return res
      .status(200)
      .json({ message: `Deleted ${result.deletedCount} attendance records` });
  } catch (err) {
    console.error("[clearAllAttendance] Error:", err);
    return res.status(500).json({ error: "Failed to clear attendance data" });
  }
};
