import apiClient from './apiClient';

const register = (email, password) =>
  apiClient.post('/register', { email, password }).then(res => res.data);

const login = (email, password) =>
  apiClient.post('/login', { email, password }).then(res => res.data);

export default { register, login };
