import apiClient from '../../../services/apiClient';

export const usersService = {
  async getUsers(signal) {
    const { data } = await apiClient.get('/users', { params: { limit: 0 }, signal });
    return data.users || [];
  },

  async getUserById(userId, signal) {
    const { data } = await apiClient.get(`/users/${userId}`, { signal });
    return data;
  },
};
