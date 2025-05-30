import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faCalendarAlt, faFileText } from '@fortawesome/free-solid-svg-icons';

const Step1PartyDetails = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (section, field, value) => {
    if (section) {
      updateFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      updateFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    updateFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [subsection]: {
          ...formData[section][subsection],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Basic Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">
          Basic Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faFileText} className="mr-2 text-primary-400" />
              Delivery Slip Number *
            </label>
            <input
              type="text"
              value={formData.deliverySlipNumber || ''}
              onChange={(e) => handleInputChange(null, 'deliverySlipNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors?.deliverySlipNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter delivery slip number"
            />
            {errors?.deliverySlipNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.deliverySlipNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-primary-400" />
              Date
            </label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => handleInputChange(null, 'date', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Sender Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">
          Sender Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-primary-400" />
              Sender Name *
            </label>
            <input
              type="text"
              value={formData.partyDetails?.sender?.senderName || ''}
              onChange={(e) => handleNestedInputChange('partyDetails', 'sender', 'senderName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors?.partyDetails?.sender?.senderName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter sender name"
            />
            {errors?.partyDetails?.sender?.senderName && (
              <p className="mt-1 text-sm text-red-600">{errors.partyDetails.sender.senderName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faPhone} className="mr-2 text-primary-400" />
              Sender Contact Number *
            </label>
            <input
              type="tel"
              value={formData.partyDetails?.sender?.senderContactNumber || ''}
              onChange={(e) => handleNestedInputChange('partyDetails', 'sender', 'senderContactNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors?.partyDetails?.sender?.senderContactNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter sender contact number"
            />
            {errors?.partyDetails?.sender?.senderContactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.partyDetails.sender.senderContactNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Receiver Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">
          Receiver Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-primary-400" />
              Receiver Name *
            </label>
            <input
              type="text"
              value={formData.partyDetails?.receiver?.receiverName || ''}
              onChange={(e) => handleNestedInputChange('partyDetails', 'receiver', 'receiverName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors?.partyDetails?.receiver?.receiverName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter receiver name"
            />
            {errors?.partyDetails?.receiver?.receiverName && (
              <p className="mt-1 text-sm text-red-600">{errors.partyDetails.receiver.receiverName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faPhone} className="mr-2 text-primary-400" />
              Receiver Contact Number *
            </label>
            <input
              type="tel"
              value={formData.partyDetails?.receiver?.receiverContactNumber || ''}
              onChange={(e) => handleNestedInputChange('partyDetails', 'receiver', 'receiverContactNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors?.partyDetails?.receiver?.receiverContactNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter receiver contact number"
            />
            {errors?.partyDetails?.receiver?.receiverContactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.partyDetails.receiver.receiverContactNumber}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1PartyDetails;
