import api from './api';

const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        return response.data.data.user;
      }
      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      if (response.data.success) {
        // Update localStorage with new user data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return response.data.data.user;
      }
      throw new Error(response.data.message || 'Failed to update profile');    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  }
};

export default userService;
