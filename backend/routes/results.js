const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { class: cls, section, term, academicYear } = req.query;
    const query = {};
    if (cls) query.class = cls;
    if (section) query.section = section;
    if (term) query.term = term;
    if (academicYear) query.academicYear = academicYear;
    const results = await Result.find(query).populate('student', 'name studentId').sort({ rank: 1 });
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('student', 'name studentId class section')
      .sort({ createdAt: -1 });
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/results/compute-ranks — recalculate ranks for a class/term
router.post('/compute-ranks', protect, authorize('admin'), async (req, res) => {
  try {
    const { class: cls, section, term, academicYear } = req.body;
    const results = await Result.find({ class: cls, section, term, academicYear }).sort({ percentage: -1 });
    for (let i = 0; i < results.length; i++) {
      results[i].rank = i + 1;
      await results[i].save();
    }
    res.json({ success: true, message: `Ranks computed for ${results.length} students` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
