// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: '/erp/', // /erp/ // use proxy
  // baseURL: 'https://deverp.narayanseva.org/erp/',
  baseURL: 'https://d23605ra7slvxy.cloudfront.net/erp/',
});

export default axiosInstance;
