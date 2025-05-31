const LorryReceipt = require('../../models/features/LorryReceipt');
const pdfService = require('../../services/pdfService');
const { mapLorryReceiptToInvoiceData } = require('../../utils/invoicePdfMapper');
const { getLogosAsBase64 } = require('../../utils/imageUtils');

// Cache logos once at module load to avoid repeated file reads
const CACHED_LOGOS = getLogosAsBase64();

// Pre-compiled optimized HTML template function to avoid repeated template generation
const generateOptimizedInvoiceHtml = (data) => {
  // Pre-compute commonly used values
  const contactNumbersStr = data.contactNumbers.join(", ");
  const serviceDetailsHtml = data.serviceDetails.map(detail => `<div>${detail}</div>`).join('');
  
  // Pre-generate address lines efficiently
  const addressLines = data.recipient.address.map(line => `<div class="address-line">${line}</div>`).join('');
  const emptyAddressLines = data.recipient.address.length < 3 ? 
    Array(3 - data.recipient.address.length).fill('<div class="address-line">&nbsp;</div>').join('') : '';
  
  // Pre-generate goods table rows efficiently
  const goodsRowsHtml = data.goodsDetails.map(item => `
    <tr>
      <td class="text-center">${item.sr}</td>
      <td>${item.lrNo}</td>
      <td style="border-right: 1px solid #9ca3af;">${item.from}</td>
      <td>${item.to}</td>
      <td>${item.invNo}</td>
      <td class="text-right">${item.rate.toFixed(2)}</td>
      <td class="text-right">${item.otherCharges.toFixed(2)}</td>
      <td class="text-right">${item.freightAmt.toFixed(2)}</td>
    </tr>
  `).join('');
  
  // Pre-generate empty rows if needed
  const emptyRowsHtml = data.goodsDetails.length < 10 ? 
    Array(10 - data.goodsDetails.length).fill(`
      <tr style="height: 32px;">
        <td></td><td></td><td style="border-right: 1px solid #9ca3af;"></td>
        <td></td><td></td><td></td><td></td><td></td>
      </tr>
    `).join('') : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Freight Bill #${data.billNo}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; font-size: 12px; background: white; }
    .container { max-width: 800px; margin: 0 auto; background: white; border: 2px solid #333; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #374151; padding-bottom: 8px; margin-bottom: 8px; }
    .header-left { display: flex; align-items: flex-start; gap: 16px; }
    .logo-box { width: 400px; height: 90px; display: flex; align-items: flex-start; justify-content: flex-start; font-size: 8px; }
    .logo-box img { width: 100%; height: 100%; object-fit: contain; object-position: left; }
    .footer-logo { width: 100px; height: 64px; display: flex; align-items: center; justify-content: flex-end; margin-top: 8px; }
    .footer-logo img { width: 100%; height: 100%; object-fit: contain; object-position: right; }
    .company-info h1 { margin: 0; font-size: 24px; font-weight: bold; color: #1e40af; }
    .company-tagline { font-size: 18px; font-weight: 600; border-bottom: 1px solid #374151; color: #1e40af; padding-bottom: 2px; }
    .header-right { text-align: right; font-size: 12px; }
    .bill-title { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; }
    .bill-title-left { font-weight: bold; font-size: 18px; }
    .company-address { font-size: 12px; }
    .bill-details { display: flex; border: 2px solid #374151; margin-bottom: 0; }
    .to-section { border-right: 2px solid #374151; padding: 8px; flex: 1; }
    .bill-info { padding: 8px; width: 256px; }
    .address-line { border-bottom: 1px solid #9ca3af; margin: 4px 0; min-height: 16px; padding: 2px 0; }
    .main-table { width: 100%; border-collapse: collapse; border-left: 2px solid #374151; border-right: 2px solid #374151; }
    .main-table th, .main-table td { border: 1px solid #374151; padding: 4px; text-align: left; font-size: 12px; }
    .main-table th { border-top: 2px solid #374151; border-bottom: 2px solid #374151; background-color: #f5f5f5; font-weight: bold; text-align: center; }
    .particulars-header { text-align: center; }
    .particulars-subheader { display: flex; border-top: 1px solid #374151; margin-top: 4px; }
    .particulars-subheader > div { flex: 1; text-align: center; padding: 2px; }
    .particulars-subheader > div:first-child { border-right: 1px solid #9ca3af; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .total-section { display: flex; border-left: 2px solid #374151; border-right: 2px solid #374151; border-bottom: 2px solid #374151; }
    .amount-section { flex: 1; padding: 8px; border-right: 2px solid #374151; }
    .amount-line { display: flex; align-items: center; }
    .amount-fill { border-bottom: 1px solid #9ca3af; flex: 1; margin-left: 8px; min-height: 16px; }
    .total-amount { width: 96px; padding: 8px; }
    .remark-section { border-left: 2px solid #374151; border-right: 2px solid #374151; border-bottom: 2px solid #374151; padding: 8px; }
    .remark-line { display: flex; align-items: center; }
    .remark-fill { border-bottom: 1px solid #9ca3af; flex: 1; margin-left: 8px; min-height: 16px; }
    .footer { display: flex; justify-content: space-between; font-size: 12px; margin-top: 4px; }
    .footer-left { flex: 1; }
    .service-tax-table { width: 192px; border: 2px solid #374151; border-collapse: collapse; margin: 0 16px; }
    .service-tax-table td { border: 1px solid #374151; padding: 4px; text-align: center; font-size: 12px; }
    .footer-right { flex: 1; text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
    .signature-space { margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="logo-box">
          ${CACHED_LOGOS.invoiceHeader ? `<img src="${CACHED_LOGOS.invoiceHeader}" alt="logo" />` : 'logo'}
        </div>
      </div>
      <div class="header-right">
        <div>Mob.: ${contactNumbersStr}</div>
        ${serviceDetailsHtml}
      </div>
    </div>
    <div class="bill-title">
      <div class="bill-title-left">FREIGHT BILL</div>
      <div class="company-address">${data.companyAddress}</div>
    </div>
    <div class="bill-details">
      <div class="to-section">
        <div style="font-weight: 600;">To,</div>
        <div>M/s ${data.recipient.name}</div>
        ${addressLines}
        ${emptyAddressLines}
      </div>
      <div class="bill-info">
        <div style="display: flex; justify-content: space-between;">
          <div style="font-weight: 600;">Bill No.:</div>
          <div>${data.billNo}</div>
        </div>
        <div style="font-weight: 600;">${data.location}</div>
        <div style="display: flex; justify-content: space-between; margin-top: 16px;">
          <div style="font-weight: 600;">Date:</div>
          <div style="border-bottom: 1px solid #9ca3af; flex: 1; margin-left: 8px;">${data.date}</div>
        </div>
      </div>
    </div>
    <table class="main-table">
      <thead>
        <tr>
          <th style="width: 40px;">Sr.</th>
          <th style="width: 80px;">L.R. No.</th>
          <th colspan="2" class="particulars-header">
            <div>Particulars of Goods Transported</div>
            <div class="particulars-subheader">
              <div>From</div><div>To</div>
            </div>
          </th>
          <th style="width: 80px;">Inv. No.</th>
          <th style="width: 64px;">Rate</th>
          <th style="width: 64px;">Other Charges</th>
          <th style="width: 96px;">Freight Amt.</th>
        </tr>
      </thead>
      <tbody>
        ${goodsRowsHtml}
        ${emptyRowsHtml}
      </tbody>
    </table>
    <div class="total-section">
      <div class="amount-section">
        <div class="amount-line">
          <div style="font-weight: 600;">Amount Rs.</div>
          <div class="amount-fill"></div>
        </div>
      </div>
      <div class="total-amount">
        <div style="font-weight: 600;">TOTAL</div>
        <div class="text-right" style="font-weight: bold;">${data.totalAmount.toFixed(2)}</div>
      </div>
    </div>
    <div class="remark-section">
      <div class="remark-line">
        <div style="font-weight: 600;">Remark:</div>
        <div class="remark-fill">${data.remark}</div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">
        <div>PAN No. ${data.panNo}</div>
        <div>GSTIN: ${data.gstin}</div>
      </div>
      <table class="service-tax-table">
        <tr>
          <td style="border-right: 1px solid #374151; border-bottom: 1px solid #374151;">Service Tax</td>
          <td style="border-bottom: 1px solid #374151;">Consignor</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #374151;">Payable by</td>
          <td>Consignee</td>
        </tr>
      </table>
      <div class="footer-right">
        <div>E. & O. E.</div>
        <div class="footer-logo">
          ${CACHED_LOGOS.footer ? `<img src="${CACHED_LOGOS.footer}" alt="footer" />` : 'footer'}
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

const generateInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;

    // Find lorry receipt and ensure it belongs to the authenticated user
    const lorryReceipt = await LorryReceipt.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    })
    .populate('createdBy', 'name email')
    .populate('consignor.consignorId', 'companyName gstNumber contactNumber address')
    .populate('consignee.consigneeId', 'companyName gstNumber contactNumber address');

    if (!lorryReceipt) {
      return res.status(404).json({
        success: false,
        message: 'Lorry receipt not found'
      });
    }

    // Convert to plain object and map to Invoice PDF format
    const lorryReceiptData = lorryReceipt.toObject();
    const invoiceData = mapLorryReceiptToInvoiceData(lorryReceiptData);    
    // Generate consistent filename format using actual LR number for invoice
    const lrNumber = lorryReceipt.lorryReceiptNumber || `LR-${lorryReceipt._id.toString().slice(-6).toUpperCase()}`;
    const invoiceNumber = `INV-${lrNumber}`;
    const filename = `Invoice-${invoiceNumber}`;

    // Generate PDF using the optimized template and pdfService with performance settings
    const pdfBuffer = await pdfService.generatePdfFromTemplate(generateOptimizedInvoiceHtml, invoiceData, {
      filename: filename,
      pdfOptions: {
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
        preferCSSPageSize: false // Performance optimization
      }
    });

    // Set headers and send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate invoice PDF',
      error: error.message
    });
  }
};

const getInvoicesFromLorryReceipts = async (req, res) => {
  try {
    const { page = 1, limit = 10, consignorName, consigneeName, truckNumber, dateFrom, dateTo } = req.query;
    
    // Build query object for lorry receipts that can be used for invoices
    const query = { createdBy: req.user.id };
    
    // Handle multi-field search (like in LorryReceipts)
    if (consignorName || consigneeName || truckNumber) {
      const searchConditions = [];
      
      if (consignorName) {
        searchConditions.push({ 'consignor.consignorName': { $regex: consignorName, $options: 'i' } });
      }
      
      if (consigneeName) {
        searchConditions.push({ 'consignee.consigneeName': { $regex: consigneeName, $options: 'i' } });
      }
      
      if (truckNumber) {
        searchConditions.push({ 'truckDetails.truckNumber': { $regex: truckNumber, $options: 'i' } });
      }
      
      // Use $or to search across multiple fields with the same search term
      if (searchConditions.length > 0) {
        query.$or = searchConditions;
      }
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const lorryReceipts = await LorryReceipt.find(query)
      .populate('createdBy', 'name email')
      .populate('consignor.consignorId', 'companyName gstNumber')
      .populate('consignee.consigneeId', 'companyName gstNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LorryReceipt.countDocuments(query);    // Transform lorry receipts to invoice format for listing
    const invoiceData = lorryReceipts.map(lr => {
      // Calculate totalAmount properly using the same logic as the LorryReceipt model
      let totalAmount = 0;
      
      if (lr.freightDetails) {
        // Use totalFreight if it exists (calculated by pre-save middleware)
        if (lr.freightDetails.totalFreight) {
          totalAmount = lr.freightDetails.totalFreight;
        } else {
          // Fallback: calculate manually using the same logic as the model
          const charges = lr.freightDetails.charges || {};
          const subTotal = (lr.freightDetails.totalBasicFreight || 0) + 
            (charges.pickupCharge || 0) + (charges.doorDeliveryCharge || 0) + 
            (charges.loadingCharge || 0) + (charges.unloadingCharge || 0) + 
            (charges.packingCharge || 0) + (charges.unpackingCharge || 0) + 
            (charges.serviceCharge || 0) + (charges.cashOnDelivery || 0) + 
            (charges.dateOnDelivery || 0) + (charges.otherCharges || 0);
          
          totalAmount = subTotal + 
            (lr.freightDetails.gstDetails?.gstAmount || 0) + 
            (lr.freightDetails.roundOff || 0) - 
            (lr.freightDetails.tdsDetails?.tdsAmount || 0);
        }
      }

      return {
        id: lr._id,
        invoiceNumber: `INV-${lr.lorryReceiptNumber}`,
        lorryReceiptNumber: lr.lorryReceiptNumber,
        date: lr.date,
        consignor: lr.consignor,
        consignee: lr.consignee,
        truckNumber: lr.truckDetails?.truckNumber || '', // Add truck number for display
        totalAmount: Math.max(0, totalAmount), // Ensure non-negative amount
        status: lr.status || 'pending',
        createdAt: lr.createdAt
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Invoice data retrieved successfully',
      data: {
        invoices: invoiceData,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Error retrieving invoice data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve invoice data',
      error: error.message
    });
  }
};

module.exports = {
  generateInvoicePdf,
  getInvoicesFromLorryReceipts
};
