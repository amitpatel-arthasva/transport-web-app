const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

// Protected route example
router.get('/profile', authenticate, (req, res) => {
  // req.user is available from the authenticate middleware
  return res.status(200).json({
    success: true,
    message: 'Profile data retrieved successfully',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
