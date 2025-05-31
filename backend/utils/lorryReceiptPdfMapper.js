/**
 * Utility to map LorryReceipt model data to PDF template format
 */

// Cache for static company data to avoid recreation
const STATIC_COMPANY_DATA = {
  companyName: "श्री दत्तगुरु रोड लाईन्स<br>Shree Dattaguru Road Lines",
  companyTagline: "Transport Contractors & Fleet Owners",
  jurisdiction: "SUBJECT TO PALGHAR JURISDICTION",
  serviceAreas: ["Daily Part Load Service to -", "Tarapur, Bhiwandi, Palghar,", "Vashi, Taloja, Kolgoan Genises"],
  copyType: "Consignor Copy",
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
  disclaimer: "We are not responsible for any type of damages, Leakage, Fire & Shortages. Kindly Insured by Consignor or Consignee"
};

// Cache for frequently used paths to avoid repeated string splitting
const PATH_CACHE = new Map();

// Function to clear cache for memory management
const clearPathCache = () => {
  PATH_CACHE.clear();
};

const mapLorryReceiptToPdfData = (lorryReceiptData) => {
  // Optimized helper function with module-level path cache
  const safeGet = (obj, path, defaultValue = '') => {
    if (!PATH_CACHE.has(path)) {
      PATH_CACHE.set(path, path.split('.'));
    }
    
    return PATH_CACHE.get(path).reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };
  // Optimized address extraction with early returns
  const getConsignorAddress = () => {
    const address = [];
    const consignorAddr = safeGet(lorryReceiptData, 'consignor.address');
    const consignorCity = safeGet(lorryReceiptData, 'consignor.city');
    const consignorPinCode = safeGet(lorryReceiptData, 'consignor.pinCode');
    const consignorState = safeGet(lorryReceiptData, 'consignor.state');
    
    if (consignorAddr) address.push(consignorAddr);
    if (consignorCity) {
      const cityLine = consignorPinCode ? `${consignorCity} - ${consignorPinCode}` : consignorCity;
      address.push(cityLine);
    }
    if (consignorState) address.push(consignorState);
    return address;
  };

  // Extract consignee address
  const getConsigneeAddress = () => {
    const address = [];
    const consigneeAddr = safeGet(lorryReceiptData, 'consignee.address');
    const consigneeCity = safeGet(lorryReceiptData, 'consignee.city');
    const consigneePinCode = safeGet(lorryReceiptData, 'consignee.pinCode');
    const consigneeState = safeGet(lorryReceiptData, 'consignee.state');
    
    if (consigneeAddr) address.push(consigneeAddr);
    if (consigneeCity) {
      const cityLine = consigneePinCode ? `${consigneeCity} - ${consigneePinCode}` : consigneeCity;
      address.push(cityLine);
    }
    if (consigneeState) address.push(consigneeState);
    return address;
  };

  // Extract delivery address with optimized logic
  const getDeliveryAddress = () => {
    const sameAsConsignee = safeGet(lorryReceiptData, 'deliveryDetails.sameAsConsignee', true);
    
    if (sameAsConsignee) {
      return getConsigneeAddress().join(', ');
    }
    
    const address = [];
    const deliveryAddr = safeGet(lorryReceiptData, 'deliveryDetails.address');
    const deliveryCity = safeGet(lorryReceiptData, 'deliveryDetails.city');
    const deliveryPinCode = safeGet(lorryReceiptData, 'deliveryDetails.pinCode');
    const deliveryState = safeGet(lorryReceiptData, 'deliveryDetails.state');
    
    if (deliveryAddr) address.push(deliveryAddr);
    if (deliveryCity) {
      const cityLine = deliveryPinCode ? `${deliveryCity} - ${deliveryPinCode}` : deliveryCity;
      address.push(cityLine);
    }
    if (deliveryState) address.push(deliveryState);
    return address.join(', ');
  };

  // Extract goods details
  const getGoodsDetails = () => {
    const materials = safeGet(lorryReceiptData, 'materialDetails', []);
    return materials.map((material, index) => ({
      nos: safeGet(material, 'numberOfArticles', ''),
      particulars: safeGet(material, 'materialName', ''),
      rateRs: safeGet(material, 'freightRate.value', 0),
      actualWeight: `${safeGet(material, 'actualWeight.value', '')} ${safeGet(material, 'actualWeight.unit', 'KG')}`,
      chargeableWeight: `${safeGet(material, 'chargedWeight.value', '')} ${safeGet(material, 'chargedWeight.unit', 'KG')}`
    }));
  };
  // Calculate charges with pre-extracted references
  const getCharges = () => {
    const freightDetails = safeGet(lorryReceiptData, 'freightDetails', {});
    const charges = safeGet(freightDetails, 'charges', {});
    
    // Pre-extract values to avoid repeated safeGet calls
    const loadingCharge = safeGet(charges, 'loadingCharge', 0);
    const unloadingCharge = safeGet(charges, 'unloadingCharge', 0);
    
    return {
      freight: safeGet(freightDetails, 'totalBasicFreight', 0),
      hamali: loadingCharge + unloadingCharge,
      aoc: safeGet(charges, 'otherCharges', 0),
      doorDelivery: safeGet(charges, 'doorDeliveryCharge', 0),
      collection: safeGet(charges, 'cashOnDelivery', 0),
      stCharge: safeGet(charges, 'serviceCharge', 20),
      extraLoading: safeGet(charges, 'pickupCharge', 0)
    };
  };

  // Get invoice details
  const getInvoiceDetails = () => {
    const invoiceDetails = safeGet(lorryReceiptData, 'invoiceAndEwayDetails.invoiceDetails', []);
    const ewayDetails = safeGet(lorryReceiptData, 'invoiceAndEwayDetails.ewayBillDetails', {});
    
    return {
      invNo: invoiceDetails.length > 0 ? safeGet(invoiceDetails[0], 'invoiceNumber', '') : '',
      chNo: safeGet(ewayDetails, 'ewayBillNumber', ''),
      invoiceDate: invoiceDetails.length > 0 ? safeGet(invoiceDetails[0], 'invoiceDate') : null
    };
  };
  const charges = getCharges();
  const total = Object.values(charges).reduce((sum, charge) => sum + Number(charge), 0);
  const invoiceDetails = getInvoiceDetails();
  // Map to PDF template format
  return {
    ...STATIC_COMPANY_DATA,
    
    consignor: {
      name: safeGet(lorryReceiptData, 'consignor.consignorName'),
      address: getConsignorAddress(),
      gstNumber: safeGet(lorryReceiptData, 'consignor.gstNumber'),
      contactNumber: safeGet(lorryReceiptData, 'consignor.contactNumber')
    },
    
    consignee: {
      name: safeGet(lorryReceiptData, 'consignee.consigneeName'),
      address: getConsigneeAddress(),
      gstNumber: safeGet(lorryReceiptData, 'consignee.gstNumber'),
      contactNumber: safeGet(lorryReceiptData, 'consignee.contactNumber')
    },
    
    cntNo: safeGet(lorryReceiptData, 'lorryReceiptNumber'),
    date: new Date(safeGet(lorryReceiptData, 'date')).toLocaleDateString('en-GB'),
    truckNo: safeGet(lorryReceiptData, 'truckDetails.truckNumber'),
    from: safeGet(lorryReceiptData, 'truckDetails.from', 'TARAPUR'),
    to: safeGet(lorryReceiptData, 'consignee.city'),
    
    driverDetails: {
      name: safeGet(lorryReceiptData, 'truckDetails.driverName'),
      mobile: safeGet(lorryReceiptData, 'truckDetails.driverMobile'),
      license: safeGet(lorryReceiptData, 'truckDetails.licenseNumber')
    },
    
    goodsDetails: getGoodsDetails(),
    charges: charges,
    
    paymentStatus: {
      paid: safeGet(lorryReceiptData, 'freightDetails.advanceDetails.advanceReceived', 0),
      toBeBill: 0, // Calculate based on business logic
      toPay: safeGet(lorryReceiptData, 'freightDetails.advanceDetails.remainingFreight', 0)
    },
    
    serviceTaxPayableBy: safeGet(lorryReceiptData, 'freightDetails.gstDetails.gstFileAndPayBy', 'Consignor'),
    invNo: invoiceDetails.invNo,
    chNo: invoiceDetails.chNo,
    invoiceDate: invoiceDetails.invoiceDate,
    total: total,    
    deliveryAt: getDeliveryAddress(),
    remarks: safeGet(lorryReceiptData, 'notes', '')
  };
};

module.exports = { mapLorryReceiptToPdfData, clearPathCache };
