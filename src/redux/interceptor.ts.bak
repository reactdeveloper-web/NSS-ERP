// src/api/interceptor.ts
import axiosInstance from './axiosInstance';
axiosInstance.interceptors.request.use(
  // eslint-disable-next-line prettier/prettier
  (config) => {
    const token = 'uiouoiuoiuoiuiou'; //localStorage.getItem('token'); // or from redux
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ✅ Custom header
    config.headers.APIKey = 'NSSAPI4SANSTHANUAT';
    return config;
  },
  // eslint-disable-next-line prettier/prettier
  (error) => Promise.reject(error)
);

export default axiosInstance;