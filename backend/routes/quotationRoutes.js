const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  generateQuotationPdf
} = require('../controller/Features/quotationController');

// All quotation routes require authentication
router.use(authenticate);

// POST /api/quotation/create-quotation - Create a new quotation
router.post('/create-quotation', createQuotation);

// GET /api/quotation - Get all quotations for the authenticated user
router.get('/', getQuotations);

// GET /api/quotation/:id - Get a specific quotation by ID
router.get('/:id', getQuotationById);

// PUT /api/quotation/:id - Update a specific quotation
router.put('/:id', updateQuotation);

// DELETE /api/quotation/:id - Delete a specific quotation
router.delete('/:id', deleteQuotation);

// GET /api/quotation/:id/generate-pdf - Generate PDF for a specific quotation
router.get('/:id/generate-pdf', generateQuotationPdf);

module.exports = router;
