// src/api/axiosInstance.ts
import axios from 'axios';

const normalizeBaseUrl = (baseUrl?: string) => {
  if (!baseUrl) {
    return '/erp/';
  }

  const trimmedBaseUrl = baseUrl.replace(/\/+$/, '');

  return trimmedBaseUrl.endsWith('/erp')
    ? `${trimmedBaseUrl}/`
    : `${trimmedBaseUrl}/erp/`;
};

// In development: REACT_APP_API_BASE_URL is empty and setupProxy forwards /erp/* to backend.
// In production: REACT_APP_API_BASE_URL can be either the host or host + /erp.
const BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

export default axiosInstance;
