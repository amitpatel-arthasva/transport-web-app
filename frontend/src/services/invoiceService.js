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
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download invoice PDF (helper method)
  downloadInvoicePdf: async (id, filename) => {
    try {
      const pdfBlob = await invoiceService.generateInvoicePdf(id);
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default invoiceService;
