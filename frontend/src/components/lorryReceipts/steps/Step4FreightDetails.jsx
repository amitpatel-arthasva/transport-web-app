import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Step4FreightDetails = ({ formData, setFormData }) => {
  // Add state for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    additionalCharges: true,
    gstDetails: true,
    tdsDetails: true
  });

  // Toggle function for collapsible sections
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNestedChange = (section, field, value) => {
    if (section === 'freightDetails') {
      setFormData(prev => ({
        ...prev,
        freightDetails: {
          ...prev.freightDetails,
          [field]: typeof value === 'string' && !isNaN(parseFloat(value)) ? 
            parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: parseFloat(value) || 0
        }
      }));
    }
  };

  const handleChargeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      freightDetails: {
        ...prev.freightDetails,
        charges: {
          ...prev.freightDetails.charges,
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleGstChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      freightDetails: {
        ...prev.freightDetails,
        gstDetails: {
          ...prev.freightDetails.gstDetails,
          [field]: field === 'gstAmount' ? parseFloat(value) || 0 : value
        }
      }
    }));
  };

  const handleAdvanceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      freightDetails: {
        ...prev.freightDetails,
        advanceDetails: {
          ...prev.freightDetails.advanceDetails,
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleTdsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      freightDetails: {
        ...prev.freightDetails,
        tdsDetails: {
          ...prev.freightDetails.tdsDetails,
          [field]: field === 'tdsAmount' || field === 'tdsPercentage' ? parseFloat(value) || 0 : value
        }
      }
    }));
  };

  // Auto-calculate totals when values change
  useEffect(() => {
    const charges = formData.freightDetails.charges;
    const subTotal = formData.freightDetails.totalBasicFreight + 
      charges.pickupCharge + charges.doorDeliveryCharge + charges.loadingCharge + 
      charges.unloadingCharge + charges.packingCharge + charges.unpackingCharge + 
      charges.serviceCharge + charges.cashOnDelivery + charges.dateOnDelivery + 
      charges.otherCharges;

    const totalFreight = subTotal + 
      formData.freightDetails.gstDetails.gstAmount + 
      formData.freightDetails.roundOff - 
      formData.freightDetails.tdsDetails.tdsAmount;

    const remainingFreight = totalFreight - formData.freightDetails.advanceDetails.advanceReceived;

    setFormData(prev => ({
      ...prev,
      freightDetails: {
        ...prev.freightDetails,
        subTotal,
        totalFreight,
        advanceDetails: {
          ...prev.freightDetails.advanceDetails,
          remainingFreight
        }
      }
    }));
  }, [
    formData.freightDetails.totalBasicFreight,
    formData.freightDetails.charges,
    formData.freightDetails.gstDetails.gstAmount,
    formData.freightDetails.roundOff,
    formData.freightDetails.tdsDetails.tdsAmount,
    formData.freightDetails.advanceDetails.advanceReceived,
    setFormData
  ]);

  // Auto-calculate GST amount when percentage changes
  useEffect(() => {
    if (formData.freightDetails.gstDetails.applicableGST !== 'NIL (On reverse charge)') {
      const gstPercentage = parseFloat(formData.freightDetails.gstDetails.applicableGST.replace('%', '')) || 0;
      const gstAmount = (formData.freightDetails.subTotal * gstPercentage) / 100;
      
      setFormData(prev => ({
        ...prev,
        freightDetails: {
          ...prev.freightDetails,
          gstDetails: {
            ...prev.freightDetails.gstDetails,
            gstAmount
          }
        }
      }));
    }
  }, [formData.freightDetails.gstDetails.applicableGST, formData.freightDetails.subTotal, setFormData]);

  // Auto-calculate TDS amount when percentage changes
  useEffect(() => {
    const tdsAmount = (formData.freightDetails.subTotal * formData.freightDetails.tdsDetails.tdsPercentage) / 100;
    
    setFormData(prev => ({
      ...prev,
      freightDetails: {
        ...prev.freightDetails,
        tdsDetails: {
          ...prev.freightDetails.tdsDetails,
          tdsAmount
        }
      }
    }));
  }, [formData.freightDetails.tdsDetails.tdsPercentage, formData.freightDetails.subTotal, setFormData]);
  return (
    <div className="space-y-6">
      {/* Basic Freight Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Freight Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Freight Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.freightDetails.freightType}
              onChange={(e) => handleNestedChange('freightDetails', 'freightType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              required
            >
              <option value="Paid">Paid</option>
              <option value="To Pay">To Pay</option>
              <option value="To be billed">To be billed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Basic Freight
            </label>
            <input
              type="number"
              value={formData.freightDetails.totalBasicFreight}
              onChange={(e) => handleNestedChange('freightDetails', 'totalBasicFreight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Freight Pay By <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.freightDetails.freightPayBy}
              onChange={(e) => handleNestedChange('freightDetails', 'freightPayBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              required
            >
              <option value="Consignor">Consignor</option>
              <option value="Consignee">Consignee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Charges - Collapsible */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div 
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('additionalCharges')}
        >
          <h3 className="text-lg font-semibold text-gray-900">Additional Charges (Optional)</h3>
          <FontAwesomeIcon 
            icon={collapsedSections.additionalCharges ? faChevronDown : faChevronUp}
            className="text-gray-500"
          />
        </div>

        {!collapsedSections.additionalCharges && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Charge</label>
              <input
                type="number"
                value={formData.freightDetails.charges.pickupCharge}
                onChange={(e) => handleChargeChange('pickupCharge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Door Delivery Charge</label>
              <input
                type="number"
                value={formData.freightDetails.charges.doorDeliveryCharge}
                onChange={(e) => handleChargeChange('doorDeliveryCharge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loading Charge</label>
              <input
                type="number"
                value={formData.freightDetails.charges.loadingCharge}
                onChange={(e) => handleChargeChange('loadingCharge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unloading Charge</label>
              <input
                type="number"
                value={formData.freightDetails.charges.unloadingCharge}
                onChange={(e) => handleChargeChange('unloadingCharge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Packing Charge</label>
              <input
                type="number"
                value={formData.freightDetails.charges.packingCharge}
                onChange={(e) => handleChargeChange('packingCharge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unpacking Charge</label>
              <input
                type="number"
                value={formData.freightDetails.charges.unpackingCharge}
                onChange={(e) => handleChargeChange('unpackingCharge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Charge</label>
              <input
                type="number"
                value={formData.freightDetails.charges.serviceCharge}
                onChange={(e) => handleChargeChange('serviceCharge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cash on Delivery</label>
              <input
                type="number"
                value={formData.freightDetails.charges.cashOnDelivery}
                onChange={(e) => handleChargeChange('cashOnDelivery', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date on Delivery</label>
              <input
                type="number"
                value={formData.freightDetails.charges.dateOnDelivery}
                onChange={(e) => handleChargeChange('dateOnDelivery', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges</label>
              <input
                type="number"
                value={formData.freightDetails.charges.otherCharges}
                onChange={(e) => handleChargeChange('otherCharges', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* GST Details - Collapsible */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div 
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('gstDetails')}
        >
          <h3 className="text-lg font-semibold text-gray-900">GST Details (Optional)</h3>
          <FontAwesomeIcon 
            icon={collapsedSections.gstDetails ? faChevronDown : faChevronUp}
            className="text-gray-500"
          />
        </div>

        {!collapsedSections.gstDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Filed and Pay By</label>
              <select
                value={formData.freightDetails.gstDetails.gstFileAndPayBy}
                onChange={(e) => handleGstChange('gstFileAndPayBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                <option value="Consignor">Consignor</option>
                <option value="Consignee">Consignee</option>
                <option value="Transporter">Transporter</option>
                <option value="Exempted">Exempted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable GST</label>
              <select
                value={formData.freightDetails.gstDetails.applicableGST}
                onChange={(e) => handleGstChange('applicableGST', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                <option value="NIL (On reverse charge)">NIL (On reverse charge)</option>
                <option value="5.0%">5.0%</option>
                <option value="12.0%">12.0%</option>
                <option value="18.0%">18.0%</option>
                <option value="28.0%">28.0%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Amount</label>
              <input
                type="number"
                value={formData.freightDetails.gstDetails.gstAmount}
                onChange={(e) => handleGstChange('gstAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50"
                placeholder="0.00"
                step="0.01"
                min="0"
                readOnly={formData.freightDetails.gstDetails.applicableGST !== 'NIL (On reverse charge)'}
              />
            </div>
          </div>
        )}
      </div>

      {/* TDS Details - Collapsible */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div 
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('tdsDetails')}
        >
          <h3 className="text-lg font-semibold text-gray-900">TDS Details (Optional)</h3>
          <FontAwesomeIcon 
            icon={collapsedSections.tdsDetails ? faChevronDown : faChevronUp}
            className="text-gray-500"
          />
        </div>

        {!collapsedSections.tdsDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TDS Percentage</label>
              <input
                type="number"
                value={formData.freightDetails.tdsDetails.tdsPercentage}
                onChange={(e) => handleTdsChange('tdsPercentage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TDS Type</label>
              <select
                value={formData.freightDetails.tdsDetails.tdsType}
                onChange={(e) => handleTdsChange('tdsType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                <option value="TDS Deduction">TDS Deduction</option>
                <option value="TDS Addition">TDS Addition</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TDS Amount</label>
              <input
                type="number"
                value={formData.freightDetails.tdsDetails.tdsAmount}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="0.00"
                step="0.01"
                min="0"
                readOnly
              />
            </div>
          </div>
        )}
      </div>

      {/* Final Calculations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Calculations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Total</label>
            <input
              type="number"
              value={formData.freightDetails.subTotal}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="0.00"
              step="0.01"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Round Off</label>
            <input
              type="number"
              value={formData.freightDetails.roundOff}
              onChange={(e) => handleNestedChange('freightDetails', 'roundOff', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Advance Received</label>
            <input
              type="number"
              value={formData.freightDetails.advanceDetails.advanceReceived}
              onChange={(e) => handleAdvanceChange('advanceReceived', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Freight</label>
            <input
              type="number"
              value={formData.freightDetails.totalFreight}
              className="w-full px-3 py-2 border-2 border-primary-300 rounded-lg bg-primary-50 text-primary-900 font-semibold"
              placeholder="0.00"
              step="0.01"
              readOnly
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Freight</label>
            <input
              type="number"
              value={formData.freightDetails.advanceDetails.remainingFreight}
              className="w-full px-3 py-2 border-2 border-secondary-300 rounded-lg bg-secondary-50 text-secondary-900 font-semibold"
              placeholder="0.00"
              step="0.01"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Invoice and E-way Bill Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice & E-way Bill Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceDetails?.invoiceNumber || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                invoiceDetails: {
                  ...prev.invoiceDetails,
                  invoiceNumber: e.target.value
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter invoice number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
            <input
              type="date"
              value={formData.invoiceDetails?.invoiceDate || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                invoiceDetails: {
                  ...prev.invoiceDetails,
                  invoiceDate: e.target.value
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Value</label>
            <input
              type="number"
              value={formData.invoiceDetails?.invoiceValue || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                invoiceDetails: {
                  ...prev.invoiceDetails,
                  invoiceValue: parseFloat(e.target.value) || 0
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-way Bill Number</label>
            <input
              type="text"
              value={formData.eWayBillDetails?.eWayBillNumber || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                eWayBillDetails: {
                  ...prev.eWayBillDetails,
                  eWayBillNumber: e.target.value
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter e-way bill number"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            placeholder="Additional notes or comments..."
          />
        </div>
      </div>
    </div>
  );
};

export default Step4FreightDetails;
