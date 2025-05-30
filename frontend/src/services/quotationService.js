import api from './api';

export const quotationService = {
  // Create a new quotation
  createQuotation: async (quotationData) => {
    try {
      const response = await api.post('/quotation/create-quotation', quotationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all quotations with optional filters
  getQuotations: async (params = {}) => {
    try {
      const response = await api.get('/quotation', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a specific quotation by ID
  getQuotationById: async (id) => {
    try {
      const response = await api.get(`/quotation/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a quotation
  updateQuotation: async (id, quotationData) => {
    try {
      const response = await api.put(`/quotation/${id}`, quotationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a quotation
  deleteQuotation: async (id) => {
    try {
      const response = await api.delete(`/quotation/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default quotationService;