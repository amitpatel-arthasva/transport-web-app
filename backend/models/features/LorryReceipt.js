const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { createCompanyFromLorryReceipt } = require('../../middleware/companyMiddleware');

const LorryReceiptSchema = new Schema({
  lorryReceiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  // Consignor Details
  consignor: {
    consignorId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
    consignorName: { type: String, required: true },
    gstNumber: String,
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    email: String
  },

  // Loading Address
  loadingAddress: {
    sameAsConsignor: { type: Boolean, default: true },
    loadingAddressId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
    partyName: String,
    gstNumber: String,
    contactNumber: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    pickupPoints: [String]
  },

  // Consignee Details
  consignee: {
    consigneeId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
    consigneeName: { type: String, required: true },
    gstNumber: String,
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    email: String
  },

  // Delivery Details
  deliveryDetails: {
    deliveryType: { 
      type: String, 
      enum: ['Door', 'Warehouse'], 
      required: true 
    },
    sameAsConsignee: { type: Boolean, default: true },
    deliveryAddressId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
    companyName: String,
    contactPersonName: String,
    gstNumber: String,
    contactNumber: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    deliveryPoints: [String]
},

	// Invoice & E-Way Bill Details
	invoiceAndEwayDetails: {
		valueOfGoods: {
			type: { 
			type: String, 
			enum: ['As per Invoice', 'Enter Value / Amount'], 
			required: true 
			},
			invoiceAmount: {
			type: Number,
			required: function() {
				return this.invoiceAndEwayDetails && 
					this.invoiceAndEwayDetails.valueOfGoods && 
					this.invoiceAndEwayDetails.valueOfGoods.type === 'Enter Value / Amount';
			}
			}
		},
		
		// Invoice Details
		invoiceDetails: [{
			invoiceNumber: String,
			invoiceDate: {
			type: Date,
			default: Date.now
			}
		}],
		
		// E-Way Bill Details
		ewayBillDetails: {
			ewayBillNumber: String,
			ewayBillExpiryDate: Date,
			ewayBillGeneratedOn: Date,
			ewayBillExtendedPeriod: String
		},
		
		// Details will show in column of
		detailsShowIn: {
			type: String,
			enum: ['Consignor', 'Consignee'],
			default: 'Consignor'
		}
	},
  // Truck Details
  truckDetails: {
    truckNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    from: { type: String, required: true },
    weightGuarantee: {
      value: { type: Number, required: true },
      unit: { 
        type: String, 
        enum: ['KG', 'MT', 'Quintal', 'LTR'], 
        required: true 
      }
    },
    driverName: { type: String, required: true },
    driverMobile: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    loadType: { 
      type: String, 
      enum: ['Full Load', 'Part Load'], 
      required: true 
    }
  },

  // Material Details
  materialDetails: [{
    materialName: { type: String, required: true },
    packagingType: { 
      type: String, 
      enum: ['Bags', 'Barrels', 'Box', 'Breakable items', 'Bunch', 'Bundle', 'Coil', 'Container', 'Fruit vegetable', 'Furniture', 'Gas', 'Gas bottles', 'Gas cylinder', 'Gas tank', 'Glass', 'Heavy items', 'Jumbo bags', 'Liquid', 'Loose', 'Loss', 'Machine', 'Machine part', 'Machinery', 'Other', 'Palette', 'Pipe and bundle', 'Pipes', 'Plates', 'PMMA', 'Rod/sariya', 'Ropes', 'Scrap cars', 'Tank', 'Wire coil', 'Wood'],
      required: true
    },
    quantity: { type: Number, required: true },
    numberOfArticles: { type: Number, required: true },
    actualWeight: {
      value: { type: Number, required: true },
      unit: { 
        type: String, 
        enum: ['KG', 'MT', 'Quintal', 'LTR'], 
        default: 'MT' 
      }
    },
    chargedWeight: {
      value: { type: Number, required: true },
      unit: { 
        type: String, 
        enum: ['KG', 'MT', 'Quintal', 'LTR'], 
        default: 'MT' 
      }
    },
    freightRate: {
      value: { type: Number, required: true },
      unit: { 
        type: String, 
        enum: ['Per KG', 'Per MT', 'Per Quintal', 'Per LTR', 'Per Pack', 'Per Unit', 'Per Vehicale'], 
        default: 'Per MT' 
      }
    },
    hsnCode: String,
    containerNumber: String,
    dimensions: {
      lengthFt: { type: Number, default: 0.0 },
      widthFt: { type: Number, default: 0.0 },
      heightFt: { type: Number, default: 0.0 }
    }
  }],

  // Freight Details
  freightDetails: {
    freightType: { 
      type: String, 
      enum: ['Paid', 'To Pay', 'To be billed'], 
      required: true 
    },
    totalBasicFreight: { type: Number, default: 0.0 },
    charges: {
      pickupCharge: { type: Number, default: 0.0 },
      doorDeliveryCharge: { type: Number, default: 0.0 },
      loadingCharge: { type: Number, default: 0.0 },
      unloadingCharge: { type: Number, default: 0.0 },
      packingCharge: { type: Number, default: 0.0 },
      unpackingCharge: { type: Number, default: 0.0 },
      serviceCharge: { type: Number, default: 0.0 },
      cashOnDelivery: { type: Number, default: 0.0 },
      dateOnDelivery: { type: Number, default: 0.0 },
      otherCharges: { type: Number, default: 0.0 }
    },
    subTotal: { type: Number, default: 0.0 },
    
    // GST Details
    gstDetails: {
      gstFileAndPayBy: { 
        type: String, 
        enum: ['Consignor', 'Consignee', 'Transporter', 'Exempted'], 
        default: 'Consignee' 
      },
      applicableGST: { 
        type: String, 
        enum: ['NIL (On reverse charge)', '5.0%', '12.0%', '18.0%', '28.0%'],
    	default: 'NIL (On reverse charge)' 
      },
      gstAmount: { type: Number, default: 0.0 }
    },
    
    // Advance Details
    advanceDetails: {
      advanceReceived: { type: Number, default: 0.0 },
      remainingFreight: { type: Number, default: 0.0 }
    },
    
    // TDS Details
    tdsDetails: {
      tdsPercentage: { type: Number, default: 0.0 },
      tdsType: { 
        type: String, 
        enum: ['TDS Deduction', 'TDS Addition'], 
        default: 'TDS Deduction' 
      },
      tdsAmount: { type: Number, default: 0.0 }
    },
    
    roundOff: { type: Number, default: 0.0 },
    totalFreight: { type: Number, default: 0.0 },
    
    freightPayBy: { 
      type: String, 
      enum: ['Consignor', 'Consignee'], 
      required: true 
    },
    
    hideFreightFromPdf: { type: Boolean, default: false }
  },

  // Additional tracking fields
  status: {
    type: String,
    enum: ['Created', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Created'
  },
  
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  notes: String,
    // Reference to related quotation if applicable
  quotationRef: { 
    type: Schema.Types.ObjectId, 
    ref: 'Quotation' 
  },


}, { timestamps: true });

// Pre-save middleware to auto-calculate totals
LorryReceiptSchema.pre('save', function(next) {
  // Calculate sub total
  const charges = this.freightDetails.charges;
  this.freightDetails.subTotal = this.freightDetails.totalBasicFreight + 
    charges.pickupCharge + charges.doorDeliveryCharge + charges.loadingCharge + 
    charges.unloadingCharge + charges.packingCharge + charges.unpackingCharge + 
    charges.serviceCharge + charges.cashOnDelivery + charges.dateOnDelivery + 
    charges.otherCharges;
  
  // Calculate total freight
  this.freightDetails.totalFreight = this.freightDetails.subTotal + 
    this.freightDetails.gstDetails.gstAmount + 
    this.freightDetails.roundOff - 
    this.freightDetails.tdsDetails.tdsAmount;
  
  // Calculate remaining freight
  this.freightDetails.advanceDetails.remainingFreight = 
    this.freightDetails.totalFreight - this.freightDetails.advanceDetails.advanceReceived;
    next();
});

// Apply middleware to automatically create companies when lorry receipt is saved
LorryReceiptSchema.pre('save', createCompanyFromLorryReceipt);

// Create indexes for better query performance
// Note: lorryReceiptNumber already has unique index from field definition
LorryReceiptSchema.index({ date: -1 });
LorryReceiptSchema.index({ 'consignor.consignorName': 1 });
LorryReceiptSchema.index({ 'consignee.consigneeName': 1 });
LorryReceiptSchema.index({ 'truckDetails.truckNumber': 1 });
LorryReceiptSchema.index({ status: 1 });
LorryReceiptSchema.index({ createdBy: 1 });

module.exports = mongoose.model('LorryReceipt', LorryReceiptSchema);
