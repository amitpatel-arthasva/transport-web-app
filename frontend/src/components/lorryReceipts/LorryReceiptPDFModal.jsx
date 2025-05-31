import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';
import LorryReceiptTemplate from './LorryReceiptTemplate';
import { lorryReceiptService } from '../../services/lorryReceiptService';

const LorryReceiptPDFModal = ({ isOpen, onClose, lorryReceiptData, lorryReceiptNumber }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Use server-side PDF generation for consistent filename format
      const result = await lorryReceiptService.getLorryReceiptPdf(lorryReceiptData._id);
      
      if (result.success) {
        // Create a temporary link to download the PDF
        const link = document.createElement('a');
        link.href = result.blobUrl;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(result.blobUrl);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !lorryReceiptData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Lorry Receipt PDF Preview
            </h2>
            <p className="text-gray-600">LR No: {lorryReceiptNumber}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-primary-400 hover:bg-primary-300 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faDownload} />
              )}
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
              Close
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="max-h-[70vh] overflow-auto border border-gray-200 bg-gray-50 p-4">
          <div id="lr-template-for-pdf" className="bg-white">
            <LorryReceiptTemplate {...lorryReceiptData} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Preview of the lorry receipt that will be generated as PDF</p>
        </div>
      </div>
    </Modal>
  );
};

export default LorryReceiptPDFModal;
