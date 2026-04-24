// src/redux/axiosInstance.ts
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

type FallbackAxiosRequestConfig = AxiosRequestConfig & {
  _fallbackRetry?: boolean;
};

const env = import.meta.env;
const DEFAULT_PROXY_BASE_URL = '/api/erp/';

const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

const ensureErpBaseUrl = (value: string) => {
  const normalized = stripTrailingSlashes(value);
  return `${normalized}${normalized.endsWith('/erp') ? '' : '/erp'}/`;
};

const normalizeRelativeBaseUrl = (value: string) => `${stripTrailingSlashes(value)}/`;

const API_BASE_URL = stripTrailingSlashes(
  env.VITE_API_BASE_URL || env.REACT_APP_API_BASE_URL || '',
);

const API_FALLBACK_BASE_URL = stripTrailingSlashes(
  env.VITE_API_FALLBACK_BASE_URL || env.REACT_APP_API_FALLBACK_BASE_URL || '',
);

const BASE_URL = API_BASE_URL
  ? ensureErpBaseUrl(API_BASE_URL)
  : DEFAULT_PROXY_BASE_URL;

const FALLBACK_BASE_URL =
  env.DEV && API_FALLBACK_BASE_URL
    ? API_FALLBACK_BASE_URL.startsWith('http')
      ? ensureErpBaseUrl(API_FALLBACK_BASE_URL)
      : normalizeRelativeBaseUrl(API_FALLBACK_BASE_URL)
    : '';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config as FallbackAxiosRequestConfig | undefined;
    const responseStatus = Number(error.response?.status || 0);
    const shouldTryFallback =
      env.DEV &&
      !!FALLBACK_BASE_URL &&
      originalRequest &&
      !originalRequest._fallbackRetry &&
      (!error.response || responseStatus >= 500) &&
      FALLBACK_BASE_URL !== BASE_URL;

    if (!shouldTryFallback) {
      return Promise.reject(error);
    }

    originalRequest._fallbackRetry = true;
    originalRequest.baseURL = FALLBACK_BASE_URL;

    return axiosInstance(originalRequest);
  },
);

export default axiosInstance;
