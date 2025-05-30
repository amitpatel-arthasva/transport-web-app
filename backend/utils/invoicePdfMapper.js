/**
 * Utility to map LorryReceipt model data to Invoice PDF template format
 */

const mapLorryReceiptToInvoiceData = (lorryReceiptData) => {
  // Helper function to safely access nested properties
  const safeGet = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };

  // Extract consignee address for invoice recipient
  const getRecipientAddress = () => {
    const address = [];
    if (safeGet(lorryReceiptData, 'consignee.address')) address.push(safeGet(lorryReceiptData, 'consignee.address'));
    if (safeGet(lorryReceiptData, 'consignee.city')) {
      const cityLine = `${safeGet(lorryReceiptData, 'consignee.city')}${safeGet(lorryReceiptData, 'consignee.pinCode') ? ' - ' + safeGet(lorryReceiptData, 'consignee.pinCode') : ''}`;
      address.push(cityLine);
    }
    if (safeGet(lorryReceiptData, 'consignee.state')) address.push(safeGet(lorryReceiptData, 'consignee.state'));
    return address;
  };

  // Extract goods details for invoice
  const getGoodsDetails = () => {
    const materials = safeGet(lorryReceiptData, 'materialDetails', []);
    const freightDetails = safeGet(lorryReceiptData, 'freightDetails', {});
    const charges = safeGet(freightDetails, 'charges', {});
    
    const goodsItems = [];
    let srCounter = 1;

    // Add main freight items from materials
    materials.forEach((material) => {
      const freightRate = safeGet(material, 'freightRate.value', 0);
      const otherCharges = safeGet(charges, 'loadingCharge', 0) + safeGet(charges, 'unloadingCharge', 0);
      
      goodsItems.push({
        sr: srCounter++,
        lrNo: safeGet(lorryReceiptData, 'lorryReceiptNumber'),
        from: safeGet(lorryReceiptData, 'truckDetails.from', 'TARAPUR'),
        to: safeGet(lorryReceiptData, 'consignee.city'),
        invNo: getInvoiceNumber(),
        rate: freightRate,
        otherCharges: otherCharges,
        freightAmt: freightRate + otherCharges
      });
    });

    // Add additional charges as separate line items if they exist
    if (safeGet(charges, 'doorDeliveryCharge', 0) > 0) {
      goodsItems.push({
        sr: srCounter++,
        lrNo: safeGet(lorryReceiptData, 'lorryReceiptNumber'),
        from: 'Door Delivery',
        to: 'Charges',
        invNo: getInvoiceNumber(),
        rate: safeGet(charges, 'doorDeliveryCharge', 0),
        otherCharges: 0,
        freightAmt: safeGet(charges, 'doorDeliveryCharge', 0)
      });
    }

    if (safeGet(charges, 'serviceCharge', 0) > 0) {
      goodsItems.push({
        sr: srCounter++,
        lrNo: safeGet(lorryReceiptData, 'lorryReceiptNumber'),
        from: 'Service',
        to: 'Charges',
        invNo: getInvoiceNumber(),
        rate: safeGet(charges, 'serviceCharge', 0),
        otherCharges: 0,
        freightAmt: safeGet(charges, 'serviceCharge', 0)
      });
    }

    return goodsItems;
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
  // Calculate total amount - use same logic as LorryReceipt model
  const calculateTotalAmount = () => {
    const freightDetails = safeGet(lorryReceiptData, 'freightDetails', {});
    
    // First try to use the pre-calculated totalFreight
    if (freightDetails.totalFreight) {
      return freightDetails.totalFreight;
    }
    
    // Fallback: calculate manually using the same logic as the LorryReceipt model
    const charges = safeGet(freightDetails, 'charges', {});
    
    // Calculate subTotal (basic freight + all charges)
    const subTotal = (safeGet(freightDetails, 'totalBasicFreight', 0)) + 
      (safeGet(charges, 'pickupCharge', 0)) + (safeGet(charges, 'doorDeliveryCharge', 0)) + 
      (safeGet(charges, 'loadingCharge', 0)) + (safeGet(charges, 'unloadingCharge', 0)) + 
      (safeGet(charges, 'packingCharge', 0)) + (safeGet(charges, 'unpackingCharge', 0)) + 
      (safeGet(charges, 'serviceCharge', 0)) + (safeGet(charges, 'cashOnDelivery', 0)) + 
      (safeGet(charges, 'dateOnDelivery', 0)) + (safeGet(charges, 'otherCharges', 0));
    
    // Calculate totalFreight (subTotal + GST + roundOff - TDS)
    const totalFreight = subTotal + 
      (safeGet(freightDetails, 'gstDetails.gstAmount', 0)) + 
      (safeGet(freightDetails, 'roundOff', 0)) - 
      (safeGet(freightDetails, 'tdsDetails.tdsAmount', 0));
    
    return Math.max(0, totalFreight); // Ensure non-negative amount
  };

  // Generate bill number from LR number
  const generateBillNumber = () => {
    const lrNumber = safeGet(lorryReceiptData, 'lorryReceiptNumber');
    return `TPR-${lrNumber}`;
  };
  // Map to Invoice PDF template format
  return {
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
    billNo: generateBillNumber(),
    location: "TARAPUR",
    date: new Date(safeGet(lorryReceiptData, 'date')).toLocaleDateString('en-GB'),
    recipient: {
      name: safeGet(lorryReceiptData, 'consignee.consigneeName'),
      address: getRecipientAddress()
    },
    goodsDetails: getGoodsDetails(),
    totalAmount: calculateTotalAmount(),
    remark: safeGet(lorryReceiptData, 'notes', ''),
    panNo: "AGTPV0112D",
    gstin: "27AGTPV0112D1ZG",
    serviceTaxPayableBy: safeGet(lorryReceiptData, 'freightDetails.gstDetails.gstFileAndPayBy', 'Consignor')
  };
};

module.exports = { mapLorryReceiptToInvoiceData };
