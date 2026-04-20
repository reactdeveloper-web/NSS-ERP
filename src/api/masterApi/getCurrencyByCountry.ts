import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_CURRENCY_BY_COUNTRY_PATH = '/master/GetCurrencyByCountry';

export const getCurrencyByCountry = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_CURRENCY_BY_COUNTRY_PATH, {
    ...config,
    params,
  });
