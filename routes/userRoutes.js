const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { verifyAdmin } = require('../middlewares/verifyAdmin');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/verify-email', userController.verifyEmail);
router.post('/check-email', userController.checkEmail);
router.post('/signin', userController.signin);
router.post('/forgot-password', userController.forgotPassword);
router.get('/reset-password/:token', userController.verifyResetToken);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/google-signin', userController.googleSignin);
router.get('/profile/:userId', userController.getProfileById); // Add getProfile route with authentication


// Admin routes (require authentication and admin role)
router.get('/users', auth, verifyAdmin, userController.getAllUsers);
router.get('/users/:id', auth, verifyAdmin, userController.getUserById);
router.post('/users', auth, verifyAdmin, userController.createUser);
router.put('/users/:id', auth, verifyAdmin, userController.updateUser);
router.delete('/users/:id', auth, verifyAdmin, userController.deleteUser);
router.get('/users/search', auth, verifyAdmin, userController.searchUsers);

module.exports = router;
