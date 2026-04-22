import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_DASHBOARD_PATH = '/master/GetDashboard';

export interface GetDashboardPayload {
  empnum: string | number;
  DataFlag: string;
  Type: string | number;
  Show: string;
}

export const getDashboard = (
  payload: GetDashboardPayload,
  config: AxiosRequestConfig = {},
) => axiosInstance.post(GET_DASHBOARD_PATH, payload, config);
