import apiClient from './apiClient';

const submitMood = (message) => apiClient.post('/mood', { message }).then(res => res.data);

const analyzeSentiment = (message) => apiClient.post('/mood', { message }).then(res => res.data);
export default {
  submitMood,
  analyzeSentiment,
};
