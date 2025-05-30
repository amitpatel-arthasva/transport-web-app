const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  // Profile Details - All transporter/business related information
  profileDetails: {
    // Transport Name (same as user name by default)
    transporterName: {
      type: String,
      trim: true,
      default: function() {
        return this.name; // Same as user name
      }
    },
    tagLine: {
      type: String,
      trim: true
    },
    
    // Registration Details
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    udyamRegistrationNumber: {
      type: String,
      trim: true
    },
    uinNumber: {
      type: String,
      trim: true
    },
    tanNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    cinNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    registrationNumber: {
      type: String,
      trim: true
    },

    // Address Details
    addressLine1: {
      type: String,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true
    },

    // Branch Details
    branchName: {
      type: String,
      trim: true
    },
    branchCode: {
      type: String,
      trim: true
    },

    // Service Routes
    serviceRoutes: [{
      routeName: String,
      fromLocation: String,
      toLocation: String,
      description: String
    }],

    // Contact Details
    contactPersonNumber: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true,
      lowercase: true
    },

    // Custom Terms
    customTerms: {
      type: String,
      trim: true
    },

    // Bank Details
    bankName: {
      type: String,
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    swiftCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    qrCodeImage: {
      type: String // Store file path or URL
    },
    upiCodeImage: {
      type: String // Store file path or URL
    },

    // Contact Person Details
    contactPersonName: {
      type: String,
      trim: true
    },
    contactPersonEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    // Logo & Images
    logoImage: {
      type: String // Store file path or URL
    },
    backgroundImage: {
      type: String // Store file path or URL
    },
    signatureImage: {
      type: String // Store file path or URL
    }
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;