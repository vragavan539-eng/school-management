const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { status, class: cls, term } = req.query;
    const query = {};
    if (status) query.status = status;
    if (term) query.term = term;
    const fees = await Fee.find(query).populate('student', 'name studentId class section').sort({ dueDate: 1 });
    res.json({ success: true, fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/summary', protect, async (req, res) => {
  try {
    const agg = await Fee.aggregate([
      { $group: { _id: '$status', total: { $sum: '$totalAmount' }, paid: { $sum: '$paidAmount' }, count: { $sum: 1 } } }
    ]);
    res.json({ success: true, summary: agg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json({ success: true, fee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/fees/:id/payment — record a payment
router.post('/:id/payment', protect, async (req, res) => {
  try {
    const { amount, method, receiptNo } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
    fee.payments.push({ amount, method, receiptNo, collectedBy: req.user._id });
    fee.paidAmount += amount;
    await fee.save();
    res.json({ success: true, fee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
