import api from './api';

const deliverySlipService = {
  // Create a new delivery slip
  createDeliverySlip: async (data) => {
    try {
      const response = await api.post('/delivery-slip/create-delivery-slip', data);
      return response.data;
    } catch (error) {
      console.error('Error creating delivery slip:', error);
      // Extract and return more specific error details if available
      if (error.response && error.response.data) {
        throw {
          ...error,
          details: error.response.data
        };
      }
      throw error;
    }
  },

  // Get all delivery slips with optional filters
  getDeliverySlips: async (params = {}) => {
    try {
      const response = await api.get('/delivery-slip', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery slips:', error);
      if (error.response && error.response.data) {
        throw {
          ...error,
          details: error.response.data
        };
      }
      throw error;
    }
  },

  // Get a specific delivery slip by ID
  getDeliverySlipById: async (id) => {
    try {
      const response = await api.get(`/delivery-slip/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching delivery slip with ID ${id}:`, error);
      if (error.response && error.response.data) {
        throw {
          ...error,
          details: error.response.data
        };
      }
      throw error;
    }
  },

  // Update a delivery slip
  updateDeliverySlip: async (id, data) => {
    try {
      const response = await api.put(`/delivery-slip/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating delivery slip with ID ${id}:`, error);
      if (error.response && error.response.data) {
        throw {
          ...error,
          details: error.response.data
        };
      }
      throw error;
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (id, data) => {
    try {
      const response = await api.put(`/delivery-slip/${id}/status`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating delivery status for ID ${id}:`, error);
      if (error.response && error.response.data) {
        throw {
          ...error,
          details: error.response.data
        };
      }
      throw error;
    }
  },

  // Delete a delivery slip
  deleteDeliverySlip: async (id) => {
    try {
      const response = await api.delete(`/delivery-slip/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting delivery slip with ID ${id}:`, error);
      if (error.response && error.response.data) {
        throw {
          ...error,
          details: error.response.data
        };
      }
      throw error;
    }
  }
};

export default deliverySlipService;
