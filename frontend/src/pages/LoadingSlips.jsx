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
  faBuilding,
  faSpinner,
  faTruck
} from '@fortawesome/free-solid-svg-icons';
import { loadingSlipService } from '../services/loadingSlipService';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/ToastSystem';
import LoadingSlipModal from '../components/loadingSlips/LoadingSlipModal';
import LoadingSlipViewModal from '../components/loadingSlips/LoadingSlipViewModal';

const LoadingSlips = () => {
  const toast = useToast();
  const [loadingSlips, setLoadingSlips] = useState([]);
  const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');  const [currentPage, setCurrentPage] = useState(1);
  
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLoadingSlip, setSelectedLoadingSlip] = useState(null);
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
  }, [debouncedSearchTerm, searchTerm]);  // Fetch loading slips function
  const fetchLoadingSlips = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm })
      };

      const response = await loadingSlipService.getLoadingSlips(params);
      
      if (response.success) {
        setLoadingSlips(response.data.loadingSlips);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching loading slips:', error);
      // Only show toast for non-connection errors (4xx errors)
      // Connection errors (5xx, network errors) are handled by API interceptor
      if (error.response && error.response.status < 500) {
        toast.error(error.response.data?.message || 'Failed to fetch loading slips. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, toast]);

  // Fetch loading slips on component mount and dependency changes
  useEffect(() => {
    fetchLoadingSlips();
  }, [fetchLoadingSlips]);

  // Handle create new loading slip
  const handleCreate = () => {
    setSelectedLoadingSlip(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Handle edit loading slip
  const handleEdit = (loadingSlip) => {
    setSelectedLoadingSlip(loadingSlip);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle view loading slip
  const handleView = (loadingSlip) => {
    setSelectedLoadingSlip(loadingSlip);
    setIsViewModalOpen(true);
  };

  // Handle delete loading slip
  const handleDelete = (loadingSlip) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Loading Slip',
      message: `Are you sure you want to delete loading slip "${loadingSlip.slipNumber}"? This action cannot be undone.`,
      dangerConfirm: true,
      onConfirm: () => confirmDelete(loadingSlip._id)
    });
  };
  // Confirm delete loading slip
  const confirmDelete = async (id) => {
    try {
      await loadingSlipService.deleteLoadingSlip(id);
      toast.success('Loading slip deleted successfully');
      fetchLoadingSlips();
    } catch (error) {
      console.error('Error deleting loading slip:', error);
      // Only show toast for non-connection errors (4xx errors)
      // Connection errors (5xx, network errors) are handled by API interceptor
      if (error.response && error.response.status < 500) {
        toast.error(error.response.data?.message || 'Failed to delete loading slip');
      }
    }
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };  // Handle modal submit - similar to LorryReceipts
  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        const response = await loadingSlipService.createLoadingSlip(formData);
        if (response.success) {
          toast.success('Loading slip created successfully!');
          fetchLoadingSlips();
          setIsModalOpen(false);
        }
      } else if (modalMode === 'edit') {
        const response = await loadingSlipService.updateLoadingSlip(selectedLoadingSlip._id, formData);
        if (response.success) {
          toast.success('Loading slip updated successfully!');
          fetchLoadingSlips();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error submitting loading slip:', error);
      // Only show toast for non-connection errors (4xx errors)
      // Connection errors (5xx, network errors) are handled by API interceptor
      if (error.response && error.response.status < 500) {
        toast.error(error.response.data?.message || 'Failed to save loading slip. Please try again.');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const colors = {
      'Created': 'bg-blue-100 text-blue-800',
      'Loading': 'bg-yellow-100 text-yellow-800',
      'Loaded': 'bg-green-100 text-green-800',
      'Dispatched': 'bg-purple-100 text-purple-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading Slips</h1>
          <p className="text-gray-600">Manage and track your loading slips</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-auto">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />            <input
              type="text"
              placeholder="Search by company, truck number, driver, slip number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent w-full sm:w-80"
            />
          </div>
          <Button
            text="Create Loading Slip"
            onClick={handleCreate}
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
            {/* Loading Slips Grid */}
            {loadingSlips.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No loading slips found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No loading slips match your search criteria.' : 'Create your first loading slip to get started.'}
                </p>
                {!searchTerm && (
                  <Button
                    text="Create Your First Loading Slip"
                    onClick={handleCreate}
                    bgColor="#C5677B"
                    hoverBgColor="#C599B6"
                    className="text-white font-semibold"
                    width="w-auto"
                  />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingSlips.map((loadingSlip) => (
                  <div key={loadingSlip._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                    <div className="p-6">
                      {/* Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(loadingSlip.status)}`}>
                          {loadingSlip.status}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(loadingSlip)}
                            className="text-primary-400 hover:text-primary-300 p-1 transition-colors"
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={() => handleEdit(loadingSlip)}
                            className="text-primary-300 hover:text-primary-200 p-1 transition-colors"
                            title="Edit Loading Slip"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDelete(loadingSlip)}
                            className="text-red-600 hover:text-red-800 p-1 transition-colors"
                            title="Delete Loading Slip"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>

                      {/* Loading Slip Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <FontAwesomeIcon icon={faFileAlt} className="text-primary-400" />
                          {loadingSlip.slipNumber}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary-400" />
                          {formatDate(loadingSlip.loadingDate)}
                        </p>
                      </div>

                      {/* Company Info */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                          <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                          {loadingSlip.companyDetails?.companyName || 'Unknown Company'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {loadingSlip.companyDetails?.city || 'N/A'}
                        </p>
                      </div>

                      {/* Route Info */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>From:</strong> {loadingSlip.loadingMaterial?.from || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>To:</strong> {loadingSlip.loadingMaterial?.to || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Load Type:</strong> {loadingSlip.loadingMaterial?.loadType || 'N/A'}
                        </p>
                      </div>

                      {/* Truck Info */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          <FontAwesomeIcon icon={faTruck} className="text-primary-400" />
                          <strong>{loadingSlip.truckDetails?.truckNumber || 'N/A'}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Driver: {loadingSlip.driverDetails?.driverName || 'N/A'}
                        </p>
                      </div>

                      {/* Amount Info */}
                      <div className="flex justify-between items-center text-sm border-t pt-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(loadingSlip.freightDetails?.basicFreight?.amount)}
                          </p>
                          <p className="text-gray-500">
                            Advance: {formatCurrency(loadingSlip.freightDetails?.confirmedAdvance)}
                          </p>
                        </div>
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
          <LoadingSlipModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            loadingSlip={selectedLoadingSlip}
            mode={modalMode}
          />
        )}

        {isViewModalOpen && (
          <LoadingSlipViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            loadingSlip={selectedLoadingSlip}
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

export default LoadingSlips;
