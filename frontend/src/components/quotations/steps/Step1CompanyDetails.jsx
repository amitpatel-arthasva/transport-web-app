import React from 'react';

const Step1CompanyDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
          <input
            type="text"
            value={formData.quoteToCompany.companyName}
            onChange={(e) => handleInputChange('quoteToCompany', 'companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
          <input
            type="text"
            value={formData.quoteToCompany.gstNumber}
            onChange={(e) => handleInputChange('quoteToCompany', 'gstNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
          <input
            type="tel"
            value={formData.quoteToCompany.contactNumber}
            onChange={(e) => handleInputChange('quoteToCompany', 'contactNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Via</label>
          <select
            value={formData.quoteToCompany.inquiryVia}
            onChange={(e) => handleInputChange('quoteToCompany', 'inquiryVia', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          >
            <option value="Email">Email</option>
            <option value="Whatsapp">WhatsApp</option>
            <option value="Call">Call</option>
            <option value="Message">Message</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Date</label>
          <input
            type="date"
            value={formData.quoteToCompany.inquiryDate}
            onChange={(e) => handleInputChange('quoteToCompany', 'inquiryDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reference Document ID</label>
          <input
            type="text"
            value={formData.quoteToCompany.referenceDocumentId}
            onChange={(e) => handleInputChange('quoteToCompany', 'referenceDocumentId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Reference document or inquiry ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry By Person</label>
          <input
            type="text"
            value={formData.quoteToCompany.inquiryByPerson}
            onChange={(e) => handleInputChange('quoteToCompany', 'inquiryByPerson', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="Person who made the inquiry"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={formData.quoteToCompany.address}
          onChange={(e) => handleInputChange('quoteToCompany', 'address', e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base resize-none"
        />
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={formData.quoteToCompany.city}
            onChange={(e) => handleInputChange('quoteToCompany', 'city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={formData.quoteToCompany.state}
            onChange={(e) => handleInputChange('quoteToCompany', 'state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value={formData.quoteToCompany.country}
            onChange={(e) => handleInputChange('quoteToCompany', 'country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            placeholder="India"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
          <input
            type="text"
            value={formData.quoteToCompany.pinCode}
            onChange={(e) => handleInputChange('quoteToCompany', 'pinCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1CompanyDetails;
