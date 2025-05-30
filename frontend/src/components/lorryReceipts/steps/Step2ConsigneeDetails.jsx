import React from 'react';

const Step2ConsigneeDetails = ({ formData, handleInputChange, handleNestedInputChange }) => {
  return (
    <div className="space-y-6">
      {/* Consignee Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consignee Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consignee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.consignee.consigneeName}
              onChange={(e) => handleInputChange('consignee', 'consigneeName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter consignee name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <input
              type="text"
              value={formData.consignee.gstNumber}
              onChange={(e) => handleInputChange('consignee', 'gstNumber', e.target.value)}
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
              value={formData.consignee.contactNumber}
              onChange={(e) => handleInputChange('consignee', 'contactNumber', e.target.value)}
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
              value={formData.consignee.address}
              onChange={(e) => handleInputChange('consignee', 'address', e.target.value)}
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
              value={formData.consignee.city}
              onChange={(e) => handleInputChange('consignee', 'city', e.target.value)}
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
              value={formData.consignee.state}
              onChange={(e) => handleInputChange('consignee', 'state', e.target.value)}
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
              value={formData.consignee.country}
              onChange={(e) => handleInputChange('consignee', 'country', e.target.value)}
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
              value={formData.consignee.pinCode}
              onChange={(e) => handleInputChange('consignee', 'pinCode', e.target.value)}
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
              value={formData.consignee.email}
              onChange={(e) => handleInputChange('consignee', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryType"
                value="Door"
                checked={formData.deliveryDetails.deliveryType === 'Door'}
                onChange={(e) => handleInputChange('deliveryDetails', 'deliveryType', e.target.value)}
                className="text-primary-400 focus:ring-primary-400"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Door Delivery</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryType"
                value="Warehouse"
                checked={formData.deliveryDetails.deliveryType === 'Warehouse'}
                onChange={(e) => handleInputChange('deliveryDetails', 'deliveryType', e.target.value)}
                className="text-primary-400 focus:ring-primary-400"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Warehouse</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.deliveryDetails.sameAsConsignee}
              onChange={(e) => handleInputChange('deliveryDetails', 'sameAsConsignee', e.target.checked)}
              className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Same as Consignee</span>
          </label>
        </div>

        {!formData.deliveryDetails.sameAsConsignee && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.deliveryDetails.companyName}
                onChange={(e) => handleInputChange('deliveryDetails', 'companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                value={formData.deliveryDetails.contactPersonName}
                onChange={(e) => handleInputChange('deliveryDetails', 'contactPersonName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter contact person name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                value={formData.deliveryDetails.gstNumber}
                onChange={(e) => handleInputChange('deliveryDetails', 'gstNumber', e.target.value)}
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
                value={formData.deliveryDetails.contactNumber}
                onChange={(e) => handleInputChange('deliveryDetails', 'contactNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter contact number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.deliveryDetails.address}
                onChange={(e) => handleInputChange('deliveryDetails', 'address', e.target.value)}
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
                value={formData.deliveryDetails.city}
                onChange={(e) => handleInputChange('deliveryDetails', 'city', e.target.value)}
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
                value={formData.deliveryDetails.state}
                onChange={(e) => handleInputChange('deliveryDetails', 'state', e.target.value)}
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
                value={formData.deliveryDetails.pinCode}
                onChange={(e) => handleInputChange('deliveryDetails', 'pinCode', e.target.value)}
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

export default Step2ConsigneeDetails;
