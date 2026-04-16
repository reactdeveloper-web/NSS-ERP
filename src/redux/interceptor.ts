// src/api/interceptor.ts
import axiosInstance from './axiosInstance';

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token && config.url !== '/login/UserLogin') {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    // ✅ Custom header
    // config.headers.APIKey = 'NSSAPI4SANSTHANUAT';
    return config;
  },
  error => Promise.reject(error),
);

export default axiosInstance;
