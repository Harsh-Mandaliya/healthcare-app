// ===== FILE: backend/models/Doctor.js =====
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please add specialization'],
  },
  qualifications: [String],
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add consultation fee'],
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    slots: [{
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false,
      },
    }],
  }],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [{
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);