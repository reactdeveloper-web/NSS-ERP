export interface DashboardItem {
  RecordCount: number;
  Description: string;
  Panel: string;
  PanelId: number;
  iconpath: string;
  service_status: string;
  source?: 'api' | 'static';
}

export interface TaskItem {
  RowNumber: number;
  RecordCount: number;
  penalty?: string;
  sr_no?: number;
  emp_num?: number;
  tid: number;
  pg_id: number;
  name_eng: string;
  from_doe: string;
  to_doe: string;
  task: string;
  days: number;
  tdate: string;
  responsible_person: string;
  completed: string;
  not_comp_reason: string | null;
  confirm_by_name: string | null;
  due_task_date?: string;
  revertcount?: string;
  attachmentdneed?: boolean;
  video_url?: string | null;
  tfp?: string;
  ttime?: string;
  ttype?: string;
  cdate?: string;
  reasondtl?: string;
  taskremakrs?: string | null;
  taskfiles?: string | null;
  revert_flag?: string;
  revert_remark?: string | null;
  address_eng?: string;
  confirm_by?: number;
  data_flag?: string;
  check_remark?: string;
  RemarksList?: unknown[];
  FilesList?: unknown[];
}

export interface StaticTaskRow {
  id: string;
  title: string;
  subTitle: string;
  department: string;
  status: string;
}

export interface BillDetailItem {
  RowNumber?: number;
  RecordCount?: number;
  vendorSadhak: string;
  material: string;
  billId: string | number;
  billNo: string | number;
  billDate: string | number;
  billAmount: string | number;
  status: string;
  raw: Record<string, unknown>;
}

export interface BranchApprovalItem {
  RowNumber?: number;
  RecordCount?: number;
  code: string | number;
  sadhakId: string | number;
  letterId: string | number;
  name: string;
  detail: string;
  status: string;
  amountApproved: string | number;
  approveBy: string | number;
  approveByName: string;
  remark: string;
  voucherCode: string | number;
  fileList: Array<{
    imagePath: string;
  }>;
  raw: Record<string, unknown>;
}

export interface IssueVerificationItem {
  RowNumber?: number;
  RecordCount?: number;
  srNo: string | number;
  issueDate: string;
  sadhakName: string;
  handOverOpdId: string | number;
  category: string;
  itemName: string;
  quantityIssued: string | number;
  unit: string;
  status: string;
  empId: string | number;
  issueId: string | number;
  itemId: string | number;
  rrsId: string | number;
  handedOver: string;
  raw: Record<string, unknown>;
}

export interface MeetingPointItem {
  RowNumber?: number;
  RecordCount?: number;
  srNo: string | number;
  code: string | number;
  date: string;
  assignName: string;
  priority: string;
  dueDate: string;
  title: string;
  detail: string;
  complete: string;
  employeeName: string;
  employeeNumber: string | number;
  designation: string;
  department: string;
  remark: string;
  previousComments: string;
  filePath: string;
  completeProof: string;
  assignId: string | number;
  autoId: string | number;
  raw: Record<string, unknown>;
}
