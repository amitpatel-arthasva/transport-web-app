import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faTruck, 
  faBox, 
  faMoneyBill, 
  faCalendarAlt,
  faMapMarkerAlt,
  faFileAlt,
  faDownload,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';
import quotationService from '../../services/quotationService';
import { useToast } from '../common/ToastSystem';

const QuotationViewModal = ({ isOpen, onClose, quotation }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const toast = useToast();
  
  if (!isOpen || !quotation) return null;

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfBlob = await quotationService.generateQuotationPdf(quotation._id);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
        // Generate filename with company name and quotation number
      const companyName = quotation.quoteToCompany?.companyName || 'Unknown';
      const shortId = quotation._id.slice(-6).toUpperCase(); // Get last 6 characters
      const quotationNumber = quotation.quotationNumber || `QUO-${shortId}`;
      const filename = `${quotationNumber}_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };
  const getStatusColor = () => {
    const expiryDate = new Date(quotation.quotationValidity?.expiryDate);
    const today = new Date();
    
    if (expiryDate < today) {
      return 'text-red-600 bg-red-100 border-red-200';
    } else if (expiryDate - today < 7 * 24 * 60 * 60 * 1000) {
      return 'text-orange-600 bg-orange-100 border-orange-200';
    }
    return 'text-primary-400 bg-primary-50 border-primary-200';
  };

  const getStatusText = () => {
    const expiryDate = new Date(quotation.quotationValidity?.expiryDate);
    const today = new Date();
    
    if (expiryDate < today) {
      return 'Expired';
    } else if (expiryDate - today < 7 * 24 * 60 * 60 * 1000) {
      return 'Expiring Soon';
    }
    return 'Active';
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      showCloseButton={false}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-400 to-primary-300">
        <div className="text-white">
          <h2 className="text-2xl font-bold">Quotation Details</h2>
          <p className="text-primary-50 mt-1">
            Created on {formatDate(quotation.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Company Details */}
            <div className="bg-gray-50 rounded-lg p-4">              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                Company Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company Name</label>
                  <p className="text-gray-900 font-medium">
                    {quotation.quoteToCompany?.companyName || 'N/A'}
                  </p>
                </div>
                
                {quotation.quoteToCompany?.gstNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">GST Number</label>
                    <p className="text-gray-900">{quotation.quoteToCompany.gstNumber}</p>
                  </div>
                )}
                
                {quotation.quoteToCompany?.contactNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Number</label>
                    <p className="text-gray-900">{quotation.quoteToCompany.contactNumber}</p>
                  </div>
                )}
                
                {quotation.quoteToCompany?.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-900">
                      {quotation.quoteToCompany.address}
                      {quotation.quoteToCompany.city && `, ${quotation.quoteToCompany.city}`}
                      {quotation.quoteToCompany.state && `, ${quotation.quoteToCompany.state}`}
                      {quotation.quoteToCompany.pinCode && ` - ${quotation.quoteToCompany.pinCode}`}
                    </p>
                  </div>
                )}
                
                {quotation.quoteToCompany?.inquiryVia && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Inquiry Via</label>
                    <p className="text-gray-900">{quotation.quoteToCompany.inquiryVia}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
                Trip Information
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">From</label>
                    <p className="text-gray-900 font-medium">
                      {quotation.tripDetails?.from || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">To</label>
                    <p className="text-gray-900 font-medium">
                      {quotation.tripDetails?.to || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Load Type</label>
                    <p className="text-gray-900">
                      {quotation.tripDetails?.fullOrPartLoad || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Trip Type</label>
                    <p className="text-gray-900">
                      {quotation.tripDetails?.tripType || 'N/A'}
                    </p>
                  </div>
                </div>
                
                {quotation.tripDetails?.loadingDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Loading Date</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                      {formatDate(quotation.tripDetails.loadingDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Material Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBox} className="text-orange-600" />
                Material Details
              </h3>
              
              <div className="space-y-4">
                {quotation.materialDetails?.map((material, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {material.materialName || `Material ${index + 1}`}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {material.packagingType && (
                        <div>
                          <span className="text-gray-600">Packaging:</span>
                          <span className="ml-1 text-gray-900">{material.packagingType}</span>
                        </div>
                      )}
                      
                      {material.weight?.value && (
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="ml-1 text-gray-900">
                            {material.weight.value} {material.weight.unit}
                          </span>
                        </div>
                      )}
                      
                      {material.numberOfArticles && (
                        <div>
                          <span className="text-gray-600">Articles:</span>
                          <span className="ml-1 text-gray-900">{material.numberOfArticles}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )) || <p className="text-gray-500">No material details available</p>}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} className="text-purple-600" />
                Vehicle Details
              </h3>
              
              <div className="space-y-4">
                {quotation.vehicleDetails?.map((vehicle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {vehicle.vehicleType || `Vehicle ${index + 1}`}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {vehicle.numberOfTrucks && (
                        <div>
                          <span className="text-gray-600">Number of Trucks:</span>
                          <span className="ml-1 text-gray-900">{vehicle.numberOfTrucks}</span>
                        </div>
                      )}
                      
                      {vehicle.weightGuarantee?.value && (
                        <div>
                          <span className="text-gray-600">Weight Guarantee:</span>
                          <span className="ml-1 text-gray-900">
                            {vehicle.weightGuarantee.value} {vehicle.weightGuarantee.unit}
                          </span>
                        </div>
                      )}
                      
                      {vehicle.freightRate?.value && (
                        <div>
                          <span className="text-gray-600">Freight Rate:</span>
                          <span className="ml-1 text-gray-900">
                            ₹{vehicle.freightRate.value} {vehicle.freightRate.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )) || <p className="text-gray-500">No vehicle details available</p>}
              </div>
            </div>

            {/* Freight Breakup */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
                Freight Breakup
              </h3>
              
              <div className="space-y-3">
                {quotation.freightBreakup?.rate?.value && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Base Rate</label>
                    <p className="text-gray-900 font-medium">
                      {formatCurrency(quotation.freightBreakup.rate.value)} ({quotation.freightBreakup.rate.type})
                    </p>
                  </div>
                )}
                
                {quotation.freightBreakup?.applicableGST && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Applicable GST</label>
                    <p className="text-gray-900">{quotation.freightBreakup.applicableGST}</p>
                  </div>
                )}
                
                {quotation.freightBreakup?.extraCharges && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Extra Charges</label>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                      {quotation.freightBreakup.extraCharges.loadingCharge && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loading:</span>
                          <span className="text-gray-900">
                            {formatCurrency(quotation.freightBreakup.extraCharges.loadingCharge)}
                          </span>
                        </div>
                      )}
                      {quotation.freightBreakup.extraCharges.unloadingCharge && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unloading:</span>
                          <span className="text-gray-900">
                            {formatCurrency(quotation.freightBreakup.extraCharges.unloadingCharge)}
                          </span>
                        </div>
                      )}
                      {quotation.freightBreakup.extraCharges.tollTax && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Toll Tax:</span>
                          <span className="text-gray-900">
                            {formatCurrency(quotation.freightBreakup.extraCharges.tollTax)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {quotation.freightBreakup?.totalFreightWithGst && (
                  <div className="border-t pt-2">
                    <label className="text-sm font-medium text-gray-600">Total Freight (with GST)</label>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(quotation.freightBreakup.totalFreightWithGst)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Terms */}
            <div className="bg-gray-50 rounded-lg p-4">              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-primary-400" />
                Payment Terms
              </h3>
              
              <div className="space-y-3">
                {quotation.paymentTerms?.payBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pay By</label>
                    <p className="text-gray-900">{quotation.paymentTerms.payBy}</p>
                  </div>
                )}
                
                {quotation.paymentTerms?.driverCashRequired && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Driver Cash Required</label>
                    <p className="text-gray-900">
                      {formatCurrency(quotation.paymentTerms.driverCashRequired)}
                    </p>
                  </div>
                )}
                
                {quotation.paymentTerms?.paymentRemark && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Remarks</label>
                    <p className="text-gray-900">{quotation.paymentTerms.paymentRemark}</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quotation Validity & Demurrage */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Quotation Validity */}            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-orange-600" />
                Quotation Validity
              </h3>
              
              <div className="space-y-3">
                {quotation.quotationValidity?.validUpTo && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Valid Up To</label>
                    <p className="text-gray-900">
                      {quotation.quotationValidity.validUpTo.type === 'Days' 
                        ? `${quotation.quotationValidity.validUpTo.value} days from creation`
                        : formatDate(quotation.quotationValidity.validUpTo.value)
                      }
                    </p>
                  </div>
                )}
                
                {quotation.quotationValidity?.expiryDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                    <p className="text-gray-900 font-medium">
                      {formatDate(quotation.quotationValidity.expiryDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Demurrage */}
            {(quotation.demurrage?.chargePerHour?.value || quotation.demurrage?.applicableAfterHours) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMoneyBill} className="text-red-600" />
                  Demurrage
                </h3>
                
                <div className="space-y-3">
                  {quotation.demurrage.chargePerHour?.value && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Charge</label>
                      <p className="text-gray-900">
                        {formatCurrency(quotation.demurrage.chargePerHour.value)} {quotation.demurrage.chargePerHour.type}
                      </p>
                    </div>
                  )}
                  
                  {quotation.demurrage.applicableAfterHours && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Applicable After</label>
                      <p className="text-gray-900">{quotation.demurrage.applicableAfterHours} hours</p>
                    </div>
                  )}
                </div>
              </div>
            )}          </div>
        </div>        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faDownload} />
            )}
            {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button
            onClick={onClose}
            className="bg-primary-400 hover:bg-primary-300 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
    </Modal>
  );
};

export default QuotationViewModal;
