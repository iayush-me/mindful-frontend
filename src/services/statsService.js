import apiClient from './apiClient';

const getStats = () => apiClient.get('/stats').then(res => res.data);

export default {
  getStats,
};
