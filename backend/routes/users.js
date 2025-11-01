// ===== FILE: backend/routes/users.js =====
const express = require('express');
const {
  getProfile,
  updateProfile,
  updatePassword,
  getUsers,
  getUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
