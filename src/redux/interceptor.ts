// src/api/interceptor.ts
import axiosInstance from './axiosInstance';

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');

    config.headers['Content-Type'] = 'application/json';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default axiosInstance;
