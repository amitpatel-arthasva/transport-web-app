/**
 * Utility to map LorryReceipt model data to PDF template format
 */

const mapLorryReceiptToPdfData = (lorryReceiptData) => {
  // Helper function to safely access nested properties
  const safeGet = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };

  // Extract consignor address
  const getConsignorAddress = () => {
    const address = [];
    if (safeGet(lorryReceiptData, 'consignor.address')) address.push(safeGet(lorryReceiptData, 'consignor.address'));
    if (safeGet(lorryReceiptData, 'consignor.city')) {
      const cityLine = `${safeGet(lorryReceiptData, 'consignor.city')}${safeGet(lorryReceiptData, 'consignor.pinCode') ? ' - ' + safeGet(lorryReceiptData, 'consignor.pinCode') : ''}`;
      address.push(cityLine);
    }
    if (safeGet(lorryReceiptData, 'consignor.state')) address.push(safeGet(lorryReceiptData, 'consignor.state'));
    return address;
  };

  // Extract consignee address
  const getConsigneeAddress = () => {
    const address = [];
    if (safeGet(lorryReceiptData, 'consignee.address')) address.push(safeGet(lorryReceiptData, 'consignee.address'));
    if (safeGet(lorryReceiptData, 'consignee.city')) {
      const cityLine = `${safeGet(lorryReceiptData, 'consignee.city')}${safeGet(lorryReceiptData, 'consignee.pinCode') ? ' - ' + safeGet(lorryReceiptData, 'consignee.pinCode') : ''}`;
      address.push(cityLine);
    }
    if (safeGet(lorryReceiptData, 'consignee.state')) address.push(safeGet(lorryReceiptData, 'consignee.state'));
    return address;
  };

  // Extract delivery address
  const getDeliveryAddress = () => {
    if (safeGet(lorryReceiptData, 'deliveryDetails.sameAsConsignee', true)) {
      return getConsigneeAddress().join(', ');
    } else {
      const address = [];
      if (safeGet(lorryReceiptData, 'deliveryDetails.address')) address.push(safeGet(lorryReceiptData, 'deliveryDetails.address'));
      if (safeGet(lorryReceiptData, 'deliveryDetails.city')) {
        const cityLine = `${safeGet(lorryReceiptData, 'deliveryDetails.city')}${safeGet(lorryReceiptData, 'deliveryDetails.pinCode') ? ' - ' + safeGet(lorryReceiptData, 'deliveryDetails.pinCode') : ''}`;
        address.push(cityLine);
      }
      if (safeGet(lorryReceiptData, 'deliveryDetails.state')) address.push(safeGet(lorryReceiptData, 'deliveryDetails.state'));
      return address.join(', ');
    }
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

  // Calculate charges
  const getCharges = () => {
    const freightDetails = safeGet(lorryReceiptData, 'freightDetails', {});
    const charges = safeGet(freightDetails, 'charges', {});
    
    return {
      freight: safeGet(freightDetails, 'totalBasicFreight', 0),
      hamali: safeGet(charges, 'loadingCharge', 0) + safeGet(charges, 'unloadingCharge', 0),
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
    companyName: "श्री दत्तगुरु रोड लाईन्स<br>Shree Dattaguru Road Lines",
    companyTagline: "Transport Contractors & Fleet Owners",
    jurisdiction: "SUBJECT TO PALGHAR JURISDICTION",
    serviceAreas: ["Daily Part Load Service to -", "Tarapur, Bhiwandi, Palghar,", "Vashi, Taloja, Kolgoan Genises"],
    copyType: "Consignor Copy",
    
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
    remarks: safeGet(lorryReceiptData, 'notes', ''),
    
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
};

module.exports = { mapLorryReceiptToPdfData };
