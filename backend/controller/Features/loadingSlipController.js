const LoadingSlip = require('../../models/features/LoadingSlip');

const createLoadingSlip = async (req, res) => {
  try {
    const {
      slipNumber,
      loadingDate,
      companyDetails,
      referenceDetails,
      loadingMaterial,
      truckDetails,
      driverDetails,
      freightDetails,
      remarks,
      lorryReceiptRef
    } = req.body;

    // Validate required fields
    if (!slipNumber || !companyDetails || !loadingMaterial || !truckDetails || !driverDetails) {
      return res.status(400).json({
        success: false,
        message: 'Slip number, company details, loading material, truck details, and driver details are required'
      });
    }

    // Create new loading slip
    const loadingSlip = new LoadingSlip({
      slipNumber,
      loadingDate: loadingDate || new Date(),
      companyDetails,
      referenceDetails: referenceDetails || {},
      loadingMaterial,
      truckDetails,
      driverDetails,
      freightDetails: freightDetails || {},
      remarks: remarks || '',
      createdBy: req.user.id,
      lorryReceiptRef: lorryReceiptRef || null
    });

    await loadingSlip.save();

    return res.status(201).json({
      success: true,
      message: 'Loading slip created successfully',
      data: {
        loadingSlip
      }
    });

  } catch (error) {
    console.error('Error creating loading slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create loading slip',
      error: error.message
    });
  }
};

const getLoadingSlips = async (req, res) => {
  try {
    const { page = 1, limit = 10, companyName, truckNumber, driverName, status, search } = req.query;
    
    // Build query object
    const query = { createdBy: req.user.id };
    
    // Handle search with OR logic for better search experience
    if (search) {
      query.$or = [
        { 'companyDetails.companyName': { $regex: search, $options: 'i' } },
        { 'truckDetails.truckNumber': { $regex: search, $options: 'i' } },
        { 'driverDetails.driverName': { $regex: search, $options: 'i' } },
        { 'loadingMaterial.from': { $regex: search, $options: 'i' } },
        { 'loadingMaterial.to': { $regex: search, $options: 'i' } },
        { slipNumber: { $regex: search, $options: 'i' } }
      ];
    } else {
      // Individual field searches for more specific filtering
      if (companyName) {
        query['companyDetails.companyName'] = { $regex: companyName, $options: 'i' };
      }
      
      if (truckNumber) {
        query['truckDetails.truckNumber'] = { $regex: truckNumber, $options: 'i' };
      }
      
      if (driverName) {
        query['driverDetails.driverName'] = { $regex: driverName, $options: 'i' };
      }
    }
    
    if (status) {
      query.status = status;
    }

    const loadingSlips = await LoadingSlip.find(query)
      .populate('createdBy', 'name email')
      .populate('companyDetails.companyId', 'companyName gstNumber')
      .populate('lorryReceiptRef', 'lorryReceiptNumber date')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LoadingSlip.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Loading slips retrieved successfully',
      data: {
        loadingSlips,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Error retrieving loading slips:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve loading slips',
      error: error.message
    });
  }
};

const getLoadingSlipById = async (req, res) => {
  try {
    const { id } = req.params;

    const loadingSlip = await LoadingSlip.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    })
    .populate('createdBy', 'name email')
    .populate('companyDetails.companyId', 'companyName gstNumber contactNumber address')
    .populate('lorryReceiptRef', 'lorryReceiptNumber date consignor consignee');

    if (!loadingSlip) {
      return res.status(404).json({
        success: false,
        message: 'Loading slip not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Loading slip retrieved successfully',
      data: {
        loadingSlip
      }
    });

  } catch (error) {
    console.error('Error retrieving loading slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve loading slip',
      error: error.message
    });
  }
};

const updateLoadingSlip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find loading slip and ensure it belongs to the authenticated user
    const loadingSlip = await LoadingSlip.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!loadingSlip) {
      return res.status(404).json({
        success: false,
        message: 'Loading slip not found'
      });
    }

    // Update loading slip fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        loadingSlip[key] = updateData[key];
      }
    });

    await loadingSlip.save();

    return res.status(200).json({
      success: true,
      message: 'Loading slip updated successfully',
      data: {
        loadingSlip
      }
    });

  } catch (error) {
    console.error('Error updating loading slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update loading slip',
      error: error.message
    });
  }
};

const deleteLoadingSlip = async (req, res) => {
  try {
    const { id } = req.params;

    const loadingSlip = await LoadingSlip.findOneAndDelete({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!loadingSlip) {
      return res.status(404).json({
        success: false,
        message: 'Loading slip not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Loading slip deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting loading slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete loading slip',
      error: error.message
    });
  }
};

module.exports = {
  createLoadingSlip,
  getLoadingSlips,
  getLoadingSlipById,
  updateLoadingSlip,
  deleteLoadingSlip
};
