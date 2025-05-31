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
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import quotationService from '../services/quotationService';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/ToastSystem';
import QuotationModal from '../components/quotations/QuotationModal';
import QuotationViewModal from '../components/quotations/QuotationViewModal';

const Quotations = () => {
  const toast = useToast();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [isGeneratingPdf, setIsGeneratingPdf] = useState({});
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
  const fetchQuotations = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearchTerm && { companyName: debouncedSearchTerm })
      };
      
      const response = await quotationService.getQuotations(params);
      
      if (response.success) {
        setQuotations(response.data.quotations);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
       // Only show individual error toast for non-connection errors
      if (error.response && error.response.status < 500) {
        toast.error('Failed to fetch lorry receipts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, toast]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const handleCreateQuotation = () => {
    setSelectedQuotation(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setModalMode('edit');
    setIsModalOpen(true);
  };
  const handleViewQuotation = async (quotationId) => {
    try {
      const response = await quotationService.getQuotationById(quotationId);
      if (response.success) {
        setSelectedQuotation(response.data.quotation);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching quotation details:', error);
      toast.error('Failed to fetch quotation details. Please try again.');
    }
  };  const handleDeleteQuotation = async (quotationId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Quotation',
      message: 'Are you sure you want to delete this quotation? This action cannot be undone.',
      dangerConfirm: true,
      onConfirm: async () => {
        try {
          const response = await quotationService.deleteQuotation(quotationId);
          if (response.success) {
            toast.success('Quotation deleted successfully');
            fetchQuotations(); // Refresh the list
          }
        } catch (error) {
          console.error('Error deleting quotation:', error);
          toast.error('Failed to delete quotation. Please try again.');
        }
      }
    });
  };  const handleDownloadPdf = async (quotationId, companyName) => {
    try {
      setIsGeneratingPdf(prev => ({ ...prev, [quotationId]: true }));
      
      const pdfBlob = await quotationService.generateQuotationPdf(quotationId);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename similar to QuotationViewModal
      const shortId = quotationId.slice(-6).toUpperCase(); // Get last 6 characters
      const quotationNumber = `QUO-${shortId}`;
      const cleanCompanyName = (companyName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `${quotationNumber}_${cleanCompanyName}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(prev => ({ ...prev, [quotationId]: false }));
    }
  };
  const handleModalSubmit = async (quotationData) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await quotationService.createQuotation(quotationData);
      } else {
        response = await quotationService.updateQuotation(selectedQuotation._id, quotationData);
      }
      
      if (response.success) {
        toast.success(`Quotation ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setIsModalOpen(false);
        fetchQuotations(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} quotation:`, error);
      toast.error(`Failed to ${modalMode === 'create' ? 'create' : 'update'} quotation. Please try again.`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };
  const getStatusColor = (quotation) => {
    const expiryDate = new Date(quotation.quotationValidity?.expiryDate);
    const today = new Date();
    
    if (expiryDate < today) {
      return 'text-red-600 bg-red-100';
    } else if (expiryDate - today < 7 * 24 * 60 * 60 * 1000) { // Within 7 days
      return 'text-orange-600 bg-orange-100';
    }
    return 'text-primary-400 bg-primary-50';
  };

  const getStatusText = (quotation) => {
    const expiryDate = new Date(quotation.quotationValidity?.expiryDate);
    const today = new Date();
    
    if (expiryDate < today) {
      return 'Expired';
    } else if (expiryDate - today < 7 * 24 * 60 * 60 * 1000) {
      return 'Expiring Soon';
    }
    return 'Active';
  };  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotations</h1>
          <p className="text-gray-600">Manage and track your quotations</p>
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
              placeholder="Search by company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent w-full sm:w-80"
            />
          </div>
          <Button
            text="Create Quotation"
            onClick={handleCreateQuotation}
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
            {/* Quotations Grid */}
            {quotations.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No quotations found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No quotations match your search criteria.' : 'Create your first quotation to get started.'}
                </p>
                {!searchTerm && (
                  <Button
                    text="Create Your First Quotation"
                    onClick={handleCreateQuotation}
                    bgColor="#C5677B"
                    hoverBgColor="#C599B6"
                    className="text-white font-semibold"
                    width="w-auto"
                  />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quotations.map((quotation) => (
                  <div key={quotation._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                    <div className="p-6">
                      {/* Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation)}`}>
                          {getStatusText(quotation)}
                        </span>                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewQuotation(quotation._id)}
                            className="text-primary-400 hover:text-primary-300 p-1 transition-colors"
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>                          <button
                            onClick={() => handleDownloadPdf(quotation._id, quotation.quoteToCompany?.companyName)}
                            disabled={isGeneratingPdf[quotation._id]}
                            className="text-green-600 hover:text-green-800 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isGeneratingPdf[quotation._id] ? "Generating PDF..." : "Download PDF"}
                          >
                            <FontAwesomeIcon 
                              icon={isGeneratingPdf[quotation._id] ? faSpinner : faDownload} 
                              className={isGeneratingPdf[quotation._id] ? "animate-spin" : ""} 
                            />
                          </button>
                          <button
                            onClick={() => handleEditQuotation(quotation)}
                            className="text-primary-300 hover:text-primary-200 p-1 transition-colors"
                            title="Edit Quotation"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuotation(quotation._id)}
                            className="text-red-600 hover:text-red-800 p-1 transition-colors"
                            title="Delete Quotation"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                          {quotation.quoteToCompany?.companyName || 'Unknown Company'}
                        </h3>
                        {quotation.quoteToCompany?.gstNumber && (
                          <p className="text-sm text-gray-600">GST: {quotation.quoteToCompany.gstNumber}</p>
                        )}
                      </div>

                      {/* Trip Info */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>From:</strong> {quotation.tripDetails?.from || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>To:</strong> {quotation.tripDetails?.to || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Load Type:</strong> {quotation.tripDetails?.fullOrPartLoad || 'N/A'}
                        </p>
                      </div>

                      {/* Material Info */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Materials:</strong> {quotation.materialDetails?.length || 0} item(s)
                        </p>
                        {quotation.materialDetails?.[0] && (
                          <p className="text-sm text-gray-500">
                            {quotation.materialDetails[0].materialName}
                            {quotation.materialDetails.length > 1 && ` +${quotation.materialDetails.length - 1} more`}
                          </p>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary-400" />
                          Created: {formatDate(quotation.createdAt)}
                        </span>
                        {quotation.quotationValidity?.expiryDate && (
                          <span>
                            Expires: {formatDate(quotation.quotationValidity.expiryDate)}
                          </span>
                        )}
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
        )}        {/* Modals */}
        {isModalOpen && (
          <QuotationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            quotation={selectedQuotation}
            mode={modalMode}
          />
        )}

        {isViewModalOpen && (
          <QuotationViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            quotation={selectedQuotation}
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

export default Quotations;