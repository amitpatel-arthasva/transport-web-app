import React from 'react';

const Step1CompanyDetails = ({ formData, errors, onInputChange, onSectionChange }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Loading Slip Information</h3>
      
      {/* Loading Slip Number and Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loading Slip Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.slipNumber}
            onChange={(e) => onInputChange('slipNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter slip number"
            required
          />
          {errors.slipNumber && <p className="text-red-500 text-sm mt-1">{errors.slipNumber}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loading Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.loadingDate}
            onChange={(e) => onInputChange('loadingDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyDetails.companyName}
            onChange={(e) => onSectionChange('companyDetails', 'companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter company name"
            required
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
          <input
            type="text"
            value={formData.companyDetails.gstNumber || ''}
            onChange={(e) => onSectionChange('companyDetails', 'gstNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter GST number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.companyDetails.contactNumber}
            onChange={(e) => onSectionChange('companyDetails', 'contactNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter contact number"
          />
          {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
        </div>
          
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loading Contact Number</label>
          <input
            type="tel"
            value={formData.companyDetails.loadingContactNumber || ''}
            onChange={(e) => onSectionChange('companyDetails', 'loadingContactNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter loading contact number"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.companyDetails.address}
          onChange={(e) => onSectionChange('companyDetails', 'address', e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base resize-none"
          placeholder="Enter complete address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>
        
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyDetails.city}
            onChange={(e) => onSectionChange('companyDetails', 'city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter city"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyDetails.state}
            onChange={(e) => onSectionChange('companyDetails', 'state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter state"
          />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyDetails.country}
            onChange={(e) => onSectionChange('companyDetails', 'country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="India"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyDetails.pinCode}
            onChange={(e) => onSectionChange('companyDetails', 'pinCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter PIN code"
          />
          {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirmed Through</label>
          <select
            value={formData.referenceDetails.confirmThrough}
            onChange={(e) => onSectionChange('referenceDetails', 'confirmThrough', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          >
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Message">Message</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
          <input
            type="text"
            value={formData.referenceDetails.referenceNumber || ''}
            onChange={(e) => onSectionChange('referenceDetails', 'referenceNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter reference number"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1CompanyDetails;
