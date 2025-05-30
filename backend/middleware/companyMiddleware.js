const Company = require('../models/Company');

// Middleware to automatically create company when quotation is saved
const createCompanyFromQuotation = async function(next) {
  try {
    if (this.quoteToCompany && this.quoteToCompany.companyName) {
      const companyData = {
        companyName: this.quoteToCompany.companyName,
        gstNumber: this.quoteToCompany.gstNumber,
        address: this.quoteToCompany.address,
        city: this.quoteToCompany.city,
        state: this.quoteToCompany.state,
        country: this.quoteToCompany.country,
        pinCode: this.quoteToCompany.pinCode,
        phone: this.quoteToCompany.contactNumber
      };

      // Try to create or update company (upsert)
      await Company.findOneAndUpdate(
        { 
          companyName: companyData.companyName,
          $or: [
            { gstNumber: companyData.gstNumber },
            { gstNumber: { $exists: false } }
          ]
        },
        companyData,
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true
        }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to automatically create companies when lorry receipt is saved
const createCompanyFromLorryReceipt = async function(next) {
  try {
    const companiesToCreate = [];

    // Create company from consignor data
    if (this.consignor && this.consignor.consignorName) {
      const consignorData = {
        companyName: this.consignor.consignorName,
        gstNumber: this.consignor.gstNumber,
        address: this.consignor.address,
        city: this.consignor.city,
        state: this.consignor.state,
        country: this.consignor.country,
        pinCode: this.consignor.pinCode,
        phone: this.consignor.contactNumber,
        email: this.consignor.email
      };
      companiesToCreate.push(consignorData);
    }

    // Create company from consignee data
    if (this.consignee && this.consignee.consigneeName) {
      const consigneeData = {
        companyName: this.consignee.consigneeName,
        gstNumber: this.consignee.gstNumber,
        address: this.consignee.address,
        city: this.consignee.city,
        state: this.consignee.state,
        country: this.consignee.country,
        pinCode: this.consignee.pinCode,
        phone: this.consignee.contactNumber,
        email: this.consignee.email
      };
      companiesToCreate.push(consigneeData);
    }

    // Create company from loading address if different from consignor
    if (this.loadingAddress && !this.loadingAddress.sameAsConsignor && this.loadingAddress.partyName) {
      const loadingAddressData = {
        companyName: this.loadingAddress.partyName,
        gstNumber: this.loadingAddress.gstNumber,
        address: this.loadingAddress.address,
        city: this.loadingAddress.city,
        state: this.loadingAddress.state,
        country: this.loadingAddress.country,
        pinCode: this.loadingAddress.pinCode,
        phone: this.loadingAddress.contactNumber
      };
      companiesToCreate.push(loadingAddressData);
    }

    // Create company from delivery address if different from consignee
    if (this.deliveryDetails && !this.deliveryDetails.sameAsConsignee && this.deliveryDetails.companyName) {
      const deliveryAddressData = {
        companyName: this.deliveryDetails.companyName,
        gstNumber: this.deliveryDetails.gstNumber,
        address: this.deliveryDetails.address,
        city: this.deliveryDetails.city,
        state: this.deliveryDetails.state,
        country: this.deliveryDetails.country,
        pinCode: this.deliveryDetails.pinCode,
        phone: this.deliveryDetails.contactNumber
      };
      companiesToCreate.push(deliveryAddressData);
    }

    // Create or update all companies
    for (const companyData of companiesToCreate) {
      if (companyData.companyName) {
        await Company.findOneAndUpdate(
          { 
            companyName: companyData.companyName,
            $or: [
              { gstNumber: companyData.gstNumber },
              { gstNumber: { $exists: false } },
              { gstNumber: null },
              { gstNumber: "" }
            ]
          },
          companyData,
          { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert: true
          }
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to automatically create company when loading slip is saved
const createCompanyFromLoadingSlip = async function(next) {
  try {
    if (this.companyDetails && this.companyDetails.companyName) {
      const companyData = {
        companyName: this.companyDetails.companyName,
        gstNumber: this.companyDetails.gstNumber,
        address: this.companyDetails.address,
        city: this.companyDetails.city,
        state: this.companyDetails.state,
        country: this.companyDetails.country,
        pinCode: this.companyDetails.pinCode,
        phone: this.companyDetails.contactNumber
      };

      // Try to create or update company (upsert)
      await Company.findOneAndUpdate(
        { 
          companyName: companyData.companyName,
          $or: [
            { gstNumber: companyData.gstNumber },
            { gstNumber: { $exists: false } },
            { gstNumber: null },
            { gstNumber: "" }
          ]
        },
        companyData,
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true
        }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to automatically create companies when delivery slip is saved
const createCompanyFromDeliverySlip = async function(next) {
  try {
    const companiesToCreate = [];

    // Create company from sender data
    if (this.partyDetails && this.partyDetails.sender && this.partyDetails.sender.senderName) {
      const senderData = {
        companyName: this.partyDetails.sender.senderName,
        phone: this.partyDetails.sender.senderContactNumber
      };
      companiesToCreate.push(senderData);
    }

    // Create company from receiver data
    if (this.partyDetails && this.partyDetails.receiver && this.partyDetails.receiver.receiverName) {
      const receiverData = {
        companyName: this.partyDetails.receiver.receiverName,
        phone: this.partyDetails.receiver.receiverContactNumber
      };
      companiesToCreate.push(receiverData);
    }

    // Create or update all companies
    for (const companyData of companiesToCreate) {
      if (companyData.companyName) {
        await Company.findOneAndUpdate(
          { 
            companyName: companyData.companyName,
            $or: [
              { phone: companyData.phone },
              { phone: { $exists: false } },
              { phone: null },
              { phone: "" }
            ]
          },
          companyData,
          { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert: true
          }
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompanyFromQuotation,
  createCompanyFromLorryReceipt,
  createCompanyFromLoadingSlip,
  createCompanyFromDeliverySlip
};
