// src/api/axiosInstance.ts
import axios from 'axios';

// In development: REACT_APP_API_BASE_URL is empty → CRA proxy forwards /erp/* to backend
// In production (S3/CloudFront): REACT_APP_API_BASE_URL = 'https://deverp.narayanseva.org'
const BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/erp/`
  : '/erp/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
