import api from './api';

export const lorryReceiptService = {
  // Create a new lorry receipt
  createLorryReceipt: async (lorryReceiptData) => {
    try {
      const response = await api.post('/lorry-receipt/create-lorry-receipt', lorryReceiptData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all lorry receipts with optional filters
  getLorryReceipts: async (params = {}) => {
    try {
      const response = await api.get('/lorry-receipt', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a specific lorry receipt by ID
  getLorryReceiptById: async (id) => {
    try {
      const response = await api.get(`/lorry-receipt/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a lorry receipt
  updateLorryReceipt: async (id, lorryReceiptData) => {
    try {
      const response = await api.put(`/lorry-receipt/${id}`, lorryReceiptData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Delete a lorry receipt
  deleteLorryReceipt: async (id) => {
    try {
      const response = await api.delete(`/lorry-receipt/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get PDF for lorry receipt (server-side generation)
  getLorryReceiptPdf: async (id) => {
    try {
      // Using blob response type to handle PDF data
      const response = await api.get(`/lorry-receipt/${id}/pdf`, {
        responseType: 'blob'
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Return the blob URL for downloading or opening in a new tab
      return { 
        success: true,
        blobUrl: url,
        filename: `LorryReceipt-${id}.pdf` 
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default lorryReceiptService;
