// ===== FILE: backend/routes/bills.js =====
const express = require('express');
const {
  createBill,
  getBills,
  getBill,
  createPaymentIntent,
  updatePaymentStatus,
} = require('../controllers/billController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('doctor', 'admin'), createBill);
router.get('/', protect, getBills);
router.get('/:id', protect, getBill);
router.post('/:id/payment-intent', protect, authorize('patient'), createPaymentIntent);
router.put('/:id/payment', protect, authorize('patient'), updatePaymentStatus);

module.exports = router;