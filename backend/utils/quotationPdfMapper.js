/**
 * Utility to map Quotation model data to PDF template format
 */

// Cache for static company data to avoid recreation
const STATIC_COMPANY_DATA = {
  companyName: "श्री दत्तगुरु रोड लाईन्स<br>Shree Dattaguru Road Lines",
  companyTagline: "Transport Contractors & Fleet Owners",
  tarapurAddress: [
    "Plot No. W-4,",
    "Camlin Naka,",
    "MIDC, Tarapur.",
    "M.: 9823364283/",
    "    9168027869/",
    "    7276272828",
  ],
  bhiwandiAddress: [
    "Godown No. A-2,",
    "Gali No. 2,",
    "Opp. Capital Roadlines,",
    "Khandagale Estate,",
    "Purna Village, Bhiwandi.",
    "M.: 7507844317/",
    "    9168027868",
  ],
  panNo: "AGTPV0112D",
  gstin: "27AGTPV0112D1ZG",
  disclaimer: "This quotation is subject to our standard terms and conditions. Rates are inclusive of vehicle insurance but exclusive of any transit insurance which shall be arranged by the customer if required.",
  contactNumbers: ["9823364283", "9168027869", "7276272828"],
  emailId: "shreesattagururoadlines@gmail.com"
};

// Cache for frequently used paths to avoid repeated string splitting
const PATH_CACHE = new Map();

// Function to clear cache for memory management
const clearPathCache = () => {
  PATH_CACHE.clear();
};

const mapQuotationToPdfData = (quotationData) => {
  // Optimized helper function with module-level path cache
  const safeGet = (obj, path, defaultValue = '') => {
    if (!PATH_CACHE.has(path)) {
      PATH_CACHE.set(path, path.split('.'));
    }
    
    return PATH_CACHE.get(path).reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };
  // Extract company address with optimized logic
  const getCompanyAddress = () => {
    const address = [];
    const companyAddr = safeGet(quotationData, 'quoteToCompany.address');
    const companyCity = safeGet(quotationData, 'quoteToCompany.city');
    const companyPinCode = safeGet(quotationData, 'quoteToCompany.pinCode');
    const companyState = safeGet(quotationData, 'quoteToCompany.state');
    
    if (companyAddr) address.push(companyAddr);
    if (companyCity) {
      const cityLine = companyPinCode ? `${companyCity} - ${companyPinCode}` : companyCity;
      address.push(cityLine);
    }
    if (companyState) address.push(companyState);
    return address;
  };
  // Extract material details for table with optimized mapping
  const getMaterialDetails = () => {
    const materials = safeGet(quotationData, 'materialDetails', []);
    return materials.map((material, index) => {
      const weightValue = safeGet(material, 'weight.value', '');
      const weightUnit = safeGet(material, 'weight.unit', 'KG');
      const lengthFt = safeGet(material, 'dimensions.lengthFt');
      const widthFt = safeGet(material, 'dimensions.widthFt');
      const heightFt = safeGet(material, 'dimensions.heightFt');
      
      return {
        sr: index + 1,
        materialName: safeGet(material, 'materialName', ''),
        packagingType: safeGet(material, 'packagingType', ''),
        weight: weightValue ? `${weightValue} ${weightUnit}` : '',
        numberOfArticles: safeGet(material, 'numberOfArticles', ''),
        dimensions: lengthFt ? `${lengthFt}' x ${widthFt}' x ${heightFt}'` : ''
      };
    });
  };
  // Extract vehicle details for table with optimized mapping
  const getVehicleDetails = () => {
    const vehicles = safeGet(quotationData, 'vehicleDetails', []);
    return vehicles.map((vehicle, index) => {
      const weightValue = safeGet(vehicle, 'weightGuarantee.value', '');
      const weightUnit = safeGet(vehicle, 'weightGuarantee.unit', 'KG');
      const freightValue = safeGet(vehicle, 'freightRate.value', 0);
      const freightUnit = safeGet(vehicle, 'freightRate.unit', '');
      const lengthFt = safeGet(vehicle, 'dimensions.lengthFt');
      const widthFt = safeGet(vehicle, 'dimensions.widthFt');
      const heightFt = safeGet(vehicle, 'dimensions.heightFt');
      
      return {
        sr: index + 1,
        vehicleType: safeGet(vehicle, 'vehicleType', ''),
        weightGuarantee: weightValue ? `${weightValue} ${weightUnit}` : '',
        freightRate: `₹${freightValue} ${freightUnit}`,
        dimensions: lengthFt ? `${lengthFt}' x ${widthFt}' x ${heightFt}'` : '',
        numberOfTrucks: safeGet(vehicle, 'numberOfTrucks', 1)
      };
    });
  };
  // Calculate freight charges breakdown with pre-extracted references
  const getFreightBreakdown = () => {
    const freightBreakup = safeGet(quotationData, 'freightBreakup', {});
    const extraCharges = safeGet(freightBreakup, 'extraCharges', {});
    
    // Pre-extract values to avoid repeated safeGet calls
    const baseRate = safeGet(freightBreakup, 'rate.value', 0);
    const extraChargesTotal = safeGet(extraCharges, 'totalExtraCharges', 0);
    const gstAmount = safeGet(freightBreakup, 'gstAmount', 0);
    const totalWithGst = safeGet(freightBreakup, 'totalFreightWithGst', 0);
    
    return {
      baseRate: baseRate,
      rateType: safeGet(freightBreakup, 'rate.type', 'Fixed'),
      loadingCharge: safeGet(extraCharges, 'loadingCharge', 0),
      unloadingCharge: safeGet(extraCharges, 'unloadingCharge', 0),
      doorPickupCharge: safeGet(extraCharges, 'doorPickupCharge', 0),
      doorDeliveryCharge: safeGet(extraCharges, 'doorDeliveryCharge', 0),
      packingCharge: safeGet(extraCharges, 'packingCharge', 0),
      unpackingCharge: safeGet(extraCharges, 'unpackingCharge', 0),
      tollTax: safeGet(extraCharges, 'tollTax', 0),
      otherCharges: safeGet(extraCharges, 'otherCharges', 0),
      subtotal: baseRate + extraChargesTotal,
      gstRate: safeGet(freightBreakup, 'applicableGST', 'NIL'),
      gstAmount: gstAmount,
      totalWithGst: totalWithGst || (baseRate + extraChargesTotal + gstAmount)
    };
  };
  // Get payment terms with optimized string concatenation
  const getPaymentTerms = () => {
    const paymentTerms = safeGet(quotationData, 'paymentTerms', {});
    const customTerms = safeGet(paymentTerms, 'customTerms', {});
    
    // Pre-extract custom terms values
    const advancePaidValue = safeGet(customTerms, 'advancePaidAmount.value', 0);
    const advancePaidType = safeGet(customTerms, 'advancePaidAmount.type');
    const afterLoadingValue = safeGet(customTerms, 'afterLoading.value', 0);
    const afterLoadingType = safeGet(customTerms, 'afterLoading.type');
    const afterDeliveryValue = safeGet(customTerms, 'afterDelivery.value', 0);
    const afterDeliveryType = safeGet(customTerms, 'afterDelivery.type');
    const afterPODValue = safeGet(customTerms, 'afterPOD.value', 0);
    const afterPODType = safeGet(customTerms, 'afterPOD.type');
    
    return {
      payBy: safeGet(paymentTerms, 'payBy', 'Consignor'),
      driverCashRequired: safeGet(paymentTerms, 'driverCashRequired', 0),
      advancePaid: advancePaidType === '%' ? `${advancePaidValue}%` : `${advancePaidValue}`,
      afterLoading: afterLoadingType === '%' ? `${afterLoadingValue}%` : `${afterLoadingValue}`,
      afterDelivery: afterDeliveryType === '%' ? `${afterDeliveryValue}%` : `${afterDeliveryValue}`,
      afterPOD: afterPODType === '%' ? `${afterPODValue}%` : `${afterPODValue}`,
      paymentRemark: safeGet(paymentTerms, 'paymentRemark', '')
    };
  };
  // Get validity details with optimized date formatting
  const getValidityDetails = () => {
    const validity = safeGet(quotationData, 'quotationValidity', {});
    const validUpTo = safeGet(validity, 'validUpTo', {});
    
    let validityText = '';
    const validUpToType = validUpTo.type;
    const validUpToValue = validUpTo.value;
    
    if (validUpToType === 'Date' && validUpToValue) {
      validityText = new Date(validUpToValue).toLocaleDateString('en-GB');
    } else if (validUpToType === 'Days' && validUpToValue) {
      validityText = `${validUpToValue} days from quotation date`;
    }
    
    const expiryDate = safeGet(validity, 'expiryDate');
    
    return {
      validUpTo: validityText,
      expiryDate: expiryDate ? new Date(expiryDate).toLocaleDateString('en-GB') : ''
    };
  };
  const freightBreakdown = getFreightBreakdown();
  const paymentTerms = getPaymentTerms();
  const validityDetails = getValidityDetails();
  
  // Pre-compute values to avoid repeated calls
  const quotationId = safeGet(quotationData, '_id', '').toString();
  const quotationNumber = quotationId ? `QUO-${quotationId.slice(-6).toUpperCase()}` : '';
  const createdAt = safeGet(quotationData, 'createdAt');
  const quotationDate = createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : '';
  
  // Pre-extract inquiry details
  const inquiryDate = safeGet(quotationData, 'quoteToCompany.inquiryDate');
  const formattedInquiryDate = inquiryDate ? new Date(inquiryDate).toLocaleDateString('en-GB') : '';
  
  // Pre-extract trip details
  const pickupPoints = safeGet(quotationData, 'tripDetails.pickupPoints', []);
  const deliveryPoints = safeGet(quotationData, 'tripDetails.deliveryPoints', []);
  const loadingDate = safeGet(quotationData, 'tripDetails.loadingDate');
  const formattedLoadingDate = loadingDate ? new Date(loadingDate).toLocaleDateString('en-GB') : '';

  // Map to PDF template format
  return {
    ...STATIC_COMPANY_DATA,
    quotationNumber: quotationNumber,
    quotationDate: quotationDate,
    
    // Company being quoted to
    quoteToCompany: {
      name: safeGet(quotationData, 'quoteToCompany.companyName'),
      address: getCompanyAddress(),
      gstNumber: safeGet(quotationData, 'quoteToCompany.gstNumber'),
      contactNumber: safeGet(quotationData, 'quoteToCompany.contactNumber'),      inquiryVia: safeGet(quotationData, 'quoteToCompany.inquiryVia'),
      inquiryDate: formattedInquiryDate,
      inquiryByPerson: safeGet(quotationData, 'quoteToCompany.inquiryByPerson'),
      referenceDocumentId: safeGet(quotationData, 'quoteToCompany.referenceDocumentId')
    },
    
    // Trip details
    tripDetails: {
      fullOrPartLoad: safeGet(quotationData, 'tripDetails.fullOrPartLoad'),
      from: safeGet(quotationData, 'tripDetails.from'),
      to: safeGet(quotationData, 'tripDetails.to'),      pickupPoints: pickupPoints.join(', '),
      deliveryPoints: deliveryPoints.join(', '),
      loadingDate: formattedLoadingDate,
      tripType: safeGet(quotationData, 'tripDetails.tripType')
    },
    
    // Material and vehicle details
    materialDetails: getMaterialDetails(),
    vehicleDetails: getVehicleDetails(),
    
    // Freight breakdown
    freightBreakdown: freightBreakdown,
    
    // Payment terms
    paymentTerms: paymentTerms,
    
    // Validity
    validity: validityDetails,
    
    // Demurrage
    demurrage: {
      chargePerHour: safeGet(quotationData, 'demurrage.chargePerHour.value', 0),
      chargeType: safeGet(quotationData, 'demurrage.chargePerHour.type', 'Per Hour'),      applicableAfterHours: safeGet(quotationData, 'demurrage.applicableAfterHours', 0)
    }
  };
};

module.exports = { mapQuotationToPdfData, clearPathCache };
