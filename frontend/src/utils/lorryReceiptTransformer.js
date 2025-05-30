// Utility function to transform lorry receipt data to template format
export const transformLorryReceiptData = (lorryReceipt) => {
  // Validate input data
  if (!lorryReceipt || typeof lorryReceipt !== 'object') {
    console.error('Invalid lorryReceipt data:', lorryReceipt);
    throw new Error('Lorry receipt data is missing or invalid');
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Helper function to get address array
  const getAddressArray = (addressObj) => {
    if (!addressObj) return [''];
    
    const addressParts = [];
    if (addressObj.address) addressParts.push(addressObj.address);
    if (addressObj.city && addressObj.state) {
      addressParts.push(`${addressObj.city}, ${addressObj.state}`);
    }
    if (addressObj.pinCode) {
      addressParts[addressParts.length - 1] += ` - ${addressObj.pinCode}`;
    }
    
    return addressParts.length > 0 ? addressParts : [''];
  };

  // Transform goods details from material details
  const transformGoodsDetails = (materialDetails) => {
    if (!materialDetails || materialDetails.length === 0) return [];
    
    return materialDetails.map(material => ({
      nos: material.quantity || '',
      particulars: material.materialName || '',
      rateRs: material.freightRate?.value || 0,
      actualWeight: material.actualWeight?.value || 0,
      chargeableWeight: material.chargedWeight?.value || 0
    }));
  };

  // Transform charges from freight details
  const transformCharges = (freightDetails) => {
    if (!freightDetails || !freightDetails.charges) {
      return {
        freight: 0,
        hamali: 0,
        aoc: 0,
        doorDelivery: 0,
        collection: 0,
        stCharge: 0,
        extraLoading: 0
      };
    }

    const charges = freightDetails.charges;
    return {
      freight: freightDetails.totalBasicFreight || 0,
      hamali: charges.loadingCharge || 0,
      aoc: charges.pickupCharge || 0,
      doorDelivery: charges.doorDeliveryCharge || 0,
      collection: charges.cashOnDelivery || 0,
      stCharge: charges.serviceCharge || 0,
      extraLoading: charges.otherCharges || 0
    };
  };

  // Calculate payment status (basic implementation)
  const calculatePaymentStatus = (freightDetails) => {
    const totalFreight = freightDetails?.totalFreight || 0;
    const advanceReceived = freightDetails?.advanceDetails?.advanceReceived || 0;
    
    return {
      paid: advanceReceived,
      toBeBill: 0, // This would need business logic
      toPay: Math.max(0, totalFreight - advanceReceived)
    };
  };

  // Get invoice details
  const getInvoiceDetails = (invoiceAndEwayDetails) => {
    const firstInvoice = invoiceAndEwayDetails?.invoiceDetails?.[0];
    return {
      invNo: firstInvoice?.invoiceNumber || '',
      chNo: invoiceAndEwayDetails?.ewayBillDetails?.ewayBillNumber || ''
    };
  };
  
  // Get driver details with comprehensive validation
  const getDriverDetails = (truckDetails) => {
    // Ensure we always return a valid object even if truckDetails is undefined
    const safeDriverDetails = {
      driverName: 'N/A',
      driverMobile: 'N/A',
      driverLicense: 'N/A'
    };

    if (truckDetails && typeof truckDetails === 'object') {
      safeDriverDetails.driverName = truckDetails.driverName || 'N/A';
      safeDriverDetails.driverMobile = truckDetails.driverMobile || 'N/A';
      safeDriverDetails.driverLicense = truckDetails.driverLicense || 'N/A';
    }

    return safeDriverDetails;
  };
  // Transform the data with try-catch for safety
  try {
    const transformed = {
      companyName: "श्री दत्तगुरु रोड लाईन्स\nShree Dattaguru Road Lines",
      companyTagline: "Transport Contractors & Fleet Owners",
      jurisdiction: "SUBJECT TO PALGHAR JURISDICTION",
      serviceAreas: [
        "Daily Part Load Service to -",
        "Tarapur, Bhiwandi, Palghar,",
        "Vashi, Taloja, Kolgoan Genises"
      ],
      copyType: "Consignor Copy",
      
      // Consignor details
      consignor: {
        name: lorryReceipt.consignor?.consignorName || '',
        address: getAddressArray(lorryReceipt.consignor)
      },
      
      // Consignee details
      consignee: {
        name: lorryReceipt.consignee?.consigneeName || '',
        address: getAddressArray(lorryReceipt.consignee)
      },
      
      // Basic details
      cntNo: `TPR - ${lorryReceipt.lorryReceiptNumber || ''}`,
      date: formatDate(lorryReceipt.date),
      truckNo: lorryReceipt.truckDetails?.truckNumber || '',
      from: lorryReceipt.truckDetails?.from || 'TARAPUR',
      to: lorryReceipt.deliveryDetails?.city || lorryReceipt.consignee?.city || '',
      
      // Goods and charges
      goodsDetails: transformGoodsDetails(lorryReceipt.materialDetails),
      charges: transformCharges(lorryReceipt.freightDetails),
      paymentStatus: calculatePaymentStatus(lorryReceipt.freightDetails),
      
      // Service tax
      serviceTaxPayableBy: lorryReceipt.freightDetails?.gstDetails?.gstFileAndPayBy || "Consignor",
      
      // Invoice details
      ...getInvoiceDetails(lorryReceipt.invoiceAndEwayDetails),
      
      // Driver details with guaranteed properties
      driverName: lorryReceipt.truckDetails?.driverName || 'N/A',
      driverMobile: lorryReceipt.truckDetails?.driverMobile || 'N/A',
      driverLicense: lorryReceipt.truckDetails?.driverLicense || 'N/A',
      
      // Total and other details
      total: lorryReceipt.freightDetails?.totalFreight || 0,
      deliveryAt: lorryReceipt.deliveryDetails?.address || '',
      remarks: lorryReceipt.notes || '',
      
      // Company addresses (static for now)
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

    // Log the transformed data to debug
    console.log('Transformed lorry receipt data:', JSON.stringify(transformed, null, 2));
    
    return transformed;
  } catch (error) {
    console.error('Error transforming lorry receipt data:', error);
    throw new Error(`Data transformation failed: ${error.message}`);
  }
};
