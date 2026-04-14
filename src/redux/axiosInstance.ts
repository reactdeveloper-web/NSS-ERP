// src/api/axiosInstance.ts
import axios from 'axios';
import { URL } from '../constants/urls';

const axiosInstance = axios.create({
  // baseURL: '/erp/', // /erp/ // use proxy
  baseURL: `${URL.baseAPIUrl}/erp/`,
  // baseURL: 'https://deverp.narayanseva.org/erp/', // /erp/ // use proxy
});

export default axiosInstance;
