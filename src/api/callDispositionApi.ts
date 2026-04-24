import axiosInstance from "src/redux/axiosInstance";
import { masterApiPaths } from "src/utils/masterApiPaths";

export const getCallTypesApi = async () => {
  const res = await axiosInstance.get(masterApiPaths.getCallTypes, {
    params: {
      calltypeid: 0,
      dataflag: "GANGOTRI",
      pageindex: 1,
      pagesize: 2000,
    },
  });
  return res.data;
};

export const getCallSubTypesApi = async (callTypeId: number) => {
  const res = await axiosInstance.get(masterApiPaths.getCallSubTypes, {
    params: {
      calltypeid: callTypeId,
      status: "A",
      pageindex: 1,
      pagesize: 500,
      data_flag: "GANGOTRI",
    },
  });
  return res.data;
};

export const getCallSubTypeConfigApi = async (configId: string) => {
  const res = await axiosInstance.get(masterApiPaths.getCallSubTypeConfig, {
    params: {
      calltypedid: configId,
      pageindex: 1,
      pagesize: 2000,
    },
  });
  return res.data;
};