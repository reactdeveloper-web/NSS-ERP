import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_YOJNA_BY_PURPOSE_AND_CURRENCY_PATH =
  '/master/GetYojnaByPurposeAndCurrency';

export const getYojnaByPurposeAndCurrency = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_YOJNA_BY_PURPOSE_AND_CURRENCY_PATH, {
    ...config,
    params,
  });
