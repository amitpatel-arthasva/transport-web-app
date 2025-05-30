import React from 'react';

const Step1ConsignorDetails = ({ formData, handleInputChange, handleNestedInputChange }) => {
  return (
    <div className="space-y-6">
      {/* Basic LR Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LR Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lorryReceiptNumber}
            onChange={(e) => handleInputChange(null, 'lorryReceiptNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            placeholder="Enter LR number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange(null, 'date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Consignor Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consignor Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consignor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.consignor.consignorName}
              onChange={(e) => handleInputChange('consignor', 'consignorName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter consignor name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <input
              type="text"
              value={formData.consignor.gstNumber}
              onChange={(e) => handleInputChange('consignor', 'gstNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter GST number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.consignor.contactNumber}
              onChange={(e) => handleInputChange('consignor', 'contactNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter contact number"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.consignor.address}
              onChange={(e) => handleInputChange('consignor', 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              rows="2"
              placeholder="Enter address"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.consignor.city}
              onChange={(e) => handleInputChange('consignor', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter city"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.consignor.state}
              onChange={(e) => handleInputChange('consignor', 'state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter state"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.consignor.country}
              onChange={(e) => handleInputChange('consignor', 'country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter country"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.consignor.pinCode}
              onChange={(e) => handleInputChange('consignor', 'pinCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter pin code"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.consignor.email}
              onChange={(e) => handleInputChange('consignor', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      {/* Loading Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading Address</h3>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.loadingAddress.sameAsConsignor}
              onChange={(e) => handleInputChange('loadingAddress', 'sameAsConsignor', e.target.checked)}
              className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Same as Consignor</span>
          </label>
        </div>

        {!formData.loadingAddress.sameAsConsignor && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party Name
              </label>
              <input
                type="text"
                value={formData.loadingAddress.partyName}
                onChange={(e) => handleInputChange('loadingAddress', 'partyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter party name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                value={formData.loadingAddress.gstNumber}
                onChange={(e) => handleInputChange('loadingAddress', 'gstNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter GST number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.loadingAddress.contactNumber}
                onChange={(e) => handleInputChange('loadingAddress', 'contactNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter contact number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.loadingAddress.address}
                onChange={(e) => handleInputChange('loadingAddress', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                rows="2"
                placeholder="Enter address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.loadingAddress.city}
                onChange={(e) => handleInputChange('loadingAddress', 'city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.loadingAddress.state}
                onChange={(e) => handleInputChange('loadingAddress', 'state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter state"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Code
              </label>
              <input
                type="text"
                value={formData.loadingAddress.pinCode}
                onChange={(e) => handleInputChange('loadingAddress', 'pinCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter pin code"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1ConsignorDetails;
