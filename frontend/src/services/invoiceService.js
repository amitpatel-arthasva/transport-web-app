import api from './api';

const invoiceService = {
  // Get all invoices (from lorry receipts)
  getInvoices: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/invoice${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Generate and download invoice PDF
  generateInvoicePdf: async (id) => {
    try {
      const response = await api.get(`/invoice/${id}/pdf`, {
        responseType: 'blob'
      });
      
      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
        // Extract filename from Content-Disposition header set by backend
      let filename = 'invoice.pdf'; // Default fallback
      const contentDisposition = response.headers['content-disposition'];
      console.log('Invoice - All response headers:', response.headers);
      console.log('Invoice - Content-Disposition header:', contentDisposition);
      
      if (contentDisposition) {
        // More robust regex to handle different Content-Disposition formats
        const filenameMatch = contentDisposition.match(/filename[*]?=([^;]+)/);
        console.log('Invoice - Filename match result:', filenameMatch);
        if (filenameMatch && filenameMatch[1]) {
          // Remove quotes if present and ensure .pdf extension
          let extractedFilename = filenameMatch[1].replace(/['"]/g, '').trim();
          if (!extractedFilename.endsWith('.pdf')) {
            extractedFilename += '.pdf';
          }
          filename = extractedFilename;
          console.log('Invoice - Final extracted filename:', filename);
        }
      } else {
        console.log('Invoice - No Content-Disposition header found');
      }
      
      return { 
        success: true,
        blobUrl: url,
        filename: filename 
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },  // Download invoice PDF (helper method)
  downloadInvoicePdf: async (id, customFilename) => {
    try {
      const result = await invoiceService.generateInvoicePdf(id);
      
      // Use the filename from backend or the custom one provided
      const filename = customFilename || result.filename;
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = result.blobUrl;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(result.blobUrl);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default invoiceService;
