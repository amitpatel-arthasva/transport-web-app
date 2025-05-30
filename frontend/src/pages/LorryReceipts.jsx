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
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import lorryReceiptService from '../services/lorryReceiptService';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/ToastSystem';
import LorryReceiptModal from '../components/lorryReceipts/LorryReceiptModal';
import LorryReceiptViewModal from '../components/lorryReceipts/LorryReceiptViewModal';

const LorryReceipts = () => {
  const toast = useToast();
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLorryReceipt, setSelectedLorryReceipt] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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
  const fetchLorryReceipts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearchTerm && { 
          consignorName: debouncedSearchTerm,
          consigneeName: debouncedSearchTerm,
          truckNumber: debouncedSearchTerm
        })
      };
      
      const response = await lorryReceiptService.getLorryReceipts(params);
      
      if (response.success) {
        setLorryReceipts(response.data.lorryReceipts);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching lorry receipts:', error);
      
      // Only show individual error toast for non-connection errors
      if (error.response && error.response.status < 500) {
        toast.error('Failed to fetch lorry receipts. Please try again.');
      }
      // Connection errors are handled by the API interceptor
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, toast]);

  useEffect(() => {
    fetchLorryReceipts();
  }, [fetchLorryReceipts]);  const handleCreateLorryReceipt = () => {
    setSelectedLorryReceipt(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditLorryReceipt = (lorryReceipt) => {
    setSelectedLorryReceipt(lorryReceipt);
    setModalMode('edit');
    setIsModalOpen(true);
  };
  const handleViewLorryReceipt = async (lorryReceiptId) => {
    try {
      const response = await lorryReceiptService.getLorryReceiptById(lorryReceiptId);
      if (response.success) {
        setSelectedLorryReceipt(response.data.lorryReceipt);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching lorry receipt details:', error);
      
      // Only show individual error toast for non-connection errors
      if (error.response && error.response.status < 500) {
        toast.error('Failed to fetch lorry receipt details. Please try again.');
      }
      // Connection errors are handled by the API interceptor
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        const response = await lorryReceiptService.createLorryReceipt(formData);
        if (response.success) {
          toast.success('Lorry receipt created successfully!');
          fetchLorryReceipts();
          setIsModalOpen(false);
        }
      } else if (modalMode === 'edit') {
        const response = await lorryReceiptService.updateLorryReceipt(selectedLorryReceipt._id, formData);
        if (response.success) {
          toast.success('Lorry receipt updated successfully!');
          fetchLorryReceipts();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error submitting lorry receipt:', error);
      toast.error('Failed to save lorry receipt. Please try again.');
    }
  };

  const handleDeleteLorryReceipt = async (lorryReceiptId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Lorry Receipt',
      message: 'Are you sure you want to delete this lorry receipt? This action cannot be undone.',
      dangerConfirm: true,
      onConfirm: async () => {
        try {
          const response = await lorryReceiptService.deleteLorryReceipt(lorryReceiptId);
          if (response.success) {
            toast.success('Lorry receipt deleted successfully');
            fetchLorryReceipts(); // Refresh the list
          }
        } catch (error) {
          console.error('Error deleting lorry receipt:', error);
          toast.error('Failed to delete lorry receipt. Please try again.');
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
      case 'In Transit':
        return 'text-orange-600 bg-orange-100';
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lorry Receipts</h1>
        <p className="text-gray-600">Manage and track your lorry receipts</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search by consignor, consignee, or truck number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent w-full sm:w-80"
          />
        </div>
        <Button
          text="Create Lorry Receipt"
          onClick={handleCreateLorryReceipt}
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
          {/* Lorry Receipts Grid */}
          {lorryReceipts.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No lorry receipts found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No lorry receipts match your search criteria.' : 'Create your first lorry receipt to get started.'}
              </p>
              {!searchTerm && (
                <Button
                  text="Create Your First Lorry Receipt"
                  onClick={handleCreateLorryReceipt}
                  bgColor="#C5677B"
                  hoverBgColor="#C599B6"
                  className="text-white font-semibold"
                  width="w-auto"
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lorryReceipts.map((lorryReceipt) => (
                <div key={lorryReceipt._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lorryReceipt.status)}`}>
                        {lorryReceipt.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewLorryReceipt(lorryReceipt._id)}
                          className="text-primary-400 hover:text-primary-300 p-1 transition-colors"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleEditLorryReceipt(lorryReceipt)}
                          className="text-primary-300 hover:text-primary-200 p-1 transition-colors"
                          title="Edit Lorry Receipt"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDeleteLorryReceipt(lorryReceipt._id)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          title="Delete Lorry Receipt"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>

                    {/* LR Number */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileAlt} className="text-primary-400" />
                        LR No: {lorryReceipt.lorryReceiptNumber}
                      </h3>
                    </div>

                    {/* Consignor & Consignee Info */}
                    <div className="mb-4">
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>From:</strong> {lorryReceipt.consignor?.consignorName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lorryReceipt.consignor?.city}, {lorryReceipt.consignor?.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>To:</strong> {lorryReceipt.consignee?.consigneeName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lorryReceipt.consignee?.city}, {lorryReceipt.consignee?.state}
                        </p>
                      </div>
                    </div>

                    {/* Truck Details */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                        <FontAwesomeIcon icon={faTruck} className="text-primary-400" />
                        <strong>Truck:</strong> {lorryReceipt.truckDetails?.truckNumber || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Vehicle Type:</strong> {lorryReceipt.truckDetails?.vehicleType || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Driver:</strong> {lorryReceipt.truckDetails?.driverName || 'N/A'}
                      </p>
                    </div>

                    {/* Material Info */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Materials:</strong> {lorryReceipt.materialDetails?.length || 0} item(s)
                      </p>
                      {lorryReceipt.materialDetails?.[0] && (
                        <p className="text-sm text-gray-500">
                          {lorryReceipt.materialDetails[0].materialName}
                          {lorryReceipt.materialDetails.length > 1 && ` +${lorryReceipt.materialDetails.length - 1} more`}
                        </p>
                      )}
                    </div>

                    {/* Freight Info */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Freight Type:</strong> {lorryReceipt.freightDetails?.freightType || 'N/A'}
                      </p>
                      {lorryReceipt.freightDetails?.totalFreight && (
                        <p className="text-sm text-gray-600">
                          <strong>Total Freight:</strong> ₹{lorryReceipt.freightDetails.totalFreight.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-primary-400" />
                        Created: {formatDate(lorryReceipt.createdAt)}
                      </span>
                      <span>
                        Date: {formatDate(lorryReceipt.date)}
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
      )}      {/* Modals */}
      {isModalOpen && (
        <LorryReceiptModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          lorryReceipt={selectedLorryReceipt}
          mode={modalMode}
        />
      )}

      {isViewModalOpen && (
        <LorryReceiptViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          lorryReceipt={selectedLorryReceipt}
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

export default LorryReceipts;