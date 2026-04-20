import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const SEARCH_DONOR_DATA_PATH = '/master/searchDonorData';

export const searchDonorData = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(SEARCH_DONOR_DATA_PATH, {
    ...config,
    params,
  });
