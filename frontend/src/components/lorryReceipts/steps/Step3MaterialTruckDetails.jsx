import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Step3MaterialTruckDetails = ({ 
  formData, 
  handleInputChange, 
  handleNestedInputChange, 
  handleArrayInputChange, 
  addArrayItem, 
  removeArrayItem 
}) => {
  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    dimensions: {}
  });

  const toggleSection = (section, materialIndex) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [materialIndex]: !prev[section][materialIndex]
      }
    }));
  };
  const packagingTypes = [
    'Bags', 'Barrels', 'Box', 'Breakable items', 'Bunch', 'Bundle', 'Coil', 
    'Container', 'Fruit vegetable', 'Furniture', 'Gas', 'Gas bottles', 
    'Gas cylinder', 'Gas tank', 'Glass', 'Heavy items', 'Jumbo bags', 
    'Liquid', 'Loose', 'Loss', 'Machine', 'Machine part', 'Machinery', 
    'Other', 'Palette', 'Pipe and bundle', 'Pipes', 'Plates', 'PMMA', 
    'Rod/sariya', 'Ropes', 'Scrap cars', 'Tank', 'Wire coil', 'Wood'
  ];

  const weightUnits = ['KG', 'MT', 'Quintal', 'LTR'];
  const freightRateUnits = ['Per KG', 'Per MT', 'Per Quintal', 'Per LTR', 'Per Pack', 'Per Unit', 'Per Vehicale'];

  const addMaterial = () => {
    const newMaterial = {
      materialName: '',
      packagingType: 'Bags',
      quantity: '',
      numberOfArticles: '',
      actualWeight: { value: '', unit: 'MT' },
      chargedWeight: { value: '', unit: 'MT' },
      freightRate: { value: '', unit: 'Per MT' },
      hsnCode: '',
      containerNumber: '',
      dimensions: { lengthFt: '', widthFt: '', heightFt: '' }
    };
    addArrayItem('materialDetails', newMaterial);
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Truck Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Truck Details</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Truck Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.truckDetails.truckNumber}
              onChange={(e) => handleInputChange('truckDetails', 'truckNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter truck number"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.truckDetails.vehicleType}
              onChange={(e) => handleInputChange('truckDetails', 'vehicleType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter vehicle type"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.truckDetails.from}
              onChange={(e) => handleInputChange('truckDetails', 'from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter origin location"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Load Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.truckDetails.loadType}
              onChange={(e) => handleInputChange('truckDetails', 'loadType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              required
            >
              <option value="Full Load">Full Load</option>
              <option value="Part Load">Part Load</option>
            </select>
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight Guarantee Value <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.truckDetails.weightGuarantee.value}
                onChange={(e) => handleNestedInputChange('truckDetails', 'weightGuarantee', 'value', e.target.value)}
                className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                placeholder="Weight"
                required
              />
              <select
                value={formData.truckDetails.weightGuarantee.unit}
                onChange={(e) => handleNestedInputChange('truckDetails', 'weightGuarantee', 'unit', e.target.value)}
                className="w-20 sm:w-24 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
              >
                {weightUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.truckDetails.driverName}
              onChange={(e) => handleInputChange('truckDetails', 'driverName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter driver name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.truckDetails.driverMobile}
              onChange={(e) => handleInputChange('truckDetails', 'driverMobile', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter driver mobile"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.truckDetails.licenseNumber}
              onChange={(e) => handleInputChange('truckDetails', 'licenseNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter license number"
              required
            />
          </div>
        </div>
      </div>

      {/* Material Details */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Material Details</h3>
          <button
            type="button"
            onClick={addMaterial}
            className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-300 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Material
          </button>
        </div>

        {formData.materialDetails.map((material, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-800">Material {index + 1}</h4>
              {formData.materialDetails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('materialDetails', index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Remove Material"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={material.materialName}
                  onChange={(e) => handleArrayInputChange('materialDetails', index, 'materialName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter material name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Packaging Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={material.packagingType}
                  onChange={(e) => handleArrayInputChange('materialDetails', index, 'packagingType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  required
                >
                  {packagingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={material.quantity}
                  onChange={(e) => handleArrayInputChange('materialDetails', index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Articles <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={material.numberOfArticles}
                  onChange={(e) => handleArrayInputChange('materialDetails', index, 'numberOfArticles', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter number of articles"
                  required
                />
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Weight <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={material.actualWeight.value}
                    onChange={(e) => {
                      const newWeight = { ...material.actualWeight, value: e.target.value };
                      handleArrayInputChange('materialDetails', index, 'actualWeight', newWeight);
                    }}
                    className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Weight"
                    required
                  />
                  <select
                    value={material.actualWeight.unit}
                    onChange={(e) => {
                      const newWeight = { ...material.actualWeight, unit: e.target.value };
                      handleArrayInputChange('materialDetails', index, 'actualWeight', newWeight);
                    }}
                    className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
                  >
                    {weightUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charged Weight <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={material.chargedWeight.value}
                    onChange={(e) => {
                      const newWeight = { ...material.chargedWeight, value: e.target.value };
                      handleArrayInputChange('materialDetails', index, 'chargedWeight', newWeight);
                    }}
                    className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Weight"
                    required
                  />
                  <select
                    value={material.chargedWeight.unit}
                    onChange={(e) => {
                      const newWeight = { ...material.chargedWeight, unit: e.target.value };
                      handleArrayInputChange('materialDetails', index, 'chargedWeight', newWeight);
                    }}
                    className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
                  >
                    {weightUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Freight Rate <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={material.freightRate.value}
                    onChange={(e) => {
                      const newRate = { ...material.freightRate, value: e.target.value };
                      handleArrayInputChange('materialDetails', index, 'freightRate', newRate);
                    }}
                    className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Rate"
                    required
                  />
                  <select
                    value={material.freightRate.unit}
                    onChange={(e) => {
                      const newRate = { ...material.freightRate, unit: e.target.value };
                      handleArrayInputChange('materialDetails', index, 'freightRate', newRate);
                    }}
                    className="w-20 sm:w-24 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
                  >
                    {freightRateUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>            </div>

            {/* Optional Fields */}
            <div className="mt-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('dimensions', index)}
              >
                <h6 className="text-sm font-medium text-gray-700">Additional Details (Optional)</h6>
                <FontAwesomeIcon 
                  icon={(collapsedSections.dimensions[index] ?? true) ? faChevronDown : faChevronUp}
                  className="text-gray-500 text-sm"
                />
              </div>
              {!(collapsedSections.dimensions[index] ?? true) && (
                <div>
                  {/* HSN Code and Container Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        HSN Code
                      </label>
                      <input
                        type="text"
                        value={material.hsnCode}
                        onChange={(e) => handleArrayInputChange('materialDetails', index, 'hsnCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                        placeholder="Enter HSN code"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Container Number
                      </label>
                      <input
                        type="text"
                        value={material.containerNumber}
                        onChange={(e) => handleArrayInputChange('materialDetails', index, 'containerNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                        placeholder="Enter container number"
                      />
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Dimensions</h6>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <input
                          type="number"
                          step="0.1"
                          value={material.dimensions.lengthFt}
                          onChange={(e) => {
                            const newDimensions = { ...material.dimensions, lengthFt: e.target.value };
                            handleArrayInputChange('materialDetails', index, 'dimensions', newDimensions);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                          placeholder="Length (ft)"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.1"
                          value={material.dimensions.widthFt}
                          onChange={(e) => {
                            const newDimensions = { ...material.dimensions, widthFt: e.target.value };
                            handleArrayInputChange('materialDetails', index, 'dimensions', newDimensions);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                          placeholder="Width (ft)"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.1"
                          value={material.dimensions.heightFt}
                          onChange={(e) => {
                            const newDimensions = { ...material.dimensions, heightFt: e.target.value };
                            handleArrayInputChange('materialDetails', index, 'dimensions', newDimensions);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                          placeholder="Height (ft)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step3MaterialTruckDetails;
