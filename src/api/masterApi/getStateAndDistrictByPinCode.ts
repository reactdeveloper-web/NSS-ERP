import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_STATE_AND_DISTRICT_BY_PINCODE_PATH =
  '/master/GetStateAndDistrictByPinCode';

export const getStateAndDistrictByPinCode = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.post(GET_STATE_AND_DISTRICT_BY_PINCODE_PATH, null, {
    ...config,
    params,
  });
