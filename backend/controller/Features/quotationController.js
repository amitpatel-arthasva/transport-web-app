const Quotation = require('../../models/features/Quotations');
const User = require('../../models/User');
const pdfService = require('../../services/pdfService');
const { mapQuotationToPdfData } = require('../../utils/quotationPdfMapper');
const { getLogosAsBase64 } = require('../../utils/imageUtils');

// Cache logos once at module load to avoid repeated file reads
const CACHED_LOGOS = getLogosAsBase64();

// Pre-compiled HTML template function for better performance
const generateOptimizedQuotationHtml = (data) => {
  // Pre-compute commonly used values
  const hasValidityDate = data.validity.validUpTo || data.validity.expiryDate;
  const contactNumbersStr = data.contactNumbers.join(", ");
  
  // Generate address lines more efficiently
  const quoteToAddressLines = data.quoteToCompany.address.map(line => 
    `<div class="address-line">${line}</div>`
  ).join('');
  
  const tarapurAddressLines = data.tarapurAddress.map(line => 
    `<div>${line}</div>`
  ).join('');
  
  const bhiwandiAddressLines = data.bhiwandiAddress.map(line => 
    `<div>${line}</div>`
  ).join('');
  
  // Generate material details rows more efficiently
  const materialRows = data.materialDetails.map(item => 
    `<tr>
      <td class="text-center">${item.sr}</td>
      <td>${item.materialName}</td>
      <td>${item.packagingType}</td>
      <td>${item.weight}</td>
      <td class="text-center">${item.numberOfArticles}</td>
      <td>${item.dimensions}</td>
    </tr>`
  ).join('');
  
  // Generate vehicle details rows more efficiently
  const vehicleRows = data.vehicleDetails.map(item => 
    `<tr>
      <td class="text-center">${item.sr}</td>
      <td>${item.vehicleType}</td>
      <td>${item.weightGuarantee}</td>
      <td>${item.freightRate}</td>
      <td>${item.dimensions}</td>
      <td class="text-center">${item.numberOfTrucks}</td>
    </tr>`
  ).join('');
  
  // Generate freight breakdown rows more efficiently
  const freightRows = [
    data.freightBreakdown.loadingCharge > 0 ? `<tr><td>Loading Charge</td><td class="text-right">₹${data.freightBreakdown.loadingCharge.toFixed(2)}</td></tr>` : '',
    data.freightBreakdown.unloadingCharge > 0 ? `<tr><td>Unloading Charge</td><td class="text-right">₹${data.freightBreakdown.unloadingCharge.toFixed(2)}</td></tr>` : '',
    data.freightBreakdown.doorPickupCharge > 0 ? `<tr><td>Door Pickup Charge</td><td class="text-right">₹${data.freightBreakdown.doorPickupCharge.toFixed(2)}</td></tr>` : '',
    data.freightBreakdown.doorDeliveryCharge > 0 ? `<tr><td>Door Delivery Charge</td><td class="text-right">₹${data.freightBreakdown.doorDeliveryCharge.toFixed(2)}</td></tr>` : '',
    data.freightBreakdown.tollTax > 0 ? `<tr><td>Toll Tax</td><td class="text-right">₹${data.freightBreakdown.tollTax.toFixed(2)}</td></tr>` : '',
    data.freightBreakdown.otherCharges > 0 ? `<tr><td>Other Charges</td><td class="text-right">₹${data.freightBreakdown.otherCharges.toFixed(2)}</td></tr>` : ''
  ].filter(Boolean).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quotation #${data.quotationNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      font-size: 12px;
      background: white;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #000;
      background: white;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #000;
      padding: 10px;
    }
    .header-left {
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }            
    .logo-box {
      width: 400px;
      height: 76px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      font-size: 8px;
    }
    .logo-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: left;
    }
    .footer-logo {
      width: 80px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .footer-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: right;
    }
    .header-right {
      text-align: right;
      font-size: 10px;
    }
    .quote-title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      padding: 10px;
      border-bottom: 2px solid #000;
      background-color: #f5f5f5;
    }
    .main-content {
      padding: 15px;
    }
    .quote-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .quote-to-section {
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 15px;
    }
    .section-title {
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 2px;
    }
    .address-line {
      margin: 2px 0;
      min-height: 16px;
    }
    .trip-details {
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 15px;
    }
    .trip-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .material-table,
    .vehicle-table,
    .freight-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #000;
      margin-bottom: 15px;
    }
    .material-table th,
    .material-table td,
    .vehicle-table th,
    .vehicle-table td,
    .freight-table th,
    .freight-table td {
      border: 1px solid #000;
      padding: 6px;
      text-align: left;
      font-size: 10px;
    }
    .material-table th,
    .vehicle-table th,
    .freight-table th {
      background-color: #f5f5f5;
      font-weight: bold;
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .payment-terms {
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 15px;
    }
    .terms-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .validity-section {
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 15px;
    }
    .footer-section {
      display: flex;
      justify-content: space-between;
      border-top: 2px solid #000;
      padding: 10px;
      font-size: 9px;
    }
    .office-addresses {
      display: flex;
      gap: 20px;
    }
    .office-box {
      border: 1px solid #000;
      padding: 5px;
      font-size: 8px;
    }
    .office-title {
      font-weight: bold;
      margin-bottom: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->            
    <div class="header">
      <div class="header-left">
        <div class="logo-box">
          ${CACHED_LOGOS.lorryReceiptHeader ? `<img src="${CACHED_LOGOS.lorryReceiptHeader}" alt="logo" />` : 'logo'}
        </div>
      </div>
      <div class="header-right">
        <div><strong>Contact:</strong> ${contactNumbersStr}</div>
        <div><strong>Email:</strong> ${data.emailId}</div>
        <div><strong>Date:</strong> ${data.quotationDate}</div>
      </div>
    </div>

    <!-- Quote Title -->
    <div class="quote-title">FREIGHT QUOTATION</div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Quote Info -->
      <div class="quote-info">
        <div><strong>Quotation No:</strong> ${data.quotationNumber}</div>
        <div><strong>Valid Until:</strong> ${hasValidityDate}</div>
      </div>

      <!-- Quote To Section -->
      <div class="quote-to-section">
        <div class="section-title">Quote To:</div>
        <div><strong>M/s ${data.quoteToCompany.name}</strong></div>
        ${quoteToAddressLines}
        <div class="address-line"><strong>GST:</strong> ${data.quoteToCompany.gstNumber || 'N/A'}</div>
        <div class="address-line"><strong>Contact:</strong> ${data.quoteToCompany.contactNumber || 'N/A'}</div>
        ${data.quoteToCompany.inquiryVia ? `<div class="address-line"><strong>Inquiry Via:</strong> ${data.quoteToCompany.inquiryVia}</div>` : ''}
        ${data.quoteToCompany.inquiryByPerson ? `<div class="address-line"><strong>Contact Person:</strong> ${data.quoteToCompany.inquiryByPerson}</div>` : ''}
        ${data.quoteToCompany.referenceDocumentId ? `<div class="address-line"><strong>Reference:</strong> ${data.quoteToCompany.referenceDocumentId}</div>` : ''}
      </div>

      <!-- Trip Details -->
      <div class="trip-details">
        <div class="section-title">Trip Details</div>
        <div class="trip-grid">
          <div><strong>Load Type:</strong> ${data.tripDetails.fullOrPartLoad || 'N/A'}</div>
          <div><strong>Trip Type:</strong> ${data.tripDetails.tripType || 'N/A'}</div>
          <div><strong>From:</strong> ${data.tripDetails.from || 'N/A'}</div>
          <div><strong>To:</strong> ${data.tripDetails.to || 'N/A'}</div>
          ${data.tripDetails.pickupPoints ? `<div><strong>Pickup Points:</strong> ${data.tripDetails.pickupPoints}</div>` : ''}
          ${data.tripDetails.deliveryPoints ? `<div><strong>Delivery Points:</strong> ${data.tripDetails.deliveryPoints}</div>` : ''}
          ${data.tripDetails.loadingDate ? `<div><strong>Loading Date:</strong> ${data.tripDetails.loadingDate}</div>` : ''}
        </div>
      </div>

      <!-- Material Details Table -->
      <table class="material-table">
        <thead>
          <tr>
            <th style="width: 40px;">Sr.</th>
            <th>Material Name</th>
            <th>Packaging</th>
            <th>Weight</th>
            <th>No. of Articles</th>
            <th>Dimensions</th>
          </tr>
        </thead>
        <tbody>
          ${materialRows}
        </tbody>
      </table>

      <!-- Vehicle Details Table -->
      <table class="vehicle-table">
        <thead>
          <tr>
            <th style="width: 40px;">Sr.</th>
            <th>Vehicle Type</th>
            <th>Weight Guarantee</th>
            <th>Freight Rate</th>
            <th>Dimensions</th>
            <th>No. of Trucks</th>
          </tr>
        </thead>
        <tbody>
          ${vehicleRows}
        </tbody>
      </table>

      <!-- Freight Breakdown Table -->
      <table class="freight-table">
        <thead>
          <tr>
            <th colspan="2">Freight Breakdown</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Base Freight (${data.freightBreakdown.rateType})</strong></td>
            <td class="text-right"><strong>₹${data.freightBreakdown.baseRate.toFixed(2)}</strong></td>
          </tr>
          ${freightRows}
          <tr style="border-top: 2px solid #000;">
            <td><strong>Subtotal</strong></td>
            <td class="text-right"><strong>₹${data.freightBreakdown.subtotal.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td>GST (${data.freightBreakdown.gstRate})</td>
            <td class="text-right">₹${data.freightBreakdown.gstAmount.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 2px solid #000; background-color: #f5f5f5;">
            <td><strong>Total Amount</strong></td>
            <td class="text-right"><strong>₹${data.freightBreakdown.totalWithGst.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- Payment Terms -->
      <div class="payment-terms">
        <div class="section-title">Payment Terms</div>
        <div class="terms-grid">
          <div><strong>Payment By:</strong> ${data.paymentTerms.payBy}</div>
          <div><strong>Driver Cash Required:</strong> ₹${data.paymentTerms.driverCashRequired}</div>
          ${data.paymentTerms.advancePaid ? `<div><strong>Advance:</strong> ${data.paymentTerms.advancePaid}</div>` : ''}
          ${data.paymentTerms.afterLoading ? `<div><strong>After Loading:</strong> ${data.paymentTerms.afterLoading}</div>` : ''}
          ${data.paymentTerms.afterDelivery ? `<div><strong>After Delivery:</strong> ${data.paymentTerms.afterDelivery}</div>` : ''}
          ${data.paymentTerms.afterPOD ? `<div><strong>After POD:</strong> ${data.paymentTerms.afterPOD}</div>` : ''}
        </div>
        ${data.paymentTerms.paymentRemark ? `<div style="margin-top: 8px;"><strong>Remark:</strong> ${data.paymentTerms.paymentRemark}</div>` : ''}
      </div>

      <!-- Demurrage -->
      ${data.demurrage.chargePerHour > 0 ? `
      <div class="validity-section">
        <div class="section-title">Demurrage</div>
        <div><strong>Charge:</strong> ₹${data.demurrage.chargePerHour} ${data.demurrage.chargeType}</div>
        <div><strong>Applicable After:</strong> ${data.demurrage.applicableAfterHours} hours</div>
      </div>` : ''}

      <!-- Validity -->
      <div class="validity-section">
        <div class="section-title">Terms & Conditions</div>
        <div><strong>Quotation Valid:</strong> ${hasValidityDate}</div>
        <div style="margin-top: 8px; font-size: 10px;">${data.disclaimer}</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <div>
        <div style="margin-bottom: 10px;"><strong>Office Addresses:</strong></div>
        <div class="office-addresses">
          <div class="office-box">
            <div class="office-title">TARAPUR</div>
            ${tarapurAddressLines}
          </div>
          <div class="office-box">
            <div class="office-title">BHIWANDI</div>
            ${bhiwandiAddressLines}
          </div>
        </div>
        <div style="margin-top: 10px;">
          <div><strong>PAN:</strong> ${data.panNo} | <strong>GSTIN:</strong> ${data.gstin}</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="margin-bottom: 10px;"><strong>For Shree Dattaguru Road Lines</strong></div>
        <div style="margin-top: 50px; border-top: 1px solid #000; padding-top: 5px;">Authorized Signatory</div>
        <div class="footer-logo">
          ${CACHED_LOGOS.footer ? `<img src="${CACHED_LOGOS.footer}" alt="footer" />` : 'footer'}
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

const createQuotation = async (req, res) => {
  try {
    const {
      quoteToCompany,
      materialDetails,
      tripDetails,
      vehicleDetails,
      freightBreakup,
      paymentTerms,
      quotationValidity,
      demurrage
    } = req.body;

    // Validate required fields
    if (!quoteToCompany || !materialDetails || !tripDetails) {
      return res.status(400).json({
        success: false,
        message: 'Quote to company, material details, and trip details are required'
      });
    }

    // Create new quotation
    const quotation = new Quotation({
      createdBy: req.user.id, // From authenticate middleware
      quoteToCompany,
      materialDetails,
      tripDetails,
      vehicleDetails: vehicleDetails || [],
      freightBreakup: freightBreakup || {},
      paymentTerms: paymentTerms || {},
      quotationValidity: quotationValidity || {},
      demurrage: demurrage || {}
    });

    // Calculate expiry date if validity is provided
    if (quotationValidity && quotationValidity.validUpTo) {
      if (quotationValidity.validUpTo.type === 'Date') {
        quotation.quotationValidity.expiryDate = quotationValidity.validUpTo.value;
      } else if (quotationValidity.validUpTo.type === 'Days') {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + quotationValidity.validUpTo.value);
        quotation.quotationValidity.expiryDate = expiryDate;
      }
    }

    // Calculate total extra charges if provided
    if (freightBreakup && freightBreakup.extraCharges) {
      const charges = freightBreakup.extraCharges;
      quotation.freightBreakup.extraCharges.totalExtraCharges = 
        (charges.loadingCharge || 0) +
        (charges.unloadingCharge || 0) +
        (charges.doorPickupCharge || 0) +
        (charges.doorDeliveryCharge || 0) +
        (charges.packingCharge || 0) +
        (charges.unpackingCharge || 0) +
        (charges.cashOnDelivery || 0) +
        (charges.deliveryOnDateCharge || 0) +
        (charges.tollTax || 0) +
        (charges.odcCharge || 0) +
        (charges.otherCharges || 0);
    }

    await quotation.save();

    return res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      data: {
        quotation
      }
    });

  } catch (error) {
    console.error('Error creating quotation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create quotation',
      error: error.message
    });
  }
};

const getQuotations = async (req, res) => {
  try {
    const { page = 1, limit = 10, companyName, status } = req.query;
    
    // Build query object
    const query = { createdBy: req.user.id };
    
    if (companyName) {
      query['quoteToCompany.companyName'] = { $regex: companyName, $options: 'i' };
    }

    const quotations = await Quotation.find(query)
      .populate('createdBy', 'name email')
      .populate('quoteToCompany.companyId', 'companyName gstNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quotation.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Quotations retrieved successfully',
      data: {
        quotations,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Error retrieving quotations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quotations',
      error: error.message
    });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findOne({ 
      _id: id, 
      createdBy: req.user.id
    })
    .populate('createdBy', 'name email')
    .populate('quoteToCompany.companyId', 'companyName gstNumber contactNumber address');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation retrieved successfully',
      data: {
        quotation
      }
    });

  } catch (error) {
    console.error('Error retrieving quotation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quotation',
      error: error.message
    });
  }
};

const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find quotation and ensure it belongs to the authenticated user
    const quotation = await Quotation.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Update quotation fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        quotation[key] = updateData[key];
      }
    });

    // Recalculate expiry date if validity is updated
    if (updateData.quotationValidity && updateData.quotationValidity.validUpTo) {
      if (updateData.quotationValidity.validUpTo.type === 'Date') {
        quotation.quotationValidity.expiryDate = updateData.quotationValidity.validUpTo.value;
      } else if (updateData.quotationValidity.validUpTo.type === 'Days') {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + updateData.quotationValidity.validUpTo.value);
        quotation.quotationValidity.expiryDate = expiryDate;
      }
    }

    await quotation.save();

    return res.status(200).json({
      success: true,
      message: 'Quotation updated successfully',
      data: {
        quotation
      }
    });

  } catch (error) {
    console.error('Error updating quotation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update quotation',
      error: error.message
    });
  }
};

const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findOneAndDelete({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting quotation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete quotation',
      error: error.message
    });  }
};

const generateQuotationPdf = async (req, res) => {
  try {
    const { id } = req.params;

    // Find quotation and ensure it belongs to the authenticated user
    const quotation = await Quotation.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    })
    .populate('createdBy', 'name email')
    .populate('quoteToCompany.companyId', 'companyName gstNumber contactNumber address');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Convert to plain object and map to PDF format (optimized)
    const quotationData = quotation.toObject();
    const pdfData = mapQuotationToPdfData(quotationData);
    
    // Generate consistent filename format using actual quotation number
    const quotationNumber = quotation.quotationNumber || `Q-${quotation._id.toString().slice(-6).toUpperCase()}`;
    const filename = `Quotation-${quotationNumber}`;

    // Generate PDF using the optimized template and service
    const pdfBuffer = await pdfService.generatePdfFromTemplate(generateOptimizedQuotationHtml, pdfData, {
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
    console.error('Error generating quotation PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate quotation PDF',
      error: error.message
    });
  }
};

module.exports = {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  generateQuotationPdf
};
