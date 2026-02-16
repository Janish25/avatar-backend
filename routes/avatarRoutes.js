const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/avatarController');

/**
 * Avatar Routes
 */

// Create new avatar
router.post('/avatar', avatarController.createAvatar);

// Get avatar by user ID
router.get('/avatar/:adUserId', avatarController.getAvatar);

// Update avatar
router.put('/avatar/:adUserId', avatarController.updateAvatar);

// Delete avatar
router.delete('/avatar/:adUserId', avatarController.deleteAvatar);

module.exports = router;
