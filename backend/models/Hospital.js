
// ===== FILE: backend/models/Hospital.js =====
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add hospital name'],
    trim: true,
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
  },
  email: String,
  description: String,
  facilities: [String],
  departments: [String],
  images: [String],
  rating: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Hospital', hospitalSchema);
