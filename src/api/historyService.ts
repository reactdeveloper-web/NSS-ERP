import axiosInstance from "src/redux/axiosInstance";
import { masterApiPaths } from "src/utils/masterApiPaths";

export interface GetCallActivitiesParams {
  NGCODE: number;
  ContactNo: number;
  QDATE: string;
  DATAFLAG: string;
  EMAILID: string;
  VMID: number;
  pageindex: number;
  pagesize: number;
}

export interface ActivityItem {
  Id: number;
  Activity_Type: string;
  Activity_status: string;
  Activity_Detail: string;
  Activity_date: string;
  Activity_by: string;
}

export interface CallActivitiesResponse {
  Data: ActivityItem[];
  Meta: {
    TotalRecords: number;
  };
}

export const getCallActivitiesService = async (
  params: GetCallActivitiesParams
): Promise<CallActivitiesResponse> => {
  const res = await axiosInstance.get(masterApiPaths.getCallActivities, {
    params,
  });

  return res.data;
};