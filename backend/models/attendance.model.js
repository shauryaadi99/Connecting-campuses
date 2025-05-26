// models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  records: {
    type: Map,
    of: {
      type: String,
      enum: ['present', 'absent', 'cancelled'],  // only these statuses allowed
    },
    default: {},
  },
}, {
  timestamps: true,
});

attendanceSchema.index({ userId: 1, subject: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
