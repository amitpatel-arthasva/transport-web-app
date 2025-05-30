import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faPercentage, faCalculator, faCheck } from '@fortawesome/free-solid-svg-icons';

const Step3FreightDetails = ({ formData, updateFormData, errors }) => {
  const handleChargeChange = (e) => {
    const { name, value } = e.target;

    updateFormData({
      ...formData,
      freightDetails: {
        ...formData.freightDetails,
        charges: {
          ...formData.freightDetails.charges,
          [name]: value
        }
      }
    });
  };

  const handleGSTChange = (e) => {
    const { name, value } = e.target;
    
    updateFormData({
      ...formData,
      freightDetails: {
        ...formData.freightDetails,
        gstDetails: {
          ...formData.freightDetails.gstDetails,
          [name]: value
        }
      }
    });
  };

  const calculateTotalCharges = () => {
    const charges = formData.freightDetails.charges;
    return Object.values(charges).reduce((total, charge) => total + (parseFloat(charge) || 0), 0);
  };

  const handleRoundOffChange = (e) => {
    const { checked } = e.target;
    
    updateFormData({
      ...formData,
      freightDetails: {
        ...formData.freightDetails,
        roundOff: checked
      }
    });
  };

  // Calculate GST amount when GST type changes
  const calculateGST = (e) => {
    const gstRate = e.target.value;
    const totalCharges = calculateTotalCharges();
    
    let gstAmount = 0;
    if (gstRate !== 'NIL (On reverse charge)') {
      // Extract the percentage value from the enum
      const rate = parseFloat(gstRate.replace('%', ''));
      gstAmount = (totalCharges * rate) / 100;
    }
    
    updateFormData({
      ...formData,
      freightDetails: {
        ...formData.freightDetails,
        gstDetails: {
          ...formData.freightDetails.gstDetails,
          applicableGST: gstRate,
          gstAmount: gstAmount
        }
      }
    });
  };

  const calculateFinalTotal = () => {
    const deliveryCollection = calculateTotalCharges();
    const gstAmount = parseFloat(formData.freightDetails.gstDetails.gstAmount) || 0;
    let total = deliveryCollection + gstAmount;
    
    if (formData.freightDetails.roundOff) {
      total = Math.round(total);
    }
    
    return total;
  };

  return (
    <div className="space-y-8">
      {/* Freight Charges */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">
          Freight Charges
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Bilty Freight (₹)
            </label>
            <input
              type="number"
              name="biltyFreight"
              value={formData.freightDetails.charges.biltyFreight}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Delivery Charge (₹)
            </label>
            <input
              type="number"
              name="deliveryCharge"
              value={formData.freightDetails.charges.deliveryCharge}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Labour Charge (₹)
            </label>
            <input
              type="number"
              name="labourCharge"
              value={formData.freightDetails.charges.labourCharge}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Bilty Charge (₹)
            </label>
            <input
              type="number"
              name="biltyCharge"
              value={formData.freightDetails.charges.biltyCharge}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Halting Charge (₹)
            </label>
            <input
              type="number"
              name="haltingCharge"
              value={formData.freightDetails.charges.haltingCharge}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Warehouse Charge (₹)
            </label>
            <input
              type="number"
              name="warehouseCharge"
              value={formData.freightDetails.charges.warehouseCharge}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Local Transport Charge (₹)
            </label>
            <input
              type="number"
              name="localTransportCharge"
              value={formData.freightDetails.charges.localTransportCharge}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-400" />
              Other Charges (₹)
            </label>
            <input
              type="number"
              name="otherCharges"
              value={formData.freightDetails.charges.otherCharges}
              onChange={handleChargeChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-right">
            <span className="text-lg font-semibold text-gray-900">
              Delivery Collection: ₹{calculateTotalCharges().toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* GST & Additional Charges */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">
          GST & Additional Charges
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faPercentage} className="mr-2 text-primary-400" />
              Applicable GST
            </label>
            <select
              name="applicableGST"
              value={formData.freightDetails.gstDetails.applicableGST || 'NIL (On reverse charge)'}
              onChange={calculateGST}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
             <option value="NIL (On reverse charge)">NIL (On reverse charge)</option>
              <option value="5.0%">5.0%</option>
              <option value="12.0%">12.0%</option>
              <option value="18.0%">18.0%</option>
              <option value="28.0%">28.0%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCalculator} className="mr-2 text-primary-400" />
              GST Amount (₹)
            </label>
            <input
              type="number"
              name="gstAmount"
              value={formData.freightDetails.gstDetails.gstAmount || 0}
              onChange={handleGSTChange}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.freightDetails.roundOff || false}
              onChange={handleRoundOffChange}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faCheck} className="mr-2 text-primary-400" />
              Round off total freight to nearest rupee
            </span>
          </label>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900">
              Total Freight: ₹{calculateFinalTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3FreightDetails;
