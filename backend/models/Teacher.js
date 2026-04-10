const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  teacherId:   { type: String, unique: true },
  name:        { type: String, required: true },
  email:       { type: String, unique: true },
  phone:       { type: String },
  subject:     { type: String, required: true },
  classes:     [{ type: String }],
  qualification: { type: String },
  experience:  { type: Number, default: 0 },
  joinDate:    { type: Date, default: Date.now },
  salary:      { type: Number },
  photo:       { type: String },
  isActive:    { type: Boolean, default: true },
  onLeave:     { type: Boolean, default: false },
}, { timestamps: true });

TeacherSchema.pre('save', async function (next) {
  if (!this.teacherId) {
    const count = await mongoose.model('Teacher').countDocuments();
    this.teacherId = `T${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Teacher', TeacherSchema);
