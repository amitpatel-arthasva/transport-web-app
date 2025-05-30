const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  generateInvoicePdf,
  getInvoicesFromLorryReceipts
} = require('../controller/Features/invoiceController');

// All invoice routes require authentication
router.use(authenticate);

// GET /api/invoice - Get all invoice data from lorry receipts
router.get('/', getInvoicesFromLorryReceipts);

// GET /api/invoice/:id/pdf - Generate Invoice PDF from a specific lorry receipt
router.get('/:id/pdf', generateInvoicePdf);

module.exports = router;
