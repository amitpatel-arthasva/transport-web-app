const LorryReceipt = require('../../models/features/LorryReceipt');
const pdfService = require('../../services/pdfService');
const { mapLorryReceiptToPdfData } = require('../../utils/lorryReceiptPdfMapper');
const { getLogosAsBase64 } = require('../../utils/imageUtils');

const createLorryReceipt = async (req, res) => {
  try {
    const {
      lorryReceiptNumber,
      date,
      consignor,
      loadingAddress,
      consignee,
      deliveryDetails,
      invoiceAndEwayDetails,
      materialDetails,
      truckDetails,
      freightDetails,
      remarks
    } = req.body;

    // Validate required fields
    if (!lorryReceiptNumber || !consignor || !consignee || !materialDetails || !truckDetails) {
      return res.status(400).json({
        success: false,
        message: 'Lorry receipt number, consignor, consignee, material details, and truck details are required'
      });
    }    // Create new lorry receipt
    const lorryReceipt = new LorryReceipt({
      lorryReceiptNumber,
      date: date || new Date(),
      consignor,
      loadingAddress: loadingAddress || {},
      consignee,
      deliveryDetails: deliveryDetails || {},
      invoiceAndEwayDetails: invoiceAndEwayDetails || {},
      materialDetails,
      truckDetails,
      freightDetails: freightDetails || {},
      remarks: remarks || '',
      createdBy: req.user.id
    });

    await lorryReceipt.save();

    return res.status(201).json({
      success: true,
      message: 'Lorry receipt created successfully',
      data: {
        lorryReceipt
      }
    });

  } catch (error) {
    console.error('Error creating lorry receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create lorry receipt',
      error: error.message
    });
  }
};

const getLorryReceipts = async (req, res) => {
  try {
    const { page = 1, limit = 10, consignorName, consigneeName, truckNumber, status } = req.query;
    
    // Build query object
    const query = { createdBy: req.user.id };
    
    if (consignorName) {
      query['consignor.consignorName'] = { $regex: consignorName, $options: 'i' };
    }
    
    if (consigneeName) {
      query['consignee.consigneeName'] = { $regex: consigneeName, $options: 'i' };
    }
    
    if (truckNumber) {
      query['truckDetails.truckNumber'] = { $regex: truckNumber, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }

    const lorryReceipts = await LorryReceipt.find(query)
      .populate('createdBy', 'name email')
      .populate('consignor.consignorId', 'companyName gstNumber')
      .populate('consignee.consigneeId', 'companyName gstNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LorryReceipt.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Lorry receipts retrieved successfully',
      data: {
        lorryReceipts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Error retrieving lorry receipts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lorry receipts',
      error: error.message
    });
  }
};

const getLorryReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

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

    return res.status(200).json({
      success: true,
      message: 'Lorry receipt retrieved successfully',
      data: {
        lorryReceipt
      }
    });

  } catch (error) {
    console.error('Error retrieving lorry receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lorry receipt',
      error: error.message
    });
  }
};

const updateLorryReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find lorry receipt and ensure it belongs to the authenticated user
    const lorryReceipt = await LorryReceipt.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!lorryReceipt) {
      return res.status(404).json({
        success: false,
        message: 'Lorry receipt not found'
      });
    }

    // Update lorry receipt fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        lorryReceipt[key] = updateData[key];
      }
    });

    await lorryReceipt.save();

    return res.status(200).json({
      success: true,
      message: 'Lorry receipt updated successfully',
      data: {
        lorryReceipt
      }
    });

  } catch (error) {
    console.error('Error updating lorry receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lorry receipt',
      error: error.message
    });
  }
};

const deleteLorryReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const lorryReceipt = await LorryReceipt.findOneAndDelete({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!lorryReceipt) {
      return res.status(404).json({
        success: false,
        message: 'Lorry receipt not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lorry receipt deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting lorry receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lorry receipt',
      error: error.message
    });
  }
};

const generateLorryReceiptPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { templateType = 'default' } = req.query;

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
    }    // Convert to plain object and map to PDF format
    const lorryReceiptData = lorryReceipt.toObject();
    const pdfData = mapLorryReceiptToPdfData(lorryReceiptData);
    
    // Get logos as base64 for embedding in PDF
    const logos = getLogosAsBase64();
    
    // Create HTML template that matches LRtemp.jsx format
    const generateLorryReceiptHtml = (data) => {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lorry Receipt #${data.cntNo}</title>
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
              align-items: center;
              gap: 15px;
            }            .logo-box {
              width: 80px;
              height: 64px;
              border: 1px solid #000;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
              overflow: hidden;
            }
            .logo-box img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .company-info h1 {
              margin: 0;
              font-size: 20px;
              font-weight: bold;
            }
            .company-tagline {
              font-size: 16px;
              font-weight: 600;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
            }
            .header-right {
              text-align: right;
              font-size: 10px;
            }
            .copy-type {
              font-weight: bold;
              margin-top: 5px;
            }
            .main-content {
              display: flex;
              gap: 0;
            }
            .left-column {
              width: 280px;
              border-right: 2px solid #000;
              padding: 10px;
            }
            .right-column {
              flex: 1;
              padding: 10px;
            }
            .section-box {
              border: 2px solid #000;
              margin-bottom: 10px;
              padding: 8px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .address-line {
              border-bottom: 1px solid #ccc;
              min-height: 16px;
              padding: 2px 0;
            }
            .office-box {
              border: 1px solid #000;
              padding: 5px;
              margin-bottom: 5px;
              font-size: 9px;
            }
            .office-title {
              font-weight: bold;
              margin-bottom: 3px;
            }
            .cn-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 5px;
              margin-bottom: 10px;
            }
            .cn-box {
              border: 2px solid #000;
              padding: 8px;
              font-weight: bold;
              font-size: 11px;
            }
            .main-table {
              width: 100%;
              border-collapse: collapse;
              border: 2px solid #000;
              margin-bottom: 10px;
            }
            .main-table th,
            .main-table td {
              border: 1px solid #000;
              padding: 4px;
              text-align: left;
              font-size: 10px;
            }
            .main-table th {
              background-color: #f5f5f5;
              font-weight: bold;
              text-align: center;
            }
            .weight-header {
              position: relative;
            }
            .weight-subheader {
              display: flex;
              border-top: 1px solid #000;
              margin-top: 5px;
            }
            .weight-subheader > div {
              flex: 1;
              text-align: center;
              padding: 2px;
              border-left: 1px solid #000;
            }
            .weight-subheader > div:first-child {
              border-left: none;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .bottom-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 5px;
              margin-bottom: 10px;
            }
            .service-tax-table {
              width: 100%;
              border-collapse: collapse;
              border: 2px solid #000;
            }
            .service-tax-table td {
              border: 1px solid #000;
              padding: 5px;
              text-align: center;
              font-size: 10px;
            }
            .invoice-box {
              border: 2px solid #000;
              padding: 8px;
              font-size: 10px;
            }
            .delivery-remarks {
              margin-bottom: 10px;
            }
            .delivery-box,
            .remarks-box {
              border: 2px solid #000;
              padding: 8px;
              margin-bottom: 5px;
            }
            .footer {
              border-top: 2px solid #000;
              padding: 8px;
              display: flex;
              justify-content: space-between;
              font-size: 9px;
            }
            .footer-right {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->            <div class="header">
              <div class="header-left">
                <div class="logo-box">
                  ${logos.truckLogo ? `<img src="${logos.truckLogo}" alt="Truck Logo" />` : 'Truck Logo'}
                </div>
                <div class="company-info">
                  <h1>${data.companyName}</h1>
                  <div class="company-tagline">${data.companyTagline}</div>
                </div>
              </div>
              <div class="header-right">
                <div>${data.jurisdiction}</div>
                ${data.serviceAreas.map(area => `<div>${area}</div>`).join('')}
                <div class="copy-type">${data.copyType}</div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="main-content">
              <!-- Left Column -->
              <div class="left-column">
                <!-- Consignor -->
                <div class="section-box">
                  <div class="section-title">Consignor - M/s</div>
                  <div>${data.consignor.name}</div>
                  ${data.consignor.address.map(line => `<div class="address-line">${line}</div>`).join('')}
                  <div class="address-line">GST: ${data.consignor.gstNumber || ''}</div>
                  <div class="address-line">Ph: ${data.consignor.contactNumber || ''}</div>
                </div>

                <!-- Consignee -->
                <div class="section-box">
                  <div class="section-title">Consignee - M/s</div>
                  <div>${data.consignee.name}</div>
                  ${data.consignee.address.map(line => `<div class="address-line">${line}</div>`).join('')}
                  <div class="address-line">GST: ${data.consignee.gstNumber || ''}</div>
                  <div class="address-line">Ph: ${data.consignee.contactNumber || ''}</div>
                </div>

                <!-- Office Addresses -->
                <div class="office-box">
                  <div class="office-title">TARAPUR</div>
                  ${data.tarapurAddress.map(line => `<div>${line}</div>`).join('')}
                </div>

                <div class="office-box">
                  <div class="office-title">BHIWANDI</div>
                  ${data.bhiwandiAddress.map(line => `<div>${line}</div>`).join('')}
                </div>

                <!-- Tax Info -->
                <div style="font-size: 9px; margin-top: 10px;">
                  <div>PAN : ${data.panNo}</div>
                  <div>GSTIN : ${data.gstin}</div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="right-column">
                <!-- CN Details -->
                <div class="cn-details">
                  <div class="cn-box">CN't No. - ${data.cntNo}</div>
                  <div class="cn-box">
                    Date - ${data.date}<br>
                    Truck No.: ${data.truckNo}
                  </div>
                  <div class="cn-box">From - ${data.from}</div>
                  <div class="cn-box">To - ${data.to}</div>
                </div>

                <!-- Main Table -->
                <table class="main-table">
                  <thead>
                    <tr>
                      <th style="width: 60px;">Nos.</th>
                      <th>Particulars</th>
                      <th style="width: 80px;">Rate Rs.</th>
                      <th style="width: 100px;" class="weight-header">
                        Weight
                        <div class="weight-subheader">
                          <div>Actual</div>
                          <div>Kg.</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.goodsDetails.map(item => `
                      <tr>
                        <td class="text-center">${item.nos}</td>
                        <td>${item.particulars}</td>
                        <td class="text-right">${item.rateRs}</td>
                        <td class="text-right">${item.actualWeight}</td>
                      </tr>
                    `).join('')}
                    <tr>
                      <td></td>
                      <td>Freight</td>
                      <td class="text-right">${data.charges.freight}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Hamali</td>
                      <td class="text-right">${data.charges.hamali}</td>
                      <td class="text-center">Chargeable</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>A. O. C.</td>
                      <td class="text-right">${data.charges.aoc}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Door Dely.</td>
                      <td class="text-right">${data.charges.doorDelivery}</td>
                      <td class="text-center">Paid</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Collection</td>
                      <td class="text-right">${data.charges.collection}</td>
                      <td class="text-center">To Be Bill</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>St. Charge</td>
                      <td class="text-right">${data.charges.stCharge}</td>
                      <td class="text-center">To Pay</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Extra Loading Paid by us</td>
                      <td class="text-right">${data.charges.extraLoading}</td>
                      <td class="text-center">
                        Goods entirely<br>
                        booked at<br>
                        <strong>OWNER'S RISK</strong>
                      </td>
                    </tr>
                    <tr style="border-top: 2px solid #000;">
                      <td></td>
                      <td><strong>Total</strong></td>
                      <td class="text-right"><strong>${data.total}</strong></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <!-- Service Tax and Invoice Details -->
                <div class="bottom-section">
                  <table class="service-tax-table">
                    <tr>
                      <td style="border-right: 1px solid #000; border-bottom: 1px solid #000;">Service Tax</td>
                      <td style="border-bottom: 1px solid #000;">Consignor</td>
                    </tr>
                    <tr>
                      <td style="border-right: 1px solid #000;">Payable by</td>
                      <td>Consignee</td>
                    </tr>
                  </table>
                  <div class="invoice-box">
                    <div>Inv. No. ${data.invNo}</div>
                    <div>Ch. No. ${data.chNo}</div>
                    ${data.invoiceDate ? `<div>Inv. Date: ${new Date(data.invoiceDate).toLocaleDateString('en-GB')}</div>` : ''}
                  </div>
                </div>

                <!-- Delivery and Remarks -->
                <div class="delivery-remarks">
                  <div class="delivery-box">
                    <div class="section-title">Delivery At.</div>
                    <div class="address-line">${data.deliveryAt}</div>
                  </div>
                  <div class="remarks-box">
                    <div class="section-title">Remarks</div>
                    <div class="address-line">${data.remarks}</div>
                  </div>
                </div>

                <!-- Driver Details -->
                <div class="delivery-box">
                  <div class="section-title">Driver Details</div>
                  <div class="address-line">Name: ${data.driverDetails.name}</div>
                  <div class="address-line">Mobile: ${data.driverDetails.mobile}</div>
                  <div class="address-line">License: ${data.driverDetails.license}</div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div>${data.disclaimer}</div>
              <div class="footer-right">For ${data.companyName}</div>
            </div>
          </div>
        </body>
        </html>
      `;
    };

    // Generate PDF using the pdfService
    const pdfBuffer = await pdfService.generatePdfFromTemplate(generateLorryReceiptHtml, pdfData, {
      filename: `LorryReceipt-${lorryReceipt.lorryReceiptNumber}`,
      pdfOptions: {
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
      }
    });

    // Set headers and send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=LorryReceipt-${lorryReceipt.lorryReceiptNumber}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating lorry receipt PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate lorry receipt PDF',
      error: error.message
    });  }
};

module.exports = {
  createLorryReceipt,
  getLorryReceipts,
  getLorryReceiptById,
  updateLorryReceipt,
  deleteLorryReceipt,
  generateLorryReceiptPdf
};
