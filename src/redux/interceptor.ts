// src/api/interceptor.ts
import axiosInstance from './axiosInstance';

axiosInstance.interceptors.request.use(
  // eslint-disable-next-line prettier/prettier
  config => {
    const token = localStorage.getItem('accessToken');
    //console.log('token',token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    // ✅ Custom header
    config.headers.APIKey = 'NSSAPI4SANSTHANUAT';
    return config;
  },
  // eslint-disable-next-line prettier/prettier
  error => Promise.reject(error),
);

export default axiosInstance;
