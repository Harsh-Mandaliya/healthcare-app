
// ===== FILE: backend/models/MedicalRecord.js =====
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  recordType: {
    type: String,
    enum: ['consultation', 'test_result', 'prescription', 'diagnosis', 'vaccination'],
  },
  diagnosis: String,
  symptoms: [String],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
  },
  prescriptions: [{
    medicine: String,
    dosage: String,
    frequency: String,
    duration: String,
  }],
  testResults: [{
    testName: String,
    result: String,
    normalRange: String,
    date: Date,
    document: String,
  }],
  allergies: [String],
  chronicConditions: [String],
  documents: [String],
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);