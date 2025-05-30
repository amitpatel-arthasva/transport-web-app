const DeliverySlip = require('../../models/features/DeliverySlip');

const createDeliverySlip = async (req, res) => {
  try {
    const {
      deliverySlipNumber,
      date,
      partyDetails,
      parcelDetails,
      freightDetails,
      deliveryBy,
      status,
      lorryReceiptRef,
      loadingSlipRef,
      quotationRef,
      deliveryNotes
    } = req.body;

    // Validate required fields
    if (!deliverySlipNumber || !partyDetails || !parcelDetails || !deliveryBy) {
      return res.status(400).json({
        success: false,
        message: 'Delivery slip number, party details, parcel details, and delivery by are required'
      });
    }

    // Create new delivery slip
    const deliverySlip = new DeliverySlip({
      deliverySlipNumber,
      date: date || new Date(),
      partyDetails,
      parcelDetails,
      freightDetails: freightDetails || {},
      deliveryBy,
      status: status || 'Created',
      createdBy: req.user.id,
      lorryReceiptRef: lorryReceiptRef || null,
      loadingSlipRef: loadingSlipRef || null,
      quotationRef: quotationRef || null,
      deliveryNotes: deliveryNotes || ''
    });

    await deliverySlip.save();

    return res.status(201).json({
      success: true,
      message: 'Delivery slip created successfully',
      data: {
        deliverySlip
      }
    });

  } catch (error) {
    console.error('Error creating delivery slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create delivery slip',
      error: error.message
    });
  }
};

const getDeliverySlips = async (req, res) => {
  try {
    const { page = 1, limit = 10, senderName, receiverName, transporterName, status } = req.query;
    
    // Build query object
    const query = { createdBy: req.user.id };
    
    // Handle search with OR logic when the same term is used for multiple fields
    if (senderName || receiverName || transporterName) {
      const searchConditions = [];
      
      if (senderName) {
        searchConditions.push({ 'partyDetails.sender.senderName': { $regex: senderName, $options: 'i' } });
      }
      
      if (receiverName) {
        searchConditions.push({ 'partyDetails.receiver.receiverName': { $regex: receiverName, $options: 'i' } });
      }
      
      if (transporterName) {
        searchConditions.push({ 'parcelDetails.transporterName': { $regex: transporterName, $options: 'i' } });
      }
      
      if (searchConditions.length > 0) {
        query.$or = searchConditions;
      }
    }
    
    if (status) {
      query.status = status;
    }

    const deliverySlips = await DeliverySlip.find(query)
      .populate('createdBy', 'name email')
      .populate('partyDetails.sender.senderId', 'companyName contactNumber')
      .populate('partyDetails.receiver.receiverId', 'companyName contactNumber')
      .populate('deliveryBy.subUserId', 'name email')
      .populate('lorryReceiptRef', 'lorryReceiptNumber date')
      .populate('loadingSlipRef', 'slipNumber loadingDate')
      .populate('quotationRef', 'createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DeliverySlip.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Delivery slips retrieved successfully',
      data: {
        deliverySlips,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Error retrieving delivery slips:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve delivery slips',
      error: error.message
    });
  }
};

const getDeliverySlipById = async (req, res) => {
  try {
    const { id } = req.params;

    const deliverySlip = await DeliverySlip.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    })
    .populate('createdBy', 'name email')
    .populate('partyDetails.sender.senderId', 'companyName gstNumber contactNumber address')
    .populate('partyDetails.receiver.receiverId', 'companyName gstNumber contactNumber address')
    .populate('deliveryBy.subUserId', 'name email contactNumber')
    .populate('lorryReceiptRef', 'lorryReceiptNumber date consignor consignee')
    .populate('loadingSlipRef', 'slipNumber loadingDate companyDetails')
    .populate('quotationRef', 'quoteToCompany materialDetails');

    if (!deliverySlip) {
      return res.status(404).json({
        success: false,
        message: 'Delivery slip not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Delivery slip retrieved successfully',
      data: {
        deliverySlip
      }
    });

  } catch (error) {
    console.error('Error retrieving delivery slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve delivery slip',
      error: error.message
    });
  }
};

const updateDeliverySlip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find delivery slip and ensure it belongs to the authenticated user
    const deliverySlip = await DeliverySlip.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!deliverySlip) {
      return res.status(404).json({
        success: false,
        message: 'Delivery slip not found'
      });
    }

    // Update delivery slip fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        deliverySlip[key] = updateData[key];
      }
    });

    // Set delivery timestamp if status is being updated to 'Delivered'
    if (updateData.status === 'Delivered' && deliverySlip.status !== 'Delivered') {
      deliverySlip.deliveredAt = new Date();
    }

    await deliverySlip.save();

    return res.status(200).json({
      success: true,
      message: 'Delivery slip updated successfully',
      data: {
        deliverySlip
      }
    });

  } catch (error) {
    console.error('Error updating delivery slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update delivery slip',
      error: error.message
    });
  }
};

const deleteDeliverySlip = async (req, res) => {
  try {
    const { id } = req.params;

    const deliverySlip = await DeliverySlip.findOneAndDelete({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!deliverySlip) {
      return res.status(404).json({
        success: false,
        message: 'Delivery slip not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Delivery slip deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting delivery slip:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete delivery slip',
      error: error.message
    });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryNotes } = req.body;

    // Validate status
    const validStatuses = ['Created', 'Out for Delivery', 'Delivered', 'Failed Delivery', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery status'
      });
    }

    const deliverySlip = await DeliverySlip.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!deliverySlip) {
      return res.status(404).json({
        success: false,
        message: 'Delivery slip not found'
      });
    }

    deliverySlip.status = status;
    if (deliveryNotes) {
      deliverySlip.deliveryNotes = deliveryNotes;
    }

    // Set delivery timestamp if status is 'Delivered'
    if (status === 'Delivered') {
      deliverySlip.deliveredAt = new Date();
    }

    await deliverySlip.save();

    return res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully',
      data: {
        deliverySlip
      }
    });

  } catch (error) {
    console.error('Error updating delivery status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: error.message
    });
  }
};

module.exports = {
  createDeliverySlip,
  getDeliverySlips,
  getDeliverySlipById,
  updateDeliverySlip,
  deleteDeliverySlip,
  updateDeliveryStatus
};
