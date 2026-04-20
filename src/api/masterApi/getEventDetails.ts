import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_EVENT_DETAILS_PATH = '/master/getEventDetails';

export const getEventDetails = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_EVENT_DETAILS_PATH, {
    ...config,
    params,
  });
