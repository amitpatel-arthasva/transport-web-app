import React from 'react';
import Modal from '../common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faBuilding, 
  faUser, 
  faPhone, 
  faTruck, 
  faFileAlt,
  faBoxOpen,
  faMapMarkerAlt,
  faMoneyBillWave,
  faCheckCircle,
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';

const DeliverySlipViewModal = ({ isOpen, onClose, deliverySlip }) => {
  if (!deliverySlip) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Created':
        return 'text-blue-600 bg-blue-100';
      case 'Out for Delivery':
        return 'text-orange-600 bg-orange-100';
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Failed Delivery':
        return 'text-red-600 bg-red-100';
      case 'Cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delivery Slip Details"
      size="xl"
    >
      <div className="flex flex-col space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Header with Status and ID */}
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-primary-400" />
              Slip #: {deliverySlip.deliverySlipNumber}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
              <span className="text-gray-600">{formatDate(deliverySlip.date)}</span>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deliverySlip.status)}`}>
            {deliverySlip.status}
          </div>
        </div>

        {/* Sender and Receiver Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
              Sender Details
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {deliverySlip.partyDetails?.sender?.senderName || 'N/A'}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                <span className="font-medium">Contact:</span> {deliverySlip.partyDetails?.sender?.senderContactNumber || 'N/A'}
              </p>
              {deliverySlip.partyDetails?.sender?.senderId && (
                <p className="text-gray-700 mt-1">
                  <span className="font-medium">Company:</span> {deliverySlip.partyDetails.sender.senderId.companyName || 'N/A'}
                </p>
              )}
            </div>
          </div>

          {/* Receiver Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
              Receiver Details
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {deliverySlip.partyDetails?.receiver?.receiverName || 'N/A'}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                <span className="font-medium">Contact:</span> {deliverySlip.partyDetails?.receiver?.receiverContactNumber || 'N/A'}
              </p>
              {deliverySlip.partyDetails?.receiver?.receiverId && (
                <p className="text-gray-700 mt-1">
                  <span className="font-medium">Company:</span> {deliverySlip.partyDetails.receiver.receiverId.companyName || 'N/A'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Parcel Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faBoxOpen} className="text-primary-400" />
            Parcel Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} className="text-gray-400" />
                <span className="font-medium">Transporter:</span> {deliverySlip.parcelDetails?.transporterName || 'N/A'}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                <span className="font-medium">Contact:</span> {deliverySlip.parcelDetails?.transporterContactNumber || 'N/A'}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                <span className="font-medium">From:</span> {deliverySlip.parcelDetails?.parcelFrom || 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-gray-400" />
                <span className="font-medium">LR Number:</span> {deliverySlip.parcelDetails?.lrNumber || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Article Quantity:</span> {deliverySlip.parcelDetails?.totalArticleQuantity || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Material:</span> {deliverySlip.parcelDetails?.materialName || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Freight Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-primary-400" />
            Freight Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Charges</h4>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span>Bilty Freight:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.biltyFreight?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Delivery Charge:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.deliveryCharge?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Labour Charge:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.labourCharge?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Bilty Charge:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.biltyCharge?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Halting Charge:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.haltingCharge?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Warehouse Charge:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.warehouseCharge?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Local Transport Charge:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.localTransportCharge?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Other Charges:</span> 
                  <span>₹{deliverySlip.freightDetails?.charges?.otherCharges?.toLocaleString('en-IN') || '0'}</span>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Totals</h4>
              <div className="space-y-2">
                <p className="flex justify-between items-center text-sm">
                  <span>Delivery Collection:</span> 
                  <span className="font-medium">₹{deliverySlip.freightDetails?.deliveryCollection?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between items-center text-sm">
                  <span>GST ({deliverySlip.freightDetails?.gstDetails?.applicableGST || 'NIL'}):</span> 
                  <span className="font-medium">₹{deliverySlip.freightDetails?.gstDetails?.gstAmount?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <p className="flex justify-between items-center text-sm">
                  <span>Round Off:</span> 
                  <span className="font-medium">₹{deliverySlip.freightDetails?.roundOff?.toLocaleString('en-IN') || '0'}</span>
                </p>
                <div className="border-t border-gray-300 mt-2 pt-2">
                  <p className="flex justify-between items-center font-bold">
                    <span>Total Freight:</span> 
                    <span className="text-primary-600">₹{deliverySlip.freightDetails?.totalFreight?.toLocaleString('en-IN') || '0'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-primary-400" />
            Delivery Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                <span className="font-medium">Contact:</span> {deliverySlip.deliveryBy?.contactNumber || 'N/A'}
              </p>
              {deliverySlip.deliveryBy?.subUserId && (
                <p className="text-gray-700">
                  <span className="font-medium">Delivered By:</span> {deliverySlip.deliveryBy.subUserId.name || 'N/A'}
                </p>
              )}
              {deliverySlip.deliveredAt && (
                <p className="text-gray-700 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                  <span className="font-medium">Delivered On:</span> {formatDate(deliverySlip.deliveredAt)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              {deliverySlip.deliveryNotes && (
                <div>
                  <p className="text-gray-700 flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={faNotesMedical} className="text-gray-400" />
                    <span className="font-medium">Notes:</span>
                  </p>
                  <p className="text-gray-600 text-sm bg-white p-2 rounded border border-gray-200">
                    {deliverySlip.deliveryNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* References Section */}
        {(deliverySlip.lorryReceiptRef || deliverySlip.loadingSlipRef || deliverySlip.quotationRef) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-primary-400" />
              References
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliverySlip.lorryReceiptRef && (
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">Lorry Receipt</p>
                  <p className="text-gray-600 text-sm">
                    LR #: {deliverySlip.lorryReceiptRef.lorryReceiptNumber || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Date: {formatDate(deliverySlip.lorryReceiptRef.date)}
                  </p>
                </div>
              )}
              
              {deliverySlip.loadingSlipRef && (
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">Loading Slip</p>
                  <p className="text-gray-600 text-sm">
                    Slip #: {deliverySlip.loadingSlipRef.slipNumber || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Date: {formatDate(deliverySlip.loadingSlipRef.loadingDate)}
                  </p>
                </div>
              )}
              
              {deliverySlip.quotationRef && (
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">Quotation</p>
                  <p className="text-gray-600 text-sm">
                    Created: {formatDate(deliverySlip.quotationRef.createdAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Created By and Timestamps */}
        <div className="text-sm text-gray-500 pt-2 border-t flex justify-between">
          <div>
            {deliverySlip.createdBy && (
              <p>Created by: {deliverySlip.createdBy.name || 'N/A'}</p>
            )}
          </div>
          <div className="text-right">
            <p>Created: {formatDate(deliverySlip.createdAt)}</p>
            {deliverySlip.updatedAt && deliverySlip.updatedAt !== deliverySlip.createdAt && (
              <p>Last Updated: {formatDate(deliverySlip.updatedAt)}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeliverySlipViewModal;
