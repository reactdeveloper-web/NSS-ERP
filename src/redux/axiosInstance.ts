// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/erp/', // /erp/ // use proxy
  // baseURL: 'https://deverp.narayanseva.org/erp/',
});

export default axiosInstance;
