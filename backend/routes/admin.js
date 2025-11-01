// ===== FILE: backend/routes/admin.js =====
const express = require('express');
const {
  getDashboardStats,
  approveDoctor,
  getPendingDoctors,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/doctors/pending', getPendingDoctors);
router.put('/doctors/:id/approve', approveDoctor);

module.exports = router;