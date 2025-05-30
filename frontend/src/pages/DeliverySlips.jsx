// filepath: d:\Projects\Arthasva\Test Projects\LR-Online\frontend\src\pages\DeliverySlips.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faEdit, 
  faTrash, 
  faEye,
  faFileAlt,
  faCalendarAlt,
  faTruck,
  faBuilding,
  faBoxOpen,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import deliverySlipService from '../services/deliverySlipService';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/ToastSystem';
import DeliverySlipModal from '../components/deliverySlips/DeliverySlipModal';
import DeliverySlipViewModal from '../components/deliverySlips/DeliverySlipViewModal';

const DeliverySlips = () => {
  const toast = useToast();
  const [deliverySlips, setDeliverySlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDeliverySlip, setSelectedDeliverySlip] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // ConfirmDialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    dangerConfirm: false
  });

  // Debounce search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, searchTerm]);

  const fetchDeliverySlips = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearchTerm && { 
          senderName: debouncedSearchTerm,
          receiverName: debouncedSearchTerm,
          transporterName: debouncedSearchTerm
        })
      };
      
      const response = await deliverySlipService.getDeliverySlips(params);
      
      if (response.success) {
        setDeliverySlips(response.data.deliverySlips);
        setTotalPages(response.data.totalPages);
      }    } catch (error) {
      console.error('Error fetching delivery slips:', error);
      
      // Only show individual error toast for non-connection errors
      if (error.response && error.response.status < 500) {
        toast.error('Failed to fetch delivery slips. Please try again.');
      }
      // Connection errors are handled by the API interceptor
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, toast]);

  useEffect(() => {
    fetchDeliverySlips();
  }, [fetchDeliverySlips]);

  const handleCreateDeliverySlip = () => {
    setSelectedDeliverySlip(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditDeliverySlip = (deliverySlip) => {
    setSelectedDeliverySlip(deliverySlip);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewDeliverySlip = async (deliverySlipId) => {
    try {
      const response = await deliverySlipService.getDeliverySlipById(deliverySlipId);
      if (response.success) {
        setSelectedDeliverySlip(response.data.deliverySlip);
        setIsViewModalOpen(true);
      }    } catch (error) {
      console.error('Error fetching delivery slip details:', error);
      
      // Only show individual error toast for non-connection errors
      if (error.response && error.response.status < 500) {
        toast.error('Failed to fetch delivery slip details. Please try again.');
      }
      // Connection errors are handled by the API interceptor
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        const response = await deliverySlipService.createDeliverySlip(formData);
        if (response.success) {
          toast.success('Delivery slip created successfully!');
          fetchDeliverySlips();
          setIsModalOpen(false);
        }
      } else if (modalMode === 'edit') {
        const response = await deliverySlipService.updateDeliverySlip(selectedDeliverySlip._id, formData);
        if (response.success) {
          toast.success('Delivery slip updated successfully!');
          fetchDeliverySlips();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error submitting delivery slip:', error);
      toast.error('Failed to save delivery slip. Please try again.');
    }
  };

  const handleDeleteDeliverySlip = async (deliverySlipId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Delivery Slip',
      message: 'Are you sure you want to delete this delivery slip? This action cannot be undone.',
      dangerConfirm: true,
      onConfirm: async () => {
        try {
          const response = await deliverySlipService.deleteDeliverySlip(deliverySlipId);
          if (response.success) {
            toast.success('Delivery slip deleted successfully');
            fetchDeliverySlips(); // Refresh the list
          }
        } catch (error) {
          console.error('Error deleting delivery slip:', error);
          toast.error('Failed to delete delivery slip. Please try again.');
        }
      }
    });
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Slips</h1>
        <p className="text-gray-600">Manage and track your delivery slips</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />          <input
            type="text"
            placeholder="Search by sender, receiver, or transporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent w-full sm:w-80"
          />
        </div>
        <Button
          text="Create Delivery Slip"
          onClick={handleCreateDeliverySlip}
          bgColor="#C5677B"
          hoverBgColor="#C599B6"
          className="text-white font-semibold"
          width="w-auto"
          icon={<FontAwesomeIcon icon={faPlus} />}
        />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary-400" />
        </div>
      ) : (
        <>
          {/* Delivery Slips Grid */}
          {deliverySlips.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No delivery slips found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No delivery slips match your search criteria.' : 'Create your first delivery slip to get started.'}
              </p>
              {!searchTerm && (
                <Button
                  text="Create Your First Delivery Slip"
                  onClick={handleCreateDeliverySlip}
                  bgColor="#C5677B"
                  hoverBgColor="#C599B6"
                  className="text-white font-semibold"
                  width="w-auto"
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliverySlips.map((deliverySlip) => (
                <div key={deliverySlip._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deliverySlip.status)}`}>
                        {deliverySlip.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDeliverySlip(deliverySlip._id)}
                          className="text-primary-400 hover:text-primary-300 p-1 transition-colors"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleEditDeliverySlip(deliverySlip)}
                          className="text-primary-300 hover:text-primary-200 p-1 transition-colors"
                          title="Edit Delivery Slip"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDeleteDeliverySlip(deliverySlip._id)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          title="Delete Delivery Slip"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>

                    {/* Delivery Slip Number */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileAlt} className="text-primary-400" />
                        Slip #: {deliverySlip.deliverySlipNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-1 text-primary-400" />
                        LR #: {deliverySlip.parcelDetails?.lrNumber || 'N/A'}
                      </p>
                    </div>

                    {/* Sender & Receiver Info */}
                    <div className="mb-4">
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                          <strong>From:</strong> {deliverySlip.partyDetails?.sender?.senderName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Contact: {deliverySlip.partyDetails?.sender?.senderContactNumber || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                          <strong>To:</strong> {deliverySlip.partyDetails?.receiver?.receiverName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Contact: {deliverySlip.partyDetails?.receiver?.receiverContactNumber || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Transporter Details */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                        <FontAwesomeIcon icon={faTruck} className="text-primary-400" />
                        <strong>Transporter:</strong> {deliverySlip.parcelDetails?.transporterName || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>From:</strong> {deliverySlip.parcelDetails?.parcelFrom || 'N/A'}
                      </p>
                    </div>

                    {/* Parcel Info */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-primary-400" />
                        <strong>Articles:</strong> {deliverySlip.parcelDetails?.totalArticleQuantity || '0'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Material:</strong> {deliverySlip.parcelDetails?.materialName || 'N/A'}
                      </p>
                    </div>

                    {/* Freight Info */}
                    {deliverySlip.freightDetails?.totalFreight && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-800">
                          <strong>Total Freight:</strong> ₹{deliverySlip.freightDetails.totalFreight.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-primary-400" />
                        Created: {formatDate(deliverySlip.createdAt)}
                      </span>
                      <span>
                        Slip Date: {formatDate(deliverySlip.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 hover:border-primary-200 transition-colors"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 hover:border-primary-200 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {isModalOpen && (
        <DeliverySlipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          deliverySlip={selectedDeliverySlip}
          mode={modalMode}
        />
      )}

      {isViewModalOpen && (
        <DeliverySlipViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          deliverySlip={selectedDeliverySlip}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        dangerConfirm={confirmDialog.dangerConfirm}
      />
    </div>
  );
};

export default DeliverySlips;