const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class:   { type: String, required: true },
  section: { type: String, required: true },
  date:    { type: Date, required: true },
  status:  { type: String, enum: ['Present', 'Absent', 'Late', 'Holiday'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks:  { type: String },
}, { timestamps: true });

// Prevent duplicate attendance for same student on same date
AttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
