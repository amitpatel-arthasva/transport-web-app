import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Step4TermsValidity = ({ formData, handleInputChange }) => {  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    customPaymentTerms: true
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Terms & Validity</h3>
      
      {/* Payment Terms */}
      <div className="border rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Payment Terms</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pay By</label>
            <select
              value={formData.paymentTerms.payBy}
              onChange={(e) => handleInputChange('paymentTerms', 'payBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            >
              <option value="Consignor">Consignor</option>
              <option value="Consignee">Consignee</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver Cash Required</label>
            <input
              type="number"
              value={formData.paymentTerms.driverCashRequired}
              onChange={(e) => handleInputChange('paymentTerms', 'driverCashRequired', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Remark</label>
          <textarea
            value={formData.paymentTerms.paymentRemark}
            onChange={(e) => handleInputChange('paymentTerms', 'paymentRemark', e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base resize-none"
          />
        </div>
          {/* Custom Payment Terms */}
        <div className="border-t pt-4">
          <div 
            className="flex justify-between items-center cursor-pointer mb-3"
            onClick={() => toggleSection('customPaymentTerms')}
          >
            <h5 className="font-medium text-gray-800">Custom Payment Terms (Optional)</h5>
            <FontAwesomeIcon 
              icon={collapsedSections.customPaymentTerms ? faChevronDown : faChevronUp} 
              className="text-gray-500"
            />
          </div>
          
          {!collapsedSections.customPaymentTerms && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Advance Paid Amount</label>
              <div className="flex gap-2">                <input
                  type="number"
                  value={formData.paymentTerms.customTerms?.advancePaidAmount?.value || ''}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'advancePaidAmount', 'value')}
                  className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Amount"
                />
                <select
                  value={formData.paymentTerms.customTerms?.advancePaidAmount?.type || 'Fix'}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'advancePaidAmount', 'type')}
                  className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="Fix">Fix</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">After Loading</label>
              <div className="flex gap-2">                <input
                  type="number"
                  value={formData.paymentTerms.customTerms?.afterLoading?.value || ''}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'afterLoading', 'value')}
                  className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Amount"
                />
                <select
                  value={formData.paymentTerms.customTerms?.afterLoading?.type || 'Fix'}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'afterLoading', 'type')}
                  className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="Fix">Fix</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">After Delivery</label>
              <div className="flex gap-2">                <input
                  type="number"
                  value={formData.paymentTerms.customTerms?.afterDelivery?.value || ''}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'afterDelivery', 'value')}
                  className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Amount"
                />
                <select
                  value={formData.paymentTerms.customTerms?.afterDelivery?.type || 'Fix'}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'afterDelivery', 'type')}
                  className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="Fix">Fix</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">After POD</label>
              <div className="flex gap-2">                <input
                  type="number"
                  value={formData.paymentTerms.customTerms?.afterPOD?.value || ''}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'afterPOD', 'value')}
                  className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Amount"
                />
                <select
                  value={formData.paymentTerms.customTerms?.afterPOD?.type || 'Fix'}
                  onChange={(e) => handleInputChange('paymentTerms', 'customTerms', e.target.value, 'afterPOD', 'type')}
                  className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="Fix">Fix</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>
          </div>
          )}
        </div>
        
        {/* Payment Date */}
        <div className="border-t pt-4">
          <h5 className="font-medium text-gray-800 mb-3">Payment Date</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date Type</label>
              <select
                value={formData.paymentTerms.paymentDate?.type || 'Days'}
                onChange={(e) => handleInputChange('paymentTerms', 'paymentDate', e.target.value, 'type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              >
                <option value="Days">Days</option>
                <option value="Date">Date</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.paymentTerms.paymentDate?.type === 'Days' ? 'Number of Days' : 'Payment Date'}
              </label>
              <input
                type={formData.paymentTerms.paymentDate?.type === 'Days' ? 'number' : 'date'}
                value={formData.paymentTerms.paymentDate?.value || ''}
                onChange={(e) => handleInputChange('paymentTerms', 'paymentDate', e.target.value, 'value')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quotation Validity */}
      <div className="border rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Quotation Validity</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valid Up To Type</label>
            <select
              value={formData.quotationValidity.validUpTo.type}
              onChange={(e) => handleInputChange('quotationValidity', 'validUpTo', e.target.value, 'type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            >
              <option value="Days">Days</option>
              <option value="Date">Date</option>
            </select>
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.quotationValidity.validUpTo.type === 'Days' ? 'Number of Days' : 'Valid Until Date'}
            </label>
            <input
              type={formData.quotationValidity.validUpTo.type === 'Days' ? 'number' : 'date'}
              value={formData.quotationValidity.validUpTo.value}
              onChange={(e) => handleInputChange('quotationValidity', 'validUpTo', e.target.value, 'value')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Calculated/Manual)</label>
            <input
              type="date"
              value={formData.quotationValidity.expiryDate || ''}
              onChange={(e) => handleInputChange('quotationValidity', 'expiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Auto-calculated or manual entry"
            />
          </div>
        </div>
      </div>
      
      {/* Demurrage */}
      <div className="border rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Demurrage</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Charge Per Hour/Day</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.demurrage.chargePerHour.value}
                onChange={(e) => handleInputChange('demurrage', 'chargePerHour', e.target.value, 'value')}
                className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                placeholder="Charge"
              />
              <select
                value={formData.demurrage.chargePerHour.type}
                onChange={(e) => handleInputChange('demurrage', 'chargePerHour', e.target.value, 'type')}
                className="w-20 sm:w-24 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
              >
                <option value="Per Hour">Per Hour</option>
                <option value="Per Day">Per Day</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applicable After Hours</label>
            <input
              type="number"
              value={formData.demurrage.applicableAfterHours}
              onChange={(e) => handleInputChange('demurrage', 'applicableAfterHours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Hours"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4TermsValidity;
