/**
 * Utility to map LorryReceipt model data to Invoice PDF template format
 */

// Cache for static company data to avoid recreation
const STATIC_COMPANY_DATA = {
  companyName: "श्री दत्तगुरु रोड लाईन्स<br>Shree Dattaguru Road Lines",
  companyTagline: "Transport Contractors & Fleet Owners",
  companyAddress: "Plot No. W - 4, Camlin Naka, MIDC, Tarapur.",
  contactNumbers: ["9823364283", "9168027869", "7276272828"],
  serviceDetails: [
    "Daily Part Load Service to -",
    "Tarapur, Bhiwandi, Palghar,",
    "Vashi, Taloja, Kolgoan Genises",
    "& Full Load to all over India",
  ],
  location: "TARAPUR",
  panNo: "AGTPV0112D",
  gstin: "27AGTPV0112D1ZG"
};

// Cache for frequently used paths to avoid repeated string splitting
const PATH_CACHE = new Map();

// Function to clear cache for memory management
const clearPathCache = () => {
  PATH_CACHE.clear();
};

const mapLorryReceiptToInvoiceData = (lorryReceiptData) => {
  // Optimized helper function with module-level path cache
  const safeGet = (obj, path, defaultValue = '') => {
    if (!PATH_CACHE.has(path)) {
      PATH_CACHE.set(path, path.split('.'));
    }
    
    return PATH_CACHE.get(path).reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };
  // Extract consignee address for invoice recipient with optimized logic
  const getRecipientAddress = () => {
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
  // Get invoice number from invoice details or generate from LR number
  const getInvoiceNumber = () => {
    const invoiceDetails = safeGet(lorryReceiptData, 'invoiceAndEwayDetails.invoiceDetails', []);
    if (invoiceDetails.length > 0) {
      return safeGet(invoiceDetails[0], 'invoiceNumber', '');
    }
    // Generate invoice number from LR number
    return `INV-${safeGet(lorryReceiptData, 'lorryReceiptNumber')}`;
  };

  // Extract goods details for invoice with optimized processing
  const getGoodsDetails = () => {
    const materials = safeGet(lorryReceiptData, 'materialDetails', []);
    const freightDetails = safeGet(lorryReceiptData, 'freightDetails', {});
    const charges = safeGet(freightDetails, 'charges', {});
    const invoiceNumber = getInvoiceNumber();
    const lrNumber = safeGet(lorryReceiptData, 'lorryReceiptNumber');
    const fromLocation = safeGet(lorryReceiptData, 'truckDetails.from', 'TARAPUR');
    const toLocation = safeGet(lorryReceiptData, 'consignee.city');
    
    const goodsItems = [];
    let srCounter = 1;

    // Add main freight items from materials
    materials.forEach((material) => {
      const freightRate = safeGet(material, 'freightRate.value', 0);
      const loadingCharge = safeGet(charges, 'loadingCharge', 0);
      const unloadingCharge = safeGet(charges, 'unloadingCharge', 0);
      const otherCharges = loadingCharge + unloadingCharge;
      
      goodsItems.push({
        sr: srCounter++,
        lrNo: lrNumber,
        from: fromLocation,
        to: toLocation,
        invNo: invoiceNumber,
        rate: freightRate,
        otherCharges: otherCharges,
        freightAmt: freightRate + otherCharges
      });
    });

    // Add additional charges as separate line items if they exist
    const doorDeliveryCharge = safeGet(charges, 'doorDeliveryCharge', 0);
    if (doorDeliveryCharge > 0) {
      goodsItems.push({
        sr: srCounter++,
        lrNo: lrNumber,
        from: 'Door Delivery',
        to: 'Charges',
        invNo: invoiceNumber,
        rate: doorDeliveryCharge,
        otherCharges: 0,
        freightAmt: doorDeliveryCharge
      });
    }

    const serviceCharge = safeGet(charges, 'serviceCharge', 0);
    if (serviceCharge > 0) {
      goodsItems.push({
        sr: srCounter++,
        lrNo: lrNumber,
        from: 'Service',
        to: 'Charges',
        invNo: invoiceNumber,
        rate: serviceCharge,
        otherCharges: 0,
        freightAmt: serviceCharge
      });
    }

    return goodsItems;
  };  // Calculate total amount with optimized logic - use same logic as LorryReceipt model
  const calculateTotalAmount = () => {
    const freightDetails = safeGet(lorryReceiptData, 'freightDetails', {});
    
    // First try to use the pre-calculated totalFreight
    const totalFreight = freightDetails.totalFreight;
    if (totalFreight) {
      return totalFreight;
    }
    
    // Fallback: calculate manually using the same logic as the LorryReceipt model
    const charges = safeGet(freightDetails, 'charges', {});
    
    // Pre-extract charge values
    const totalBasicFreight = safeGet(freightDetails, 'totalBasicFreight', 0);
    const pickupCharge = safeGet(charges, 'pickupCharge', 0);
    const doorDeliveryCharge = safeGet(charges, 'doorDeliveryCharge', 0);
    const loadingCharge = safeGet(charges, 'loadingCharge', 0);
    const unloadingCharge = safeGet(charges, 'unloadingCharge', 0);
    const packingCharge = safeGet(charges, 'packingCharge', 0);
    const unpackingCharge = safeGet(charges, 'unpackingCharge', 0);
    const serviceCharge = safeGet(charges, 'serviceCharge', 0);
    const cashOnDelivery = safeGet(charges, 'cashOnDelivery', 0);
    const dateOnDelivery = safeGet(charges, 'dateOnDelivery', 0);
    const otherCharges = safeGet(charges, 'otherCharges', 0);
    
    // Calculate subTotal (basic freight + all charges)
    const subTotal = totalBasicFreight + pickupCharge + doorDeliveryCharge + 
      loadingCharge + unloadingCharge + packingCharge + unpackingCharge + 
      serviceCharge + cashOnDelivery + dateOnDelivery + otherCharges;
    
    // Calculate totalFreight (subTotal + GST + roundOff - TDS)
    const gstAmount = safeGet(freightDetails, 'gstDetails.gstAmount', 0);
    const roundOff = safeGet(freightDetails, 'roundOff', 0);
    const tdsAmount = safeGet(freightDetails, 'tdsDetails.tdsAmount', 0);
    
    const calculatedTotal = subTotal + gstAmount + roundOff - tdsAmount;
    
    return Math.max(0, calculatedTotal); // Ensure non-negative amount
  };

  // Generate bill number from LR number
  const generateBillNumber = () => {
    const lrNumber = safeGet(lorryReceiptData, 'lorryReceiptNumber');
    return `TPR-${lrNumber}`;
  };
  
  // Pre-compute frequently used values
  const lorryReceiptDate = safeGet(lorryReceiptData, 'date');
  const formattedDate = lorryReceiptDate ? new Date(lorryReceiptDate).toLocaleDateString('en-GB') : '';
  
  // Map to Invoice PDF template format
  return {
    ...STATIC_COMPANY_DATA,
    billNo: generateBillNumber(),
    date: formattedDate,
    recipient: {
      name: safeGet(lorryReceiptData, 'consignee.consigneeName'),
      address: getRecipientAddress()
    },    goodsDetails: getGoodsDetails(),
    totalAmount: calculateTotalAmount(),
    remark: safeGet(lorryReceiptData, 'notes', ''),
    serviceTaxPayableBy: safeGet(lorryReceiptData, 'freightDetails.gstDetails.gstFileAndPayBy', 'Consignor')
  };
};

module.exports = { mapLorryReceiptToInvoiceData, clearPathCache };
