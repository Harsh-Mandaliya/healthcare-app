// ===== FILE: backend/routes/appointments.js =====
const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  addPrescription,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointment);
router.put('/:id', protect, authorize('doctor', 'admin'), updateAppointment);
router.delete('/:id', protect, cancelAppointment);
router.post('/:id/prescription', protect, authorize('doctor'), addPrescription);

module.exports = router;




