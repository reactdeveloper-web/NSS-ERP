import axios from 'axios';

const env = import.meta.env;
const apiBaseUrl = (
  env.VITE_API_BASE_URL ||
  env.REACT_APP_API_BASE_URL ||
  ''
).replace(/\/+$/, '');

const baseURL = apiBaseUrl
  ? `${apiBaseUrl}${apiBaseUrl.endsWith('/erp') ? '' : '/erp'}/`
  : '/api/erp/';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
