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

export interface PartyAdvanceItem {
  RowNumber?: number;
  RecordCount?: number;
  code: string | number;
  entryDate: string;
  billDueDate: string;
  vendorName: string;
  description: string;
  status: string;
  raw: Record<string, unknown>;
}

export interface SadhakAdvanceItem {
  RowNumber?: number;
  RecordCount?: number;
  code: string | number;
  entryDate: string;
  billDueDate: string;
  employeeName: string;
  description: string;
  status: string;
  raw: Record<string, unknown>;
}

export interface PaymentTermsVerifyItem {
  RowNumber?: number;
  RecordCount?: number;
  qcsAppCode: string | number;
  poId: string | number;
  quotationNo: string | number;
  autoId: string | number;
  vendorName: string;
  vendorId: string | number;
  paymentTerm: string;
  paymentType: string;
  payDate: string;
  scopeOfWork: string;
  amount: string | number;
  status: string;
  remark: string;
  qcsFiles: string;
  orderLink: string;
  verifyTermsList: Array<{
    srno: string | number;
    amcSrno: string | number;
    workComplete: string;
    maintenanceDesc: string;
    maintenanceRemark: string;
  }>;
  raw: Record<string, unknown>;
}

export interface PurchaseQuotationItem {
  RowNumber?: number;
  RecordCount?: number;
  qcsId: string | number;
  qcsDate: string;
  qcsType: string;
  vendorName1: string;
  vendorName2: string;
  vendorName3: string;
  netTotal1: string | number;
  netTotal2: string | number;
  netTotal3: string | number;
  location: string;
  qcsFile: string;
  qcsStage: string;
  lineItems: Array<{
    srNo: string | number;
    itemName: string;
    quantity: string | number;
    unit: string;
    rate1: string | number;
    rate2: string | number;
    rate3: string | number;
    greenColor: string;
    lastPurchaseHistory: unknown[];
  }>;
  paymentTerms: Array<{
    payTerms: string;
    percentage: string | number;
    assignToName: string;
  }>;
  termsAndConditions: unknown[];
  raw: Record<string, unknown>;
}

export interface RrsStatusItem {
  RowNumber?: number;
  RecordCount?: number;
  id: string | number;
  employeeName: string;
  storeName: string;
  itemName: string;
  employeeMobile: string;
  rrsType: string;
  raw: Record<string, unknown>;
}

export interface MaterialQualityItem {
  RowNumber?: number;
  RecordCount?: number;
  rmId: string | number;
  poNo: string | number;
  date: string;
  vendorName: string;
  mobile: string;
  sadhakName: string;
  storeName: string;
  lineItems: Array<{
    rrsFor: string | number;
    demandBy: string | number;
    sadhakName: string;
    itemName: string;
    amount: string | number;
    poSrNo: string | number;
    companyName: string;
    pendingQuantity: string | number;
    unit: string;
    qmCode: string | number;
    qmStatus: string;
    remark: string;
    qualityQuestions: unknown[];
  }>;
  raw: Record<string, unknown>;
}

export interface LeaveApprovalItem {
  RowNumber?: number;
  RecordCount?: number;
  leaveId: string | number;
  sadhakName: string;
  applyDate: string;
  fromDate: string;
  toDate: string;
  applied: string | number;
  leaveType: string;
  leaveDay: string;
  chargeGiven: string;
  sanction: string;
  department: string;
  reason: string;
  raw: Record<string, unknown>;
}

export interface ActionOnRecruitmentItem {
  RowNumber?: number;
  RecordCount?: number;
  applicationNo: string | number;
  name: string;
  dob: string;
  sex: string;
  departmentName: string;
  postName: string;
  salary: string | number;
  raw: Record<string, unknown>;
}

export interface WorkOrderItem {
  RowNumber?: number;
  RecordCount?: number;
  orderNo: string | number;
  date: string;
  createdBy: string;
  vendorName1: string;
  vendorName2: string;
  vendorName3: string;
  netAmount1: string | number;
  netAmount2: string | number;
  netAmount3: string | number;
  closeRenewed: string;
  contractType: string;
  place: string;
  scopeOfWork: string;
  filePath: string;
  status: string;
  lineItems: Array<{
    srNo: string | number;
    workScope: string;
    totalPrice1: string | number;
    totalPrice2: string | number;
    totalPrice3: string | number;
    insurance: string;
    dateFrom: string;
    dateTo: string;
    remark: string;
  }>;
  paymentTerms: Array<{
    payTerms: string;
    percentage: string | number;
    amount: string | number;
    payType: string;
    assignToName: string;
    ptVerificationRequired: string;
  }>;
  termsAndConditions: Array<{
    id: string | number;
    srNo: string | number;
    particulars: string;
    description: string;
    selected: boolean;
  }>;
  raw: Record<string, unknown>;
}
