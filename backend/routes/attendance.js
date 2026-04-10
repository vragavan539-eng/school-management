const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// GET /api/attendance?class=10&section=A&date=2026-04-05
router.get('/', protect, async (req, res) => {
  try {
    const { class: cls, section, date, studentId, month, year } = req.query;
    const query = {};
    if (cls) query.class = cls;
    if (section) query.section = section;
    if (date) {
      const d = new Date(date);
      query.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lt: new Date(d.setHours(23, 59, 59, 999)) };
    }
    if (month && year) {
      query.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }
    if (studentId) query.student = studentId;
    const records = await Attendance.find(query).populate('student', 'name studentId').sort({ date: -1 });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/attendance/bulk — mark for full class at once
router.post('/bulk', protect, async (req, res) => {
  try {
    const { records, class: cls, section, date } = req.body;
    const ops = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, date: new Date(date) },
        update: { $set: { student: r.studentId, class: cls, section, date: new Date(date), status: r.status, markedBy: req.user._id } },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    res.json({ success: true, message: `Attendance saved for ${records.length} students` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/attendance/summary/:studentId — monthly summary
router.get('/summary/:studentId', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const records = await Attendance.find({
      student: req.params.studentId,
      date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
    });
    const summary = { Present: 0, Absent: 0, Late: 0, Holiday: 0 };
    records.forEach((r) => summary[r.status]++);
    const total = summary.Present + summary.Absent + summary.Late;
    summary.percentage = total > 0 ? Math.round(((summary.Present + summary.Late * 0.5) / total) * 100) : 0;
    res.json({ success: true, summary, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
