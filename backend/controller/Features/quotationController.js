const Quotation = require('../../models/features/Quotations');
const User = require('../../models/User');

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
    });
  }
};

module.exports = {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation
};
