const FALLBACK_API_BASE_URL = 'https://deverp.narayanseva.org/erp';
const isDevelopmentServer = process.env.NODE_ENV === 'development';

export const URL = {
  baseAPIUrl: isDevelopmentServer
    ? '/erp'
    : process.env.REACT_APP_API_BASE_URL || FALLBACK_API_BASE_URL,
};
