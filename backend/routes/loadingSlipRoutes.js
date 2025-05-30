const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createLoadingSlip,
  getLoadingSlips,
  getLoadingSlipById,
  updateLoadingSlip,
  deleteLoadingSlip
} = require('../controller/Features/loadingSlipController');

// All loading slip routes require authentication
router.use(authenticate);

// POST /api/loading-slip/create-loading-slip - Create a new loading slip
router.post('/create-loading-slip', createLoadingSlip);

// GET /api/loading-slip - Get all loading slips for the authenticated user
router.get('/', getLoadingSlips);

// GET /api/loading-slip/:id - Get a specific loading slip by ID
router.get('/:id', getLoadingSlipById);

// PUT /api/loading-slip/:id - Update a specific loading slip
router.put('/:id', updateLoadingSlip);

// DELETE /api/loading-slip/:id - Delete a specific loading slip
router.delete('/:id', deleteLoadingSlip);

module.exports = router;
