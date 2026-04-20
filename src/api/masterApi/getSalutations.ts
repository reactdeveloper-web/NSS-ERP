import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_SALUTATIONS_PATH = '/master/GetSalutations';

export const getSalutations = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_SALUTATIONS_PATH, {
    ...config,
    params,
  });
