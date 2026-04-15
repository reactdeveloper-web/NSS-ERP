// src/api/axiosInstance.ts
import axios from 'axios';
import { URL } from '../constants/urls';

const apiBaseUrl =
  process.env.NODE_ENV === 'development'
    ? '/erp'
    : process.env.REACT_APP_API_BASE_URL ||
      'https://deverp.narayanseva.org/erp';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export default axiosInstance;
