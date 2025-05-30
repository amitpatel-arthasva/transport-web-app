const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createLorryReceipt,
  getLorryReceipts,
  getLorryReceiptById,
  updateLorryReceipt,
  deleteLorryReceipt,
  generateLorryReceiptPdf
} = require('../controller/Features/lorryReceiptController');

// All lorry receipt routes require authentication
router.use(authenticate);

// POST /api/lorry-receipt/create-lorry-receipt - Create a new lorry receipt
router.post('/create-lorry-receipt', createLorryReceipt);

// GET /api/lorry-receipt - Get all lorry receipts for the authenticated user
router.get('/', getLorryReceipts);

// GET /api/lorry-receipt/:id - Get a specific lorry receipt by ID
router.get('/:id', getLorryReceiptById);

// PUT /api/lorry-receipt/:id - Update a specific lorry receipt
router.put('/:id', updateLorryReceipt);

// DELETE /api/lorry-receipt/:id - Delete a specific lorry receipt
router.delete('/:id', deleteLorryReceipt);

// GET /api/lorry-receipt/:id/pdf - Generate PDF for a specific lorry receipt
router.get('/:id/pdf', generateLorryReceiptPdf);

module.exports = router;
