
// ===== FILE: backend/models/Appointment.js =====
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please add appointment date'],
  },
  timeSlot: {
    startTime: String,
    endTime: String,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  reasonForVisit: String,
  symptoms: [String],
  notes: String,
  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
    }],
    instructions: String,
    followUpDate: Date,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  amount: Number,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
