const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId:   { type: String, unique: true },
  name:        { type: String, required: true },
  dateOfBirth: { type: Date },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'] },
  class:       { type: String, required: true },
  section:     { type: String, required: true },
  rollNumber:  { type: Number },
  photo:       { type: String },
  parent: {
    name:         { type: String },
    phone:        { type: String },
    email:        { type: String },
    relationship: { type: String, default: 'Father' },
  },
  address: {
    street: String,
    city:   String,
    state:  String,
    pincode: String,
  },
  admissionDate: { type: Date, default: Date.now },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate studentId before save
StudentSchema.pre('save', async function (next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `S${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', StudentSchema);
