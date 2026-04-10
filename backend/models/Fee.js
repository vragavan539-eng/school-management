const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  student:      { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  term:         { type: String, required: true },
  academicYear: { type: String, required: true },
  totalAmount:  { type: Number, required: true },
  paidAmount:   { type: Number, default: 0 },
  dueDate:      { type: Date, required: true },
  status:       { type: String, enum: ['Paid', 'Partial', 'Pending', 'Waived'], default: 'Pending' },
  payments: [{
    amount:    { type: Number },
    date:      { type: Date, default: Date.now },
    method:    { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'DD'] },
    receiptNo: { type: String },
    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  scholarship: { type: Boolean, default: false },
  discount:    { type: Number, default: 0 },
  remarks:     { type: String },
}, { timestamps: true });

// Auto-update status before save
FeeSchema.pre('save', function (next) {
  const balance = this.totalAmount - this.discount - this.paidAmount;
  if (balance <= 0) this.status = 'Paid';
  else if (this.paidAmount > 0) this.status = 'Partial';
  else this.status = 'Pending';
  next();
});

module.exports = mongoose.model('Fee', FeeSchema);
