import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Step2TripMaterialDetails = ({ 
  formData, 
  handleInputChange, 
  handleArrayInputChange, 
  addMaterial, 
  removeMaterial 
}) => {
  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    pickupPoints: true,
    deliveryPoints: true,
    dimensions: {}
  });

  const toggleSection = (section, materialIndex = null) => {
    setCollapsedSections(prev => {
      if (materialIndex !== null) {
        // For dimensions sections in materials
        return {
          ...prev,
          dimensions: {
            ...prev.dimensions,
            [materialIndex]: !prev.dimensions[materialIndex]
          }
        };
      } else {
        // For main sections
        return {
          ...prev,
          [section]: !prev[section]
        };
      }
    });
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Trip & Material Details</h3>
      
      {/* Trip Details */}
      <div className="border rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-4">Trip Information</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From *</label>
            <input
              type="text"
              value={formData.tripDetails.from}
              onChange={(e) => handleInputChange('tripDetails', 'from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
            <input
              type="text"
              value={formData.tripDetails.to}
              onChange={(e) => handleInputChange('tripDetails', 'to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Load Type</label>
            <select
              value={formData.tripDetails.fullOrPartLoad}
              onChange={(e) => handleInputChange('tripDetails', 'fullOrPartLoad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            >
              <option value="Full Load">Full Load</option>
              <option value="Part Load">Part Load</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
            <select
              value={formData.tripDetails.tripType}
              onChange={(e) => handleInputChange('tripDetails', 'tripType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
            >
              <option value="One Way">One Way</option>
              <option value="Round Trip">Round Trip</option>
            </select>
          </div>
        </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loading Date</label>
          <input
            type="date"
            value={formData.tripDetails.loadingDate}
            onChange={(e) => handleInputChange('tripDetails', 'loadingDate', e.target.value)}
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
          {/* Pickup Points Section */}
        <div className="sm:col-span-2">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2"
            onClick={() => toggleSection('pickupPoints')}
          >
            <label className="block text-sm font-medium text-gray-700">Pickup Points (Optional)</label>
            <FontAwesomeIcon 
              icon={collapsedSections.pickupPoints ? faChevronDown : faChevronUp}
              className="text-gray-500 text-sm"
            />
          </div>
          {!collapsedSections.pickupPoints && (
            <textarea
              value={formData.tripDetails.pickupPoints?.join('\n') || ''}
              onChange={(e) => handleInputChange('tripDetails', 'pickupPoints', e.target.value.split('\n').filter(point => point.trim()))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              rows="2"
              placeholder="Enter pickup points, one per line"
            />
          )}
        </div>
          {/* Delivery Points Section */}
        <div className="sm:col-span-2">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2"
            onClick={() => toggleSection('deliveryPoints')}
          >
            <label className="block text-sm font-medium text-gray-700">Delivery Points (Optional)</label>
            <FontAwesomeIcon 
              icon={collapsedSections.deliveryPoints ? faChevronDown : faChevronUp}
              className="text-gray-500 text-sm"
            />
          </div>
          {!collapsedSections.deliveryPoints && (
            <textarea
              value={formData.tripDetails.deliveryPoints?.join('\n') || ''}
              onChange={(e) => handleInputChange('tripDetails', 'deliveryPoints', e.target.value.split('\n').filter(point => point.trim()))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              rows="2"
              placeholder="Enter delivery points, one per line"
            />
          )}
        </div>
      </div>
      
      {/* Material Details */}
      <div className="border rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h4 className="font-medium text-gray-900">Material Details</h4>
          <button
            type="button"
            onClick={addMaterial}
            className="bg-primary-400 hover:bg-primary-300 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Material
          </button>
        </div>
        
        {formData.materialDetails.map((material, index) => (
          <div key={index} className="border rounded-lg p-3 sm:p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-gray-800">Material {index + 1}</h5>
              {formData.materialDetails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Name *</label>
                <input
                  type="text"
                  value={material.materialName}
                  onChange={(e) => handleArrayInputChange('materialDetails', index, 'materialName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Type</label>
                <select
                  value={material.packagingType}
                  onChange={(e) => handleArrayInputChange('materialDetails', index, 'packagingType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="Bags">Bags</option>
                  <option value="Barrels">Barrels</option>
                  <option value="Box">Box</option>
                  <option value="Breakable items">Breakable items</option>
                  <option value="Bunch">Bunch</option>
                  <option value="Bundle">Bundle</option>
                  <option value="Coil">Coil</option>
                  <option value="Container">Container</option>
                  <option value="Fruit vegetable">Fruit vegetable</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Gas">Gas</option>
                  <option value="Gas bottles">Gas bottles</option>
                  <option value="Gas cylinder">Gas cylinder</option>
                  <option value="Gas tank">Gas tank</option>
                  <option value="Glass">Glass</option>
                  <option value="Heavy items">Heavy items</option>
                  <option value="Jumbo bags">Jumbo bags</option>
                  <option value="Liquid">Liquid</option>
                  <option value="Loose">Loose</option>
                  <option value="Loss">Loss</option>
                  <option value="Machine">Machine</option>
                  <option value="Machine part">Machine part</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Other">Other</option>
                  <option value="Palette">Palette</option>
                  <option value="Pipe and bundle">Pipe and bundle</option>
                  <option value="Pipes">Pipes</option>
                  <option value="Plates">Plates</option>
                  <option value="PMMA">PMMA</option>
                  <option value="Rod/sariya">Rod/sariya</option>
                  <option value="Ropes">Ropes</option>
                  <option value="Scrap cars">Scrap cars</option>
                  <option value="Tank">Tank</option>
                  <option value="Wire coil">Wire coil</option>
                  <option value="Wood">Wood</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={material.weight.value}
                    onChange={(e) => handleArrayInputChange('materialDetails', index, 'weight', e.target.value, 'value')}
                    className="w-24 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Weight"
                  />                  
				  <select
                    value={material.weight.unit}
                    onChange={(e) => handleArrayInputChange('materialDetails', index, 'weight', e.target.value, 'unit')}
                    className="w-16 sm:w-20 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-xs sm:text-sm min-w-0 flex-shrink-0"
                  >                    <option value="KG">KG</option>
                    <option value="MT">MT</option>
                    <option value="Quintal">Quintal</option>
                    <option value="LTR">LTR</option>
                    <option value="FIX">FIX</option>
                  </select>
                </div>
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Articles</label>
                <input
                  type="number"
                  value={material.numberOfArticles}
                  onChange={(e) => handleArrayInputChange('materialDetails', index, 'numberOfArticles', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
              {/* Dimensions Section */}
            <div className="mt-4">              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('dimensions', index)}
              >
                <h6 className="text-sm font-medium text-gray-700">Dimensions (Optional)</h6>
                <FontAwesomeIcon 
                  icon={(collapsedSections.dimensions[index] ?? true) ? faChevronDown : faChevronUp}
                  className="text-gray-500 text-sm"
                />
              </div>
              {!(collapsedSections.dimensions[index] ?? true) && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Length (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={material.dimensions?.lengthFt || ''}
                      onChange={(e) => handleArrayInputChange('materialDetails', index, 'dimensions', e.target.value, 'lengthFt')}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                      placeholder="L"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Width (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={material.dimensions?.widthFt || ''}
                      onChange={(e) => handleArrayInputChange('materialDetails', index, 'dimensions', e.target.value, 'widthFt')}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                      placeholder="W"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Height (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={material.dimensions?.heightFt || ''}
                      onChange={(e) => handleArrayInputChange('materialDetails', index, 'dimensions', e.target.value, 'heightFt')}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-400 focus:border-transparent text-sm"
                      placeholder="H"
                    />
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

export default Step2TripMaterialDetails;
