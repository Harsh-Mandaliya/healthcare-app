
// ===== FILE: backend/models/Bill.js =====
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  billNumber: {
    type: String,
    unique: true,
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
  }],
  consultationFee: Number,
  medicinesCost: Number,
  testsCost: Number,
  otherCharges: Number,
  subtotal: Number,
  tax: Number,
  discount: Number,
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'insurance'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded'],
    default: 'pending',
  },
  paidAmount: Number,
  stripePaymentId: String,
  dueDate: Date,
}, {
  timestamps: true,
});

// Generate bill number before saving
billSchema.pre('save', async function(next) {
  if (!this.billNumber) {
    const count = await mongoose.model('Bill').countDocuments();
    this.billNumber = `BILL-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);
