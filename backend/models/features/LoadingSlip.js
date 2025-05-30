const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { createCompanyFromLoadingSlip } = require('../../middleware/companyMiddleware');

const LoadingSlipSchema = new Schema({
  slipNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  loadingDate: {
    type: Date,
    required: true,
    default: Date.now
  },

  // Company Details
  companyDetails: {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
    companyName: { type: String, required: true },
    gstNumber: String,
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    loadingContactNumber: String
  },

  // Reference Details
  referenceDetails: {
    confirmThrough: {
      type: String,
      enum: ['Call', 'Email', 'WhatsApp', 'Message', 'Other'],
      default: 'Call'
    },
    referenceDate: {
      type: Date,
      default: Date.now
    },
    referenceNumber: String
  },
  // Loading Material Details
  loadingMaterial: {
    loadType: {
      type: String,
      enum: ['Full Load', 'Part Load'],
      required: true
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    approxLoadingWeight: {
      value: { type: Number, default: 0.0 },
      unit: {
        type: String,
        enum: ['KG', 'MT', 'Quintal', 'LTR'],
        default: 'MT'
      }
    },
    materials: [{
      materialName: { type: String, required: true },
      packagingType: {
        type: String,
        enum: ['Bags', 'Barrels', 'Box', 'Breakable items', 'Bunch', 'Bundle', 'Coil', 'Container', 'Fruit vegetable', 'Furniture', 'Gas', 'Gas bottles', 'Gas cylinder', 'Gas tank', 'Glass', 'Heavy items', 'Jumbo bags', 'Liquid', 'Loose', 'Loss', 'Machine', 'Machine part', 'Machinery', 'Other', 'Palette', 'Pipe and bundle', 'Pipes', 'Plates', 'PMMA', 'Rod/sariya', 'Ropes', 'Scrap cars', 'Tank', 'Wire coil', 'Wood'],
        required: true
      },
      numberOfArticles: { type: Number, required: true }
    }]
  },

  // Truck Details
  truckDetails: {
    truckNumber: { type: String, required: true },
    vehicleType: {
      type: String,
      default: 'Full Body Trailer'
    },
    allocatedLRNumber: String,
    dimensions: {
      loadingLengthFt: { type: Number, default: 0.0 },
      loadingWidthFt: { type: Number, default: 0.0 },
      loadingHeightFt: { type: Number, default: 0.0 }
    },
    overload: {
      type: Boolean,
      default: false
    }
  },

  // Driver Details
  driverDetails: {
    driverName: { type: String, required: true },
    driverMobile: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseExpiryDate: {
      type: Date,
      required: true
    }
  },

// Freight Details
freightDetails: {
	basicFreight: {
		amount: { type: Number, required: true },
		type: {
			type: String,
			enum: ['FIX', 'MT', 'KG', 'QUINTAL', 'PACK', 'UNIT', 'LTR'],
			default: 'FIX'
		}
	},
	confirmedAdvance: { type: Number, default: 0.0 },
	balanceAmount: { type: Number, default: 0.0 },
	loadingChargePayBy: {
		type: String,
		enum: ['Company', 'Driver'],
		default: 'Company'
	},
	loadingChargeByDriver: {
		amount: { type: Number },
		type: {
			type: String,
			enum: ['KG', 'FULL Truck', 'MT', 'Quintal', 'Pre Pack', 'Unit', 'LTR']
		}
	}
},

  // Remarks
  remarks: String,

  // Status tracking
  status: {
    type: String,
    enum: ['Created', 'Loading', 'Loaded', 'Dispatched', 'Cancelled'],
    default: 'Created'
  },

  // User who created this loading slip
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Reference to related quotation or lorry receipt
  quotationRef: {
    type: Schema.Types.ObjectId,
    ref: 'Quotation'
  },
  
  lorryReceiptRef: {
    type: Schema.Types.ObjectId,
    ref: 'LorryReceipt'
  }

}, { timestamps: true });

// Pre-save middleware to auto-calculate balance amount
LoadingSlipSchema.pre('save', function(next) {
  // Calculate balance amount
  this.freightDetails.balanceAmount = 
    this.freightDetails.basicFreight.amount - this.freightDetails.confirmedAdvance;
  
  next();
});

// Apply middleware to automatically create company when loading slip is saved
LoadingSlipSchema.pre('save', createCompanyFromLoadingSlip);

// Create indexes for better query performance
// Note: slipNumber already has unique index from field definition
LoadingSlipSchema.index({ loadingDate: -1 });
LoadingSlipSchema.index({ 'companyDetails.companyName': 1 });
LoadingSlipSchema.index({ 'truckDetails.truckNumber': 1 });
LoadingSlipSchema.index({ 'truckDetails.allocatedLRNumber': 1 });
LoadingSlipSchema.index({ status: 1 });
LoadingSlipSchema.index({ createdBy: 1 });

module.exports = mongoose.model('LoadingSlip', LoadingSlipSchema);
