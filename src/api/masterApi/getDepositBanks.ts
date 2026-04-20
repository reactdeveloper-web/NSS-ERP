import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_DEPOSIT_BANKS_PATH = '/master/GetDepositBanks';

export const getDepositBanks = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_DEPOSIT_BANKS_PATH, {
    ...config,
    params,
  });
