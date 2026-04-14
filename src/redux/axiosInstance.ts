// src/api/axiosInstance.ts
import axios from 'axios';

const apiBaseUrl =
  process.env.NODE_ENV === 'development'
    ? '/erp'
    : process.env.REACT_APP_API_BASE_URL ||
      'https://deverp.narayanseva.org/erp';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

export default axiosInstance;
