const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { viewProfile, updateUser } = require('../controller/userController');

// Protected route example
router.get('/profile', authenticate, viewProfile);

// Update user profile
router.put('/profile', authenticate, updateUser);



module.exports = router;
