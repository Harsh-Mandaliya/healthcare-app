// ===== FILE: backend/routes/doctors.js =====
const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctorProfile,
  updateDoctorProfile,
  addReview,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.post('/', protect, authorize('doctor', 'admin'), createDoctorProfile);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctorProfile);
router.post('/:id/reviews', protect, authorize('patient'), addReview);

module.exports = router;
