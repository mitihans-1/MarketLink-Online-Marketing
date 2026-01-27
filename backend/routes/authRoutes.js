const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, googleAuth, facebookAuth, getUserProfile, updateUserProfile, getAllUsers, updateUserRole, deleteUser, switchToSeller, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/facebook', facebookAuth);
router.post('/switch-to-seller', protect, switchToSeller);
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin Routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.route('/users/:id')
    .put(protect, authorize('admin'), updateUserRole)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
