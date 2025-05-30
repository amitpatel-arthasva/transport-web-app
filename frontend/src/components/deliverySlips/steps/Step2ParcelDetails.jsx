import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faFileAlt, faBox, faBoxes, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Step2ParcelDetails = ({ formData, updateFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      ...formData,
      parcelDetails: {
        ...formData.parcelDetails,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Parcel Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faTruck} className="mr-2 text-primary-400" />
            Transporter Name*
          </label>
          <input
            type="text"
            name="transporterName"
            value={formData.parcelDetails.transporterName || ''}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors?.parcelDetails?.transporterName ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Enter transporter name"
          />
          {errors?.parcelDetails?.transporterName && (
            <p className="mt-1 text-sm text-red-500">{errors.parcelDetails.transporterName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-primary-400" />
            Transporter Contact Number*
          </label>
          <input
            type="text"
            name="transporterContactNumber"
            value={formData.parcelDetails.transporterContactNumber || ''}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors?.parcelDetails?.transporterContactNumber ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Enter transporter contact number"
          />
          {errors?.parcelDetails?.transporterContactNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.parcelDetails.transporterContactNumber}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-primary-400" />
            Parcel From*
          </label>
          <input
            type="text"
            name="parcelFrom"
            value={formData.parcelDetails.parcelFrom || ''}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors?.parcelDetails?.parcelFrom ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Enter origin location"
          />
          {errors?.parcelDetails?.parcelFrom && (
            <p className="mt-1 text-sm text-red-500">{errors.parcelDetails.parcelFrom}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-primary-400" />
            LR Number*
          </label>
          <input
            type="text"
            name="lrNumber"
            value={formData.parcelDetails.lrNumber || ''}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors?.parcelDetails?.lrNumber ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Enter LR number"
          />
          {errors?.parcelDetails?.lrNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.parcelDetails.lrNumber}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faBoxes} className="mr-2 text-primary-400" />
            Total Article Quantity*
          </label>
          <input
            type="number"
            name="totalArticleQuantity"
            value={formData.parcelDetails.totalArticleQuantity || ''}
            onChange={handleChange}
            min="1"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors?.parcelDetails?.totalArticleQuantity ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Enter total quantity"
          />
          {errors?.parcelDetails?.totalArticleQuantity && (
            <p className="mt-1 text-sm text-red-500">{errors.parcelDetails.totalArticleQuantity}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faBox} className="mr-2 text-primary-400" />
            Material Name*
          </label>
          <input
            type="text"
            name="materialName"
            value={formData.parcelDetails.materialName || ''}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors?.parcelDetails?.materialName ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Enter material name"
          />
          {errors?.parcelDetails?.materialName && (
            <p className="mt-1 text-sm text-red-500">{errors.parcelDetails.materialName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2ParcelDetails;
