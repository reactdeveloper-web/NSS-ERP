// // src/api/interceptor.ts
// import axiosInstance from './axiosInstance';

// axiosInstance.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('accessToken');
//     if (token && config.url !== '/login/UserLogin') {
//       config.headers.Authorization = `Bearer ${token}`;
//       config.headers['Content-Type'] = 'application/json';
//     }
//     // ✅ Custom header
//     // config.headers.APIKey = 'NSSAPI4SANSTHANUAT';
//     return config;
//   },
//   error => Promise.reject(error),
// );

// export default axiosInstance;

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

type RetryableAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const LOGIN_PATH = '/login/UserLogin';
const REFRESH_PATH = '/login/RefreshToken';

const clearAuthStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('loginTimestamp');
  localStorage.removeItem('user');
};

const getRefreshUrl = () => {
  const baseUrl = String(axiosInstance.defaults.baseURL || '').replace(/\/+$/, '');
  return `${baseUrl}${REFRESH_PATH}`;
};

let refreshRequest: Promise<{ token?: string; refreshToken?: string } | null> | null =
  null;

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');

    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/json';

    if (token && config.url !== LOGIN_PATH && config.url !== REFRESH_PATH) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const requestUrl = String(originalRequest.url || '');
    const isAuthEndpoint =
      requestUrl.includes(LOGIN_PATH) || requestUrl.includes(REFRESH_PATH);

    if (
      error.response.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          throw new Error('Missing refresh credentials.');
        }

        refreshRequest = axios
          .post(
            getRefreshUrl(),
            {
              AccessToken: accessToken,
              RefreshToken: refreshToken,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(response => {
            const nextAccessToken = response.data?.token;
            const nextRefreshToken = response.data?.refreshToken;

            if (!nextAccessToken || !nextRefreshToken) {
              throw new Error('Refresh token response missing tokens.');
            }

            localStorage.setItem('accessToken', nextAccessToken);
            localStorage.setItem('refreshToken', nextRefreshToken);
            localStorage.setItem('loginTimestamp', Date.now().toString());

            axiosInstance.defaults.headers.common.Authorization = `Bearer ${nextAccessToken}`;

            return {
              token: nextAccessToken,
              refreshToken: nextRefreshToken,
            };
          })
          .finally(() => {
            refreshRequest = null;
          });
      }

      const refreshedTokens = await refreshRequest;

      if (!refreshedTokens?.token) {
        throw new Error('Unable to refresh access token.');
      }

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${refreshedTokens.token}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
