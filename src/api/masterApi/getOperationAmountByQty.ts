import { AxiosRequestConfig } from 'axios';
import axiosInstance from 'src/redux/interceptor';

const GET_OPERATION_AMOUNT_BY_QTY_PATH = '/master/GetOperationAmountBYQty';

export const getOperationAmountByQty = (
  params: Record<string, unknown>,
  config: AxiosRequestConfig = {},
) =>
  axiosInstance.get(GET_OPERATION_AMOUNT_BY_QTY_PATH, {
    ...config,
    params,
  });
