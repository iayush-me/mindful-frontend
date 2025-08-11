import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_PUBLIC_BACKEND_URL, // or your API base
});

// Add the token automatically to every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;