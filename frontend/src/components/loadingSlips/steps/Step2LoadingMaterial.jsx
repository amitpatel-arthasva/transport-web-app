import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const Step2LoadingMaterial = ({ 
  formData, 
  errors, 
  onInputChange, 
  onSectionChange
}) => {
  const packagingTypes = [
    'Bags', 'Barrels', 'Box', 'Breakable items', 'Bunch', 'Bundle', 'Coil', 'Container', 
    'Fruit vegetable', 'Furniture', 'Gas', 'Gas bottles', 'Gas cylinder', 'Gas tank', 
    'Glass', 'Heavy items', 'Jumbo bags', 'Liquid', 'Loose', 'Loss', 'Machine', 
    'Machine part', 'Machinery', 'Other', 'Palette', 'Pipe and bundle', 'Pipes', 
    'Plates', 'PMMA', 'Rod/sariya', 'Ropes', 'Scrap cars', 'Tank', 'Wire coil', 'Wood'
  ].sort();

  const weightUnits = ['KG', 'MT', 'Quintal', 'LTR'];

  // Helper function to update array items
  const updateMaterialField = (index, field, value) => {
    const updatedMaterials = [...formData.loadingMaterial.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    onSectionChange('loadingMaterial', 'materials', updatedMaterials);
  };

  const addMaterial = () => {
    const newMaterial = {
      materialName: '',
      packagingType: 'Bags',
      numberOfArticles: ''
    };
    const updatedMaterials = [...formData.loadingMaterial.materials, newMaterial];
    onSectionChange('loadingMaterial', 'materials', updatedMaterials);
  };

  const removeMaterial = (index) => {
    const updatedMaterials = formData.loadingMaterial.materials.filter((_, i) => i !== index);
    onSectionChange('loadingMaterial', 'materials', updatedMaterials);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Loading Material Details</h3>
      
      {/* Load Type */}
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Load Type <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Full Load"
              checked={formData.loadingMaterial.loadType === 'Full Load'}
              onChange={(e) => onSectionChange('loadingMaterial', 'loadType', e.target.value)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-400"
            />
            <span className="ml-2 text-gray-700">Full Load</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Part Load"
              checked={formData.loadingMaterial.loadType === 'Part Load'}
              onChange={(e) => onSectionChange('loadingMaterial', 'loadType', e.target.value)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-400"
            />
            <span className="ml-2 text-gray-700">Part Load</span>
          </label>
        </div>
      </div>
      
      {/* From and To locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
            From Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="from"
            value={formData.loadingMaterial.from}
            onChange={(e) => onSectionChange('loadingMaterial', 'from', e.target.value)}
            className={`w-full px-3 py-2 border ${errors.from ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
            placeholder="Enter origin location"
          />
          {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            To Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="to"
            value={formData.loadingMaterial.to}
            onChange={(e) => onSectionChange('loadingMaterial', 'to', e.target.value)}
            className={`w-full px-3 py-2 border ${errors.to ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
            placeholder="Enter destination location"
          />
          {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
        </div>
      </div>
      
      {/* Approximate Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="weightValue" className="block text-sm font-medium text-gray-700 mb-1">
            Approximate Weight
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              id="weightValue"
              value={formData.loadingMaterial.approxLoadingWeight.value || ''}
              onChange={(e) => onSectionChange('loadingMaterial', 'approxLoadingWeight', { ...formData.loadingMaterial.approxLoadingWeight, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter weight"
              min="0"
              step="0.01"
            />
            <select
              value={formData.loadingMaterial.approxLoadingWeight.unit}
              onChange={(e) => onSectionChange('loadingMaterial', 'approxLoadingWeight', { ...formData.loadingMaterial.approxLoadingWeight, unit: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {weightUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Materials List</h4>
      
      {/* Materials List */}
      {formData.loadingMaterial.materials.map((material, index) => (
        <div key={index} className="p-4 border border-gray-300 rounded-md mb-4">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-md font-medium text-gray-800">Material {index + 1}</h5>
            {formData.loadingMaterial.materials.length > 1 && (
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove Material"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label htmlFor={`material-${index}-name`} className="block text-sm font-medium text-gray-700 mb-1">
                Material Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`material-${index}-name`}
                value={material.materialName || ''}
                onChange={(e) => updateMaterialField(index, 'materialName', e.target.value)}
                className={`w-full px-3 py-2 border ${errors[`material_${index}_name`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
                placeholder="Enter material name"
              />
              {errors[`material_${index}_name`] && <p className="text-red-500 text-xs mt-1">{errors[`material_${index}_name`]}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor={`material-${index}-packaging`} className="block text-sm font-medium text-gray-700 mb-1">
                Packaging Type <span className="text-red-500">*</span>
              </label>
              <select
                id={`material-${index}-packaging`}
                value={material.packagingType || 'Bags'}
                onChange={(e) => updateMaterialField(index, 'packagingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {packagingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor={`material-${index}-articles`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Articles <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id={`material-${index}-articles`}
              value={material.numberOfArticles || ''}
              onChange={(e) => updateMaterialField(index, 'numberOfArticles', e.target.value)}
              className={`w-full px-3 py-2 border ${errors[`material_${index}_articles`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400`}
              placeholder="Enter number of articles"
              min="1"
            />
            {errors[`material_${index}_articles`] && <p className="text-red-500 text-xs mt-1">{errors[`material_${index}_articles`]}</p>}
          </div>
        </div>
      ))}
      
      {/* Add Material Button */}
      <button
        type="button"
        onClick={addMaterial}
        className="flex items-center text-primary-500 hover:text-primary-600 font-medium"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Another Material
      </button>
    </div>
  );
};

export default Step2LoadingMaterial;
