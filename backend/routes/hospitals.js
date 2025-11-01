// ===== FILE: backend/routes/hospitals.js =====
const express = require('express');
const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getHospitalsByState,
} = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getHospitals);
router.get('/:id', getHospital);
router.get('/states/:state', getHospitalsByState);
router.post('/', protect, authorize('admin'), createHospital);
router.put('/:id', protect, authorize('admin'), updateHospital);
router.delete('/:id', protect, authorize('admin'), deleteHospital);

module.exports = router;