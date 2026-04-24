import axiosInstance from "src/redux/axiosInstance";
import { masterApiPaths } from "src/utils/masterApiPaths";

export const getAccountsApi = async (mobile: string) => {
  try {
    const response = await axiosInstance.get(masterApiPaths.getAccounts, {
      params: {
        NGCODE: 0,
        ContactNo: mobile,
        DATAFLAG: "GANGOTRI",
        VMID: 0,
        pageindex: 1,
        pagesize: 20,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Accounts API Error:", error);
    throw error;
  }
};