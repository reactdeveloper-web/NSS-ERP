import axios from 'axios';

const FALLBACK_API_BASE_URL = 'https://deverp.narayanseva.org/erp';
const isDevelopmentServer = process.env.NODE_ENV === 'development';

const apiBaseUrl = isDevelopmentServer
  ? '/erp'
  : process.env.REACT_APP_API_BASE_URL || FALLBACK_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

if (typeof window !== 'undefined') {
  console.log('Axios config debug', {
    nodeEnv: process.env.NODE_ENV,
    origin: window.location.origin,
    hostname: window.location.hostname,
    apiBaseUrl,
  });
}

export default axiosInstance;
