import axios from 'axios';

const env = import.meta.env;
const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

const apiBaseUrl = stripTrailingSlashes(env.VITE_API_BASE_URL || '');

const baseURL = apiBaseUrl
  ? `${apiBaseUrl}${apiBaseUrl.endsWith('/erp') ? '' : '/erp'}/`
  : '/api/erp/';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
