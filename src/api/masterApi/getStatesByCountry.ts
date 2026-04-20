import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_STATES_BY_COUNTRY_PATH = '/master/GetStatesByCountry';

export const getStatesByCountry = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_STATES_BY_COUNTRY_PATH, {
    ...config,
    params,
  });
