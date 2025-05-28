const express = require('express');
const router = express.Router();
const { login, register } = require('../controller/Auth/authController');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/register', register);
router.post('/login', login);


module.exports = router;
