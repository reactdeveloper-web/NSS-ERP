// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/', // /erp/ // use proxy
});

export default axiosInstance;
