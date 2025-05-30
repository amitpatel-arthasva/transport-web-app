import api from './api';

export const loadingSlipService = {
  // Create a new loading slip
  createLoadingSlip: async (loadingSlipData) => {
    try {
      const response = await api.post('/loading-slip/create-loading-slip', loadingSlipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all loading slips with optional filters
  getLoadingSlips: async (params = {}) => {
    try {
      const response = await api.get('/loading-slip', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a specific loading slip by ID
  getLoadingSlipById: async (id) => {
    try {
      const response = await api.get(`/loading-slip/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a loading slip
  updateLoadingSlip: async (id, loadingSlipData) => {
    try {
      const response = await api.put(`/loading-slip/${id}`, loadingSlipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a loading slip
  deleteLoadingSlip: async (id) => {
    try {
      const response = await api.delete(`/loading-slip/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Generate PDF for loading slip
  generatePDF: async (id) => {
    try {
      const response = await api.get(`/loading-slip/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default loadingSlipService;
