import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faPhone, faNotesMedical } from '@fortawesome/free-solid-svg-icons';

const Step4DeliveryDetails = ({ formData, updateFormData, errors }) => {
  const handleDeliveryByChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      ...formData,
      deliveryBy: {
        ...formData.deliveryBy,
        [name]: value
      }
    });
  };

  const handleStatusChange = (e) => {
    updateFormData({
      ...formData,
      status: e.target.value
    });
  };

  const handleNotesChange = (e) => {
    updateFormData({
      ...formData,
      deliveryNotes: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Delivery Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faPhone} className="mr-2 text-primary-400" />
            Contact Number*
          </label>
          <input
            type="text"
            name="contactNumber"
            value={formData.deliveryBy.contactNumber || ''}
            onChange={handleDeliveryByChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors?.deliveryBy?.contactNumber ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Enter contact number"
          />
          {errors?.deliveryBy?.contactNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.deliveryBy.contactNumber}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon={faUserAlt} className="mr-2 text-primary-400" />
            Status
          </label>
          <select
            value={formData.status || 'Created'}
            onChange={handleStatusChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Created">Created</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed Delivery">Failed Delivery</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <FontAwesomeIcon icon={faNotesMedical} className="mr-2 text-primary-400" />
          Delivery Notes
        </label>
        <textarea
          name="deliveryNotes"
          value={formData.deliveryNotes || ''}
          onChange={handleNotesChange}
          rows="4"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Add any delivery instructions or notes here..."
        ></textarea>
      </div>
    </div>
  );
};

export default Step4DeliveryDetails;
