const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { createCompanyFromQuotation } = require('../../middleware/companyMiddleware');

const QuotationSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quoteToCompany: {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' }, // Reference to existing company
    companyName: String,
    gstNumber: String,
    contactNumber: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    inquiryVia: { 
      type: String, 
      enum: ['Email', 'Whatsapp', 'Call', 'Message', 'Other'] 
    },
    inquiryDate: Date,
    referenceDocumentId: String,
    inquiryByPerson: String
  },

  materialDetails: [{
    materialName: String,
    packagingType: { 
      type: String, 
      enum: ['Bags', 'Barrels', 'Box', 'Breakable items', 'Bunch', 'Bundle', 'Coil', 'Container', 'Fruit vegetable', 'Furniture', 'Gas', 'Gas bottles', 'Gas cylinder', 'Gas tank', 'Glass', 'Heavy items', 'Jumbo bags', 'Liquid', 'Loose', 'Loss', 'Machine', 'Machine part', 'Machinery', 'Other', 'Palette', 'Pipe and bundle', 'Pipes', 'Plates', 'PMMA', 'Rod/sariya', 'Ropes', 'Scrap cars', 'Tank', 'Wire coil', 'Wood'] 
    },
    weight: {
      value: Number,
      unit: { 
        type: String, 
        enum: ['KG', 'MT', 'Quintal', 'LTR', 'FIX'] 
      }
    },
    numberOfArticles: Number,
    dimensions: {
      lengthFt: Number,
      widthFt: Number,
      heightFt: Number
    }
  }],
  
  tripDetails: {
	  fullOrPartLoad: { type: String, enum: ['Full Load', 'Part Load'] },
	  from: String,
	  pickupPoints: [String],
	  to: String,
	  deliveryPoints: [String],
	  loadingDate: Date,
	  tripType: { type: String, enum: ['One Way', 'Round Trip'] }
	},

  vehicleDetails: [{
    vehicleType: String,
    weightGuarantee: {
      value: Number,
      unit: { 
        type: String, 
        enum: ['KG', 'MT', 'Quintal', 'LTR', 'FIX'] 
      }
    },
    freightRate: {
      value: Number,
      unit: { 
        type: String, 
        enum: ['Per KG', 'Per MT', 'Per Quintal', 'Per LTR', 'Per FIX'] 
      }
    },
    dimensions: {
      lengthFt: Number,
      widthFt: Number,
      heightFt: Number
    },
    numberOfTrucks: Number,
    openSides: {
      allSide: Boolean,
      driverSide: Boolean,
      driverOppositeSide: Boolean,
      towardsEnd: Boolean,
      height: Boolean
    }
}],

freightBreakup: {
  rate: {
    value: Number,
    type: { 
      type: String, 
      enum: ['Fixed', 'Per KG', 'Per MT', 'Per Quintal', 'Per LTR', 'Per KM', 'Per Pack', 'Per Ton', 'Per Unit'] 
    }
  },
  tds: {
    value: Number,
    type: { 
      type: String, 
      enum: ['Deduction', 'Addition'] 
    }
  },  extraCharges: {
    loadingCharge: Number,
    unloadingCharge: Number,
    doorPickupCharge: Number,
    doorDeliveryCharge: Number,
    packingCharge: Number,
    unpackingCharge: Number,
    cashOnDelivery: Number,
    deliveryOnDateCharge: Number,
    tollTax: Number,
    odcCharge: Number,
    serviceChargePercent: Number,
    otherCharges: Number,
    totalExtraCharges: Number
  },
  applicableGST: {
    type: String,
    enum: ['NIL (On reverse charge)', '5.0%', '12.0%', '18.0%', '28.0%'],
    default: 'NIL (On reverse charge)'
  },
  gstAmount: Number,
  totalFreightWithGst: Number
},

  paymentTerms: {
    payBy: { 
      type: String, 
      enum: ['Consignor', 'Consignee'] 
    },
    driverCashRequired: Number,
    customTerms: {
      advancePaidAmount: {
        value: Number,
        type: { type: String, enum: ['Fix', '%'] }
      },
      afterLoading: {
        value: Number,
        type: { type: String, enum: ['Fix', '%'] }
      },
      afterDelivery: {
        value: Number,
        type: { type: String, enum: ['Fix', '%'] }
      },
      afterPOD: {
        value: Number,
        type: { type: String, enum: ['Fix', '%'] }
      }
    },
    paymentDate: {
      type: { type: String, enum: ['Date', 'Days'] },
      value: Schema.Types.Mixed  // Can be Date or Number depending on type
    },
    paymentRemark: String
  },


  quotationValidity: {
    validUpTo: {
      type: { type: String, enum: ['Date', 'Days'] },
      value: Schema.Types.Mixed  // Can be Date or Number depending on type
    },
    expiryDate: Date
  },
  demurrage: {
    chargePerHour: {
      value: Number,
      type: { type: String, enum: ['Per Hour', 'Per Day'] }
    },
    applicableAfterHours: Number  }
}, { timestamps: true });

// Apply middleware to automatically create company when quotation is saved
QuotationSchema.pre('save', createCompanyFromQuotation);

module.exports = mongoose.model('Quotation', QuotationSchema);
