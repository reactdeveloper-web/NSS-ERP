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

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const requestConfig = error?.config || {};
    const response = error?.response;

    // Temporary debug logging for production/local serve API failures.
    console.error('API request failed', {
      message: error?.message || 'Unknown axios error',
      method: requestConfig.method || 'get',
      url: `${requestConfig.baseURL || ''}${requestConfig.url || ''}`,
      params: requestConfig.params || null,
      status: response?.status || null,
      statusText: response?.statusText || null,
      data: response?.data || null,
    });

    return Promise.reject(error);
  },
);

export default axiosInstance;
