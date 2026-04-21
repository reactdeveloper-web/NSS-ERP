import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_EMPLOYEE_ALL_PATH = '/master/GetEmployeeAll';

export const getEmployeeAll = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_EMPLOYEE_ALL_PATH, {
    ...config,
    params,
  });
