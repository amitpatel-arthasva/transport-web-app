const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true,
    sparse: true,
    unique: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  pinCode: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  }
}, { timestamps: true });

// Create compound index for name and gst combination to prevent duplicates
CompanySchema.index({ companyName: 1, gstNumber: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Company', CompanySchema);