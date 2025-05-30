const User = require('../models/User');
const pdfService = require('../services/pdfService');

const viewProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile data retrieved successfully',
      data: {
        user: user
      }
    });

  } catch (error) {
    console.error('View profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData._id;
    delete updateData.__v;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        select: '-password' // Exclude password from response
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const generateProfilePdf = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate HTML for the profile
    const generateProfileHtml = (data) => {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>User Profile</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              color: #2563eb;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              color: #1f2937;
            }
            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .detail-item {
              margin-bottom: 8px;
            }
            .detail-label {
              font-weight: bold;
              color: #4b5563;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>User Profile</h1>
            <p>Profile information as of ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Basic Information</div>
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Name:</span> ${data.name || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span> ${data.email || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone Number:</span> ${data.phonenumber || 'N/A'}
              </div>
            </div>
          </div>
          
          ${data.profileDetails ? `
          <div class="section">
            <div class="section-title">Business Details</div>
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Transporter Name:</span> ${data.profileDetails.transporterName || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Tag Line:</span> ${data.profileDetails.tagLine || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">GST Number:</span> ${data.profileDetails.gstNumber || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">PAN Number:</span> ${data.profileDetails.panNumber || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Udyam Registration:</span> ${data.profileDetails.udyamRegistrationNumber || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Registration Number:</span> ${data.profileDetails.registrationNumber || 'N/A'}
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Address Details</div>
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Address Line 1:</span> ${data.profileDetails.addressLine1 || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Address Line 2:</span> ${data.profileDetails.addressLine2 || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">City:</span> ${data.profileDetails.city || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">State:</span> ${data.profileDetails.state || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">PIN Code:</span> ${data.profileDetails.pinCode || 'N/A'}
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Banking Details</div>
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Bank Name:</span> ${data.profileDetails.bankName || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Account Number:</span> ${data.profileDetails.accountNumber || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">IFSC Code:</span> ${data.profileDetails.ifscCode || 'N/A'}
              </div>
              <div class="detail-item">
                <span class="detail-label">SWIFT Code:</span> ${data.profileDetails.swiftCode || 'N/A'}
              </div>
            </div>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>This is a computer generated document and does not require signature.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;
    };

    // Generate PDF using the pdfService
    const pdfBuffer = await pdfService.generatePdfFromTemplate(generateProfileHtml, user, {
      filename: `Profile-${user.name}`,
      pdfOptions: {
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
      }
    });

    // Set headers and send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Profile-${user.name.replace(/\s+/g, '_')}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Generate profile PDF error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate profile PDF',
      error: error.message
    });
  }
};

module.exports = {
  viewProfile,
  updateUser,
  generateProfilePdf
};
