import apiClient from './apiClient';

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return apiClient.post('/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};

export const updateProfile = (profile) => {
  const cleanProfile = Object.fromEntries(
    Object.entries(profile).filter(([k, v]) => v !== "" && v !== undefined && v !== null)
  );
  return apiClient.patch('/user/profile', cleanProfile).then(res => res.data);
};

export const changePassword = (newPassword) =>
  apiClient.post('/user/password', { password: newPassword }).then(res => res.data);

export const getUserProfile = () => {
  const token = localStorage.getItem('token');  // <--- Get token from storage
  return apiClient.get('/user/profile', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);
};

export default {
  uploadAvatar,
  updateProfile,
  changePassword,
  getUserProfile,
};
