const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  category: { type: String, enum: ['General', 'Exam', 'Event', 'Holiday', 'Fee', 'Sports'], default: 'General' },
  audience: { type: String, enum: ['All', 'Students', 'Teachers', 'Parents', 'Staff'], default: 'All' },
  targetClass: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date },
  isActive:  { type: Boolean, default: true },
  attachments: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);
