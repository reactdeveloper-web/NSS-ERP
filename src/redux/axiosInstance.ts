// src/redux/axiosInstance.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, '');
const BASE_URL = API_BASE_URL
  ? `${API_BASE_URL}${API_BASE_URL.endsWith('/erp') ? '' : '/erp'}/`
  : '/api/erp/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

export default axiosInstance;
