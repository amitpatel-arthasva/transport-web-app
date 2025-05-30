import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Step3VehicleFreightDetails = ({ 
  formData, 
  handleInputChange, 
  handleArrayInputChange, 
  addVehicle, 
  removeVehicle 
}) => {  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    vehicleDimensions: {},
    openSides: {}
  });
  const toggleSection = (section, vehicleIndex) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [vehicleIndex]: !prev[section][vehicleIndex]
      }
    }));
  };
  // Calculate total extra charges
  const calculateTotalExtraCharges = () => {
    const charges = formData.freightBreakup.extraCharges;
    const total = (
      (parseFloat(charges.loadingCharge) || 0) +
      (parseFloat(charges.unloadingCharge) || 0) +
      (parseFloat(charges.doorPickupCharge) || 0) +
      (parseFloat(charges.doorDeliveryCharge) || 0) +
      (parseFloat(charges.packingCharge) || 0) +
      (parseFloat(charges.unpackingCharge) || 0) +
      (parseFloat(charges.cashOnDelivery) || 0) +
      (parseFloat(charges.deliveryOnDateCharge) || 0) +
      (parseFloat(charges.tollTax) || 0) +
      (parseFloat(charges.odcCharge) || 0) +
      (parseFloat(charges.otherCharges) || 0)
    );
    return total.toFixed(2);
  };

  // Calculate GST amount
  const calculateGSTAmount = () => {
    const baseAmount = (parseFloat(formData.freightBreakup.rate.value) || 0) + parseFloat(calculateTotalExtraCharges());
    const gstRate = formData.freightBreakup.applicableGST;
    
    if (gstRate === 'NIL (On reverse charge)') {
      return '0.00';
    }
    
    const rate = parseFloat(gstRate.replace('%', '')) / 100;
    const gstAmount = baseAmount * rate;
    return gstAmount.toFixed(2);
  };
  // Calculate total freight with GST
  const calculateTotalFreightWithGST = () => {
    const baseAmount = (parseFloat(formData.freightBreakup.rate.value) || 0) + parseFloat(calculateTotalExtraCharges());
    const gstAmount = parseFloat(calculateGSTAmount());
    const total = baseAmount + gstAmount;
    return total.toFixed(2);
  };

  // Auto-update calculated fields when dependencies change
  useEffect(() => {
    const totalExtraCharges = calculateTotalExtraCharges();
    const gstAmount = calculateGSTAmount();
    const totalFreightWithGst = calculateTotalFreightWithGST();
    
    // Update form data with calculated values
    if (formData.freightBreakup.extraCharges.totalExtraCharges !== totalExtraCharges) {
      handleInputChange('freightBreakup', 'extraCharges', totalExtraCharges, 'totalExtraCharges');
    }
    if (formData.freightBreakup.gstAmount !== gstAmount) {
      handleInputChange('freightBreakup', 'gstAmount', gstAmount);
    }
    if (formData.freightBreakup.totalFreightWithGst !== totalFreightWithGst) {
      handleInputChange('freightBreakup', 'totalFreightWithGst', totalFreightWithGst);
    }
  }, [
    formData.freightBreakup.rate.value,
    formData.freightBreakup.applicableGST,
    formData.freightBreakup.extraCharges.loadingCharge,
    formData.freightBreakup.extraCharges.unloadingCharge,
    formData.freightBreakup.extraCharges.doorPickupCharge,
    formData.freightBreakup.extraCharges.doorDeliveryCharge,
    formData.freightBreakup.extraCharges.packingCharge,
    formData.freightBreakup.extraCharges.unpackingCharge,
    formData.freightBreakup.extraCharges.cashOnDelivery,
    formData.freightBreakup.extraCharges.deliveryOnDateCharge,
    formData.freightBreakup.extraCharges.tollTax,
    formData.freightBreakup.extraCharges.odcCharge,
    formData.freightBreakup.extraCharges.otherCharges
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Vehicle & Freight Details</h3>
      
      {/* Vehicle Details */}
      <div className="border rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h4 className="font-medium text-gray-900">Vehicle Details</h4>
          <button
            type="button"
            onClick={addVehicle}
            className="bg-primary-400 hover:bg-primary-300 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Vehicle
          </button>
        </div>
        
        {formData.vehicleDetails.map((vehicle, index) => (
          <div key={index} className="border rounded-lg p-3 sm:p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-gray-800">Vehicle {index + 1}</h5>
              {formData.vehicleDetails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVehicle(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <input
                  type="text"
                  value={vehicle.vehicleType}
                  onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'vehicleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Truck, Trailer, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Trucks</label>
                <input
                  type="number"
                  value={vehicle.numberOfTrucks}
                  onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'numberOfTrucks', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight Guarantee</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={vehicle.weightGuarantee?.value || ''}
                    onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'weightGuarantee', e.target.value, 'value')}
                    className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Weight"
                  />
                  <select
                    value={vehicle.weightGuarantee?.unit || 'KG'}
                    onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'weightGuarantee', e.target.value, 'unit')}
                    className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
                  >
                    <option value="KG">KG</option>
                    <option value="MT">MT</option>
                    <option value="Quintal">Quintal</option>
                    <option value="LTR">LTR</option>
                    <option value="FIX">FIX</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Freight Rate</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={vehicle.freightRate?.value || ''}
                    onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'freightRate', e.target.value, 'value')}
                    className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Rate"
                  />
                  <select
                    value={vehicle.freightRate?.unit || 'Per KG'}
                    onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'freightRate', e.target.value, 'unit')}
                    className="w-20 sm:w-24 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
                  >
                    <option value="Per KG">Per KG</option>
                    <option value="Per MT">Per MT</option>
                    <option value="Per Quintal">Per Quintal</option>
                    <option value="Per LTR">Per LTR</option>
                    <option value="Per FIX">Per FIX</option>
                  </select>
                </div>
              </div>
            </div>              {/* Vehicle Dimensions */}
            <div className="mt-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('vehicleDimensions', index)}
              >
                <h6 className="text-sm font-medium text-gray-700">Vehicle Dimensions (Optional)</h6>
                <FontAwesomeIcon 
                  icon={(collapsedSections.vehicleDimensions[index] ?? true) ? faChevronDown : faChevronUp}
                  className="text-gray-500 text-sm"
                />
              </div>
              {!(collapsedSections.vehicleDimensions[index] ?? true) && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Length (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vehicle.dimensions?.lengthFt || ''}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'dimensions', e.target.value, 'lengthFt')}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                      placeholder="L"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Width (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vehicle.dimensions?.widthFt || ''}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'dimensions', e.target.value, 'widthFt')}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                      placeholder="W"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Height (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vehicle.dimensions?.heightFt || ''}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'dimensions', e.target.value, 'heightFt')}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                      placeholder="H"
                    />
                  </div>
                </div>
              )}
            </div>              {/* Open Sides */}
            <div className="mt-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('openSides', index)}
              >
                <h6 className="text-sm font-medium text-gray-700">Open Sides (Optional)</h6>
                <FontAwesomeIcon 
                  icon={(collapsedSections.openSides[index] ?? true) ? faChevronDown : faChevronUp}
                  className="text-gray-500 text-sm"
                />
              </div>
              {!(collapsedSections.openSides[index] ?? true) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={vehicle.openSides?.allSide || false}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'openSides', e.target.checked, 'allSide')}
                      className="mr-2 rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-700">All Side</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={vehicle.openSides?.driverSide || false}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'openSides', e.target.checked, 'driverSide')}
                      className="mr-2 rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-700">Driver Side</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={vehicle.openSides?.driverOppositeSide || false}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'openSides', e.target.checked, 'driverOppositeSide')}
                      className="mr-2 rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-700">Driver Opposite</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={vehicle.openSides?.towardsEnd || false}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'openSides', e.target.checked, 'towardsEnd')}
                      className="mr-2 rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-700">Towards End</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={vehicle.openSides?.height || false}
                      onChange={(e) => handleArrayInputChange('vehicleDetails', index, 'openSides', e.target.checked, 'height')}
                      className="mr-2 rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-700">Height</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Freight Breakup */}
      <div className="border rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-4">Freight Breakup</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Freight Rate</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.freightBreakup.rate.value}
                onChange={(e) => handleInputChange('freightBreakup', 'rate', e.target.value, 'value')}
                className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                placeholder="Rate"
              />
              <select
                value={formData.freightBreakup.rate.type}
                onChange={(e) => handleInputChange('freightBreakup', 'rate', e.target.value, 'type')}
                className="w-20 sm:w-24 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
              >
                <option value="Fixed">Fixed</option>
                <option value="Per KG">Per KG</option>
                <option value="Per MT">Per MT</option>
                <option value="Per Quintal">Per Quintal</option>
                <option value="Per LTR">Per LTR</option>
                <option value="Per KM">Per KM</option>
                <option value="Per Pack">Per Pack</option>
                <option value="Per Ton">Per Ton</option>
                <option value="Per Unit">Per Unit</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TDS</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.freightBreakup.tds?.value || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'tds', e.target.value, 'value')}
                className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                placeholder="TDS"
              />
              <select
                value={formData.freightBreakup.tds?.type || 'Deduction'}
                onChange={(e) => handleInputChange('freightBreakup', 'tds', e.target.value, 'type')}
                className="w-24 sm:w-28 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
              >
                <option value="Deduction">Deduction</option>
                <option value="Addition">Addition</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applicable GST</label>
            <select
              value={formData.freightBreakup.applicableGST}
              onChange={(e) => handleInputChange('freightBreakup', 'applicableGST', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            >
              <option value="NIL (On reverse charge)">NIL (On reverse charge)</option>
              <option value="5.0%">5.0%</option>
              <option value="12.0%">12.0%</option>
              <option value="18.0%">18.0%</option>
              <option value="28.0%">28.0%</option>
            </select>
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Amount (Auto-calculated)</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-700 font-medium">
              ₹ {calculateGSTAmount()}
            </div>
          </div>
            <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Freight with GST (Auto-calculated)</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-700 font-medium">
              ₹ {calculateTotalFreightWithGST()}
            </div>
          </div>
        </div>
          {/* Extra Charges */}
        <div className="border-t pt-4">
          <h5 className="font-medium text-gray-800 mb-3">Extra Charges</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loading Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.loadingCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'loadingCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unloading Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.unloadingCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'unloadingCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Door Pickup Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.doorPickupCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'doorPickupCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Door Delivery Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.doorDeliveryCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'doorDeliveryCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Packing Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.packingCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'packingCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unpacking Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.unpackingCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'unpackingCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cash on Delivery</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.cashOnDelivery || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'cashOnDelivery')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery on Date Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.deliveryOnDateCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'deliveryOnDateCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Toll Tax</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.tollTax || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'tollTax')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ODC Charge</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.odcCharge || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'odcCharge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (%)</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.serviceChargePercent || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'serviceChargePercent')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Charges</label>
              <input
                type="number"
                value={formData.freightBreakup.extraCharges.otherCharges || ''}
                onChange={(e) => handleInputChange('freightBreakup', 'extraCharges', e.target.value, 'otherCharges')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
              <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Extra Charges (Auto-calculated)</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-700 font-medium">
                ₹ {calculateTotalExtraCharges()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3VehicleFreightDetails;
