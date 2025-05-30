import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faTruck, 
  faBox, 
  faMoneyBill, 
  faCalendarAlt,
  faMapMarkerAlt,
  faFileAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';

const LoadingSlipViewModal = ({ isOpen, onClose, loadingSlip }) => {
  if (!isOpen || !loadingSlip) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };
  
  const getStatusBadgeColor = (status) => {
    const colors = {
      'Created': 'bg-blue-100 text-blue-800 border-blue-200',
      'Loading': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Loaded': 'bg-green-100 text-green-800 border-green-200',
      'Dispatched': 'bg-purple-100 text-purple-800 border-purple-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Loading Slip Details"
      size="max-w-4xl"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between mb-6 pb-6 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-primary-400" />
              Loading Slip #{loadingSlip.slipNumber}
            </h3>
            <p className="text-gray-600 mt-1">
              Created on {formatDate(loadingSlip.createdAt)}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(loadingSlip.status)}`}>
              {loadingSlip.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Company Details */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                Company Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-base font-medium text-gray-800">
                  {loadingSlip.companyDetails?.companyName || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {loadingSlip.companyDetails?.address || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  {loadingSlip.companyDetails?.city}, {loadingSlip.companyDetails?.state} {loadingSlip.companyDetails?.pinCode}
                </p>
                {loadingSlip.companyDetails?.gstNumber && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>GST:</strong> {loadingSlip.companyDetails.gstNumber}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Contact:</strong> {loadingSlip.companyDetails?.contactNumber || 'N/A'}
                </p>
                {loadingSlip.companyDetails?.loadingContactNumber && (
                  <p className="text-sm text-gray-600">
                    <strong>Loading Contact:</strong> {loadingSlip.companyDetails.loadingContactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Reference Details */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Reference Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Confirmed Through:</strong> {loadingSlip.referenceDetails?.confirmThrough || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Reference Date:</strong> {formatDate(loadingSlip.referenceDetails?.referenceDate)}
                </p>
                {loadingSlip.referenceDetails?.referenceNumber && (
                  <p className="text-sm text-gray-600">
                    <strong>Reference Number:</strong> {loadingSlip.referenceDetails.referenceNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Loading Material */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faBox} className="text-primary-400" />
                Loading Material
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Load Type:</strong> {loadingSlip.loadingMaterial?.loadType || 'N/A'}
                  </p>
                  {loadingSlip.loadingMaterial?.approxLoadingWeight?.value && (
                    <p className="text-sm text-gray-600">
                      <strong>Weight:</strong> {loadingSlip.loadingMaterial.approxLoadingWeight.value} {loadingSlip.loadingMaterial.approxLoadingWeight.unit}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary-400" />
                  <p>
                    <strong>From:</strong> {loadingSlip.loadingMaterial?.from || 'N/A'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary-400" />
                  <p>
                    <strong>To:</strong> {loadingSlip.loadingMaterial?.to || 'N/A'}
                  </p>
                </div>
                
                <h5 className="font-medium text-gray-700 mb-2">Materials List:</h5>
                {loadingSlip.loadingMaterial?.materials?.map((material, index) => (
                  <div key={index} className="border-t pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
                    <p className="text-sm text-gray-600">
                      <strong>{index + 1}. {material.materialName}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Packaging:</strong> {material.packagingType}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Articles:</strong> {material.numberOfArticles}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            {/* Truck Details */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} className="text-primary-400" />
                Truck Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-base font-medium text-gray-800">
                  {loadingSlip.truckDetails?.truckNumber || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Vehicle Type:</strong> {loadingSlip.truckDetails?.vehicleType || 'N/A'}
                </p>
                {loadingSlip.truckDetails?.allocatedLRNumber && (
                  <p className="text-sm text-gray-600">
                    <strong>Allocated LR Number:</strong> {loadingSlip.truckDetails.allocatedLRNumber}
                  </p>
                )}
                
                {(loadingSlip.truckDetails?.dimensions?.loadingLengthFt || 
                  loadingSlip.truckDetails?.dimensions?.loadingWidthFt || 
                  loadingSlip.truckDetails?.dimensions?.loadingHeightFt) && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-medium">Dimensions:</p>
                    <div className="flex gap-4 mt-1">
                      <p className="text-sm text-gray-600">
                        <strong>L:</strong> {loadingSlip.truckDetails.dimensions.loadingLengthFt || '0'} ft
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>W:</strong> {loadingSlip.truckDetails.dimensions.loadingWidthFt || '0'} ft
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>H:</strong> {loadingSlip.truckDetails.dimensions.loadingHeightFt || '0'} ft
                      </p>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Overload:</strong> {loadingSlip.truckDetails?.overload ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Driver Details */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-primary-400" />
                Driver Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-base font-medium text-gray-800">
                  {loadingSlip.driverDetails?.driverName || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Mobile:</strong> {loadingSlip.driverDetails?.driverMobile || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>License Number:</strong> {loadingSlip.driverDetails?.licenseNumber || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>License Expiry:</strong> {formatDate(loadingSlip.driverDetails?.licenseExpiryDate)}
                </p>
              </div>
            </div>

            {/* Freight Details */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBill} className="text-primary-400" />
                Freight Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Basic Freight:</strong> {formatCurrency(loadingSlip.freightDetails?.basicFreight?.amount)}
                    {loadingSlip.freightDetails?.basicFreight?.type !== 'FIX' && ` (${loadingSlip.freightDetails.basicFreight.type})`}
                  </p>
                </div>
                
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">
                    <strong>Confirmed Advance:</strong> {formatCurrency(loadingSlip.freightDetails?.confirmedAdvance)}
                  </p>
                </div>
                
                <div className="flex justify-between mb-3 pt-2 border-t">
                  <p className="text-sm font-medium text-gray-800">
                    <strong>Balance Amount:</strong> {formatCurrency(loadingSlip.freightDetails?.balanceAmount)}
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Loading Charge Pay By:</strong> {loadingSlip.freightDetails?.loadingChargePayBy || 'N/A'}
                </p>
                
                {loadingSlip.freightDetails?.loadingChargePayBy === 'Driver' && loadingSlip.freightDetails?.loadingChargeByDriver?.amount && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Driver Loading Charge:</strong> {formatCurrency(loadingSlip.freightDetails.loadingChargeByDriver.amount)}
                    {loadingSlip.freightDetails.loadingChargeByDriver.type && ` (${loadingSlip.freightDetails.loadingChargeByDriver.type})`}
                  </p>
                )}
              </div>
            </div>

            {/* Remarks */}
            {loadingSlip.remarks && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Remarks
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {loadingSlip.remarks}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingSlipViewModal;
