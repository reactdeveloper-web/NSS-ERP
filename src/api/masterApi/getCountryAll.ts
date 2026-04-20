import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_COUNTRY_ALL_PATH = '/master/GetCountryAll';

export const getCountryAll = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_COUNTRY_ALL_PATH, {
    ...config,
    params,
  });
