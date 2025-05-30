const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createDeliverySlip,
  getDeliverySlips,
  getDeliverySlipById,
  updateDeliverySlip,
  deleteDeliverySlip,
  updateDeliveryStatus
} = require('../controller/Features/deliverySlipController');

// All delivery slip routes require authentication
router.use(authenticate);

// POST /api/delivery-slip/create-delivery-slip - Create a new delivery slip
router.post('/create-delivery-slip', createDeliverySlip);

// GET /api/delivery-slip - Get all delivery slips for the authenticated user
router.get('/', getDeliverySlips);

// GET /api/delivery-slip/:id - Get a specific delivery slip by ID
router.get('/:id', getDeliverySlipById);

// PUT /api/delivery-slip/:id - Update a specific delivery slip
router.put('/:id', updateDeliverySlip);

// PUT /api/delivery-slip/:id/status - Update delivery status specifically
router.put('/:id/status', updateDeliveryStatus);

// DELETE /api/delivery-slip/:id - Delete a specific delivery slip
router.delete('/:id', deleteDeliverySlip);

module.exports = router;
