import express from "express";
import {
  getUserAttendance,
  getSubjectAttendance,
  upsertAttendance,
  deleteSubjectForUser,
  clearAllAttendance,
} from "../controllers/attendance.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", (req, res) =>
  getUserAttendance({ ...req, params: { userId: req.user._id } }, res)
);

router.get("/:subject", (req, res) =>
  getSubjectAttendance(
    { ...req, params: { userId: req.id, subject: req.params.subject } },
    res
  )
);
router.delete("/subject/:subject", isAuthenticated, deleteSubjectForUser);

router.delete("/allclear", isAuthenticated, clearAllAttendance);

router.post("/", isAuthenticated, (req, res) => {
  upsertAttendance(req, res); // userId will come from req.user._id inside upsertAttendance
});

export default router;
