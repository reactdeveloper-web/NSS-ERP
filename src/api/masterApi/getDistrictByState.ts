import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_DISTRICT_BY_STATE_PATH = '/master/GetDistrictByState';

export const getDistrictByState = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_DISTRICT_BY_STATE_PATH, {
    ...config,
    params,
  });
