const mongoose = require('mongoose');

const SubjectMarkSchema = new mongoose.Schema({
  subject:    { type: String, required: true },
  maxMarks:   { type: Number, default: 100 },
  marksObtained: { type: Number, required: true },
  grade:      { type: String },
  isPassed:   { type: Boolean, default: true },
});

const ResultSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class:     { type: String, required: true },
  section:   { type: String, required: true },
  term:      { type: String, enum: ['Term 1', 'Term 2', 'Final'], required: true },
  academicYear: { type: String, required: true },
  subjects:  [SubjectMarkSchema],
  totalMarks:  { type: Number },
  percentage:  { type: Number },
  grade:       { type: String },
  rank:        { type: Number },
  remarks:     { type: String },
  publishedAt: { type: Date },
}, { timestamps: true });

// Auto-calculate totals before save
ResultSchema.pre('save', function (next) {
  if (this.subjects && this.subjects.length > 0) {
    const total = this.subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const maxTotal = this.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    this.totalMarks = total;
    this.percentage = Math.round((total / maxTotal) * 100);
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B+';
    else if (this.percentage >= 60) this.grade = 'B';
    else if (this.percentage >= 50) this.grade = 'C';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('Result', ResultSchema);
