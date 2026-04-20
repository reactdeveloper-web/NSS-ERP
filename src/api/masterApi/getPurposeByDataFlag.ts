import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_PURPOSE_BY_DATA_FLAG_PATH = '/master/GetPurposeByDataFlag';

export const getPurposeByDataFlag = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_PURPOSE_BY_DATA_FLAG_PATH, {
    ...config,
    params,
  });
