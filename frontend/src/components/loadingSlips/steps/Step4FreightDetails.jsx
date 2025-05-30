import React from 'react';

const Step4FreightDetails = ({ formData, errors, onInputChange, onSectionChange }) => {
  const basicFreightTypes = ['FIX', 'MT', 'KG', 'QUINTAL', 'PACK', 'UNIT', 'LTR'];
  const loadingChargeTypes = ['KG', 'FULL Truck', 'MT', 'Quintal', 'Pre Pack', 'Unit', 'LTR'];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Freight Details</h3>
      
      {/* Basic Freight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="basicFreightAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Basic Freight Amount <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              id="basicFreightAmount"
              value={formData.freightDetails.basicFreight.amount}
              onChange={(e) => onSectionChange('freightDetails', 'basicFreight', { ...formData.freightDetails.basicFreight, amount: e.target.value })}
              className={`w-full px-3 py-2 border ${errors.basicFreight ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
              placeholder="Enter freight amount"
              min="0"
              step="0.01"
            />
            <select
              value={formData.freightDetails.basicFreight.type}
              onChange={(e) => onSectionChange('freightDetails', 'basicFreight', { ...formData.freightDetails.basicFreight, type: e.target.value })}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {basicFreightTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {errors.basicFreight && <p className="text-red-500 text-xs mt-1">{errors.basicFreight}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmedAdvance" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmed Advance
          </label>
          <input
            type="number"
            id="confirmedAdvance"
            value={formData.freightDetails.confirmedAdvance || ''}
            onChange={(e) => onSectionChange('freightDetails', 'confirmedAdvance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="Enter advance amount"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      {/* Balance Amount - Auto calculated */}
      <div className="form-group bg-gray-50 p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Balance Amount
        </label>
        <p className="text-lg font-semibold">
          ₹{parseFloat(formData.freightDetails.balanceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Automatically calculated (Basic Freight - Confirmed Advance)
        </p>
      </div>
      
      {/* Loading Charge Payment */}
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loading Charge Pay By
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={formData.freightDetails.loadingChargePayBy === 'Company'}
              onChange={() => onSectionChange('freightDetails', 'loadingChargePayBy', 'Company')}
              className="h-4 w-4 text-primary-500 focus:ring-primary-400"
            />
            <span className="ml-2 text-gray-700">Company</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={formData.freightDetails.loadingChargePayBy === 'Driver'}
              onChange={() => onSectionChange('freightDetails', 'loadingChargePayBy', 'Driver')}
              className="h-4 w-4 text-primary-500 focus:ring-primary-400"
            />
            <span className="ml-2 text-gray-700">Driver</span>
          </label>
        </div>
      </div>
      
      {/* Loading Charge By Driver (if applicable) */}
      {formData.freightDetails.loadingChargePayBy === 'Driver' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="form-group">
            <label htmlFor="loadingChargeAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Loading Charge Amount
            </label>
            <input
              type="number"
              id="loadingChargeAmount"
              value={formData.freightDetails.loadingChargeByDriver.amount || ''}
              onChange={(e) => onSectionChange('freightDetails', 'loadingChargeByDriver', { ...formData.freightDetails.loadingChargeByDriver, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter loading charge"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="loadingChargeType" className="block text-sm font-medium text-gray-700 mb-1">
              Charge Type
            </label>
            <select
              id="loadingChargeType"
              value={formData.freightDetails.loadingChargeByDriver.type || 'FULL Truck'}
              onChange={(e) => onSectionChange('freightDetails', 'loadingChargeByDriver', { ...formData.freightDetails.loadingChargeByDriver, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {loadingChargeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Remarks */}
      <div className="form-group mt-6">
        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
          Remarks
        </label>
        <textarea
          id="remarks"
          value={formData.remarks || ''}
          onChange={(e) => onInputChange('remarks', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
          placeholder="Enter any additional remarks or special instructions"
          rows="3"
        ></textarea>
      </div>
      
      {/* Status */}
      <div className="form-group">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="Created">Created</option>
          <option value="Loading">Loading</option>
          <option value="Loaded">Loaded</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default Step4FreightDetails;
