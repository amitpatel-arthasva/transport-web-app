const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { createCompanyFromDeliverySlip } = require('../../middleware/companyMiddleware');

const DeliverySlipSchema = new Schema({
  deliverySlipNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  // Party Details
  partyDetails: {
    sender: {
      senderId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
      senderName: { type: String, required: true },
      senderContactNumber: { type: String, required: true }
    },
    receiver: {
      receiverId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
      receiverName: { type: String, required: true },
      receiverContactNumber: { type: String, required: true }
    }
  },

  // Parcel Details
  parcelDetails: {
    transporterName: { type: String, required: true },
    transporterContactNumber: { type: String, required: true },
    parcelFrom: { type: String, required: true },
    lrNumber: { 
      type: String, 
      required: true,
      ref: 'LorryReceipt' // Reference to LorryReceipt
    },
    totalArticleQuantity: { type: Number, required: true },
    materialName: { type: String, required: true }
  },

  // Freight Details
  freightDetails: {
    charges: {
      biltyFreight: { type: Number, default: 0.0 },
      deliveryCharge: { type: Number, default: 0.0 },
      labourCharge: { type: Number, default: 0.0 },
      biltyCharge: { type: Number, default: 0.0 },
      haltingCharge: { type: Number, default: 0.0 },
      warehouseCharge: { type: Number, default: 0.0 },
      localTransportCharge: { type: Number, default: 0.0 },
      otherCharges: { type: Number, default: 0.0 }
    },
    
    deliveryCollection: { type: Number, default: 0.0 },
    
    // GST Details
    gstDetails: {
      applicableGST: {
		type: String,
		enum: ['NIL (On reverse charge)', '5.0%', '12.0%', '18.0%', '28.0%'],
		default: 'NIL (On reverse charge)'
	  },
      gstAmount: { type: Number, default: 0.0 }
    },
    
    roundOff: { type: Number, default: 0.0 },
    totalFreight: { type: Number, default: 0.0 }
  },

  // Delivery By
  deliveryBy: {
    subUserId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to sub-user
    contactNumber: { type: String, required: true }
  },

  // Status tracking
  status: {
    type: String,
    enum: ['Created', 'Out for Delivery', 'Delivered', 'Failed Delivery', 'Cancelled'],
    default: 'Created'
  },

  // User who created this delivery slip
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // References to related documents
  lorryReceiptRef: {
    type: Schema.Types.ObjectId,
    ref: 'LorryReceipt'
  },

  loadingSlipRef: {
    type: Schema.Types.ObjectId,
    ref: 'LoadingSlip'
  },

  quotationRef: {
    type: Schema.Types.ObjectId,
    ref: 'Quotation'
  },

  // Delivery notes/remarks
  deliveryNotes: String,

  // Delivery timestamp
  deliveredAt: Date

}, { timestamps: true });

// Pre-save middleware to auto-calculate totals
DeliverySlipSchema.pre('save', function(next) {
  // Calculate delivery collection (sum of all charges)
  const charges = this.freightDetails.charges;
  this.freightDetails.deliveryCollection = 
    charges.biltyFreight + charges.deliveryCharge + charges.labourCharge + 
    charges.biltyCharge + charges.haltingCharge + charges.warehouseCharge + 
    charges.localTransportCharge + charges.otherCharges;
  
  // Calculate total freight
  this.freightDetails.totalFreight = 
    this.freightDetails.deliveryCollection + 
    this.freightDetails.gstDetails.gstAmount + 
    this.freightDetails.roundOff;
  
  next();
});

// Apply middleware to automatically create companies when delivery slip is saved
DeliverySlipSchema.pre('save', createCompanyFromDeliverySlip);

// Create indexes for better query performance
// Note: deliverySlipNumber already has unique index from field definition
DeliverySlipSchema.index({ date: -1 });
DeliverySlipSchema.index({ 'partyDetails.sender.senderName': 1 });
DeliverySlipSchema.index({ 'partyDetails.receiver.receiverName': 1 });
DeliverySlipSchema.index({ 'parcelDetails.lrNumber': 1 });
DeliverySlipSchema.index({ 'parcelDetails.transporterName': 1 });
DeliverySlipSchema.index({ status: 1 });
DeliverySlipSchema.index({ createdBy: 1 });
DeliverySlipSchema.index({ deliveredAt: -1 });

module.exports = mongoose.model('DeliverySlip', DeliverySlipSchema);
