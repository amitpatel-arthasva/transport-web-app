import React from 'react';

const Step3TruckDriver = ({ formData, errors, onInputChange, onSectionChange }) => {
  const vehicleTypes = [
    'Full Body Trailer',
    'Open Trailer',
    'Container',
    'LCV',
    'Truck',
    'Tempo',
    'Tanker',
    'Dumper',
    'Express Cargo',
    'Other'
  ].sort();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Truck Details</h3>
      
      {/* Truck Number and Vehicle Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="truckNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Truck Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="truckNumber"
            value={formData.truckDetails.truckNumber}
            onChange={(e) => onSectionChange('truckDetails', 'truckNumber', e.target.value)}
            className={`w-full px-3 py-2 border ${errors.truckNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
            placeholder="Enter truck number"
          />
          {errors.truckNumber && <p className="text-red-500 text-xs mt-1">{errors.truckNumber}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            value={formData.truckDetails.vehicleType}
            onChange={(e) => onSectionChange('truckDetails', 'vehicleType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Allocated LR Number and Overload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="allocatedLRNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Allocated LR Number
          </label>
          <input
            type="text"
            id="allocatedLRNumber"
            value={formData.truckDetails.allocatedLRNumber || ''}
            onChange={(e) => onSectionChange('truckDetails', 'allocatedLRNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="Enter LR number (if allocated)"
          />
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overload?
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.truckDetails.overload === true}
                onChange={() => onSectionChange('truckDetails', 'overload', true)}
                className="h-4 w-4 text-primary-500 focus:ring-primary-400"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.truckDetails.overload === false}
                onChange={() => onSectionChange('truckDetails', 'overload', false)}
                className="h-4 w-4 text-primary-500 focus:ring-primary-400"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Truck Dimensions */}
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Truck Dimensions (ft)
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="loadingLengthFt" className="block text-xs text-gray-500 mb-1">
              Length
            </label>
            <input
              type="number"
              id="loadingLengthFt"
              value={formData.truckDetails.dimensions.loadingLengthFt || ''}
              onChange={(e) => onSectionChange('truckDetails', 'dimensions', { ...formData.truckDetails.dimensions, loadingLengthFt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Length"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="loadingWidthFt" className="block text-xs text-gray-500 mb-1">
              Width
            </label>
            <input
              type="number"
              id="loadingWidthFt"
              value={formData.truckDetails.dimensions.loadingWidthFt || ''}
              onChange={(e) => onSectionChange('truckDetails', 'dimensions', { ...formData.truckDetails.dimensions, loadingWidthFt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Width"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="loadingHeightFt" className="block text-xs text-gray-500 mb-1">
              Height
            </label>
            <input
              type="number"
              id="loadingHeightFt"
              value={formData.truckDetails.dimensions.loadingHeightFt || ''}
              onChange={(e) => onSectionChange('truckDetails', 'dimensions', { ...formData.truckDetails.dimensions, loadingHeightFt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Height"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Driver Details</h3>
      
      {/* Driver Name and Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-1">
            Driver Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="driverName"
            value={formData.driverDetails.driverName}
            onChange={(e) => onSectionChange('driverDetails', 'driverName', e.target.value)}
            className={`w-full px-3 py-2 border ${errors.driverName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
            placeholder="Enter driver name"
          />
          {errors.driverName && <p className="text-red-500 text-xs mt-1">{errors.driverName}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="driverMobile" className="block text-sm font-medium text-gray-700 mb-1">
            Driver Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="driverMobile"
            value={formData.driverDetails.driverMobile}
            onChange={(e) => onSectionChange('driverDetails', 'driverMobile', e.target.value)}
            className={`w-full px-3 py-2 border ${errors.driverMobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
            placeholder="Enter driver mobile number"
          />
          {errors.driverMobile && <p className="text-red-500 text-xs mt-1">{errors.driverMobile}</p>}
        </div>
      </div>
      
      {/* License Number and Expiry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
            License Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="licenseNumber"
            value={formData.driverDetails.licenseNumber}
            onChange={(e) => onSectionChange('driverDetails', 'licenseNumber', e.target.value)}
            className={`w-full px-3 py-2 border ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
            placeholder="Enter license number"
          />
          {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="licenseExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            License Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="licenseExpiryDate"
            value={formData.driverDetails.licenseExpiryDate}
            onChange={(e) => onSectionChange('driverDetails', 'licenseExpiryDate', e.target.value)}
            className={`w-full px-3 py-2 border ${errors.licenseExpiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
          />
          {errors.licenseExpiryDate && <p className="text-red-500 text-xs mt-1">{errors.licenseExpiryDate}</p>}
        </div>
      </div>
    </div>
  );
};

export default Step3TruckDriver;
