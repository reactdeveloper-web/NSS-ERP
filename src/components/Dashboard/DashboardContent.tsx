import React, { useCallback, useEffect, useState } from 'react';
import { ActionOnCorrespondenceTable } from './components/ActionOnCorrespondenceTable';
import { getDashboard, getEmployeeAll } from 'src/api/masterApi';
import { PageToolbar } from 'src/components/Common/PageToolbar';
import axiosInstance from 'src/redux/interceptor';
import { ActionOnRecruitmentTable } from './components/ActionOnRecruitmentTable';
import { BillDetailsTable } from './components/BillDetailsTable';
import { BranchApprovalTable } from './components/BranchApprovalTable';
import { ChargeAcceptTable } from './components/ChargeAcceptTable';
import { EmployeeApplicationTable } from './components/EmployeeApplicationTable';
import { IncentiveApprovalTable } from './components/IncentiveApprovalTable';
import { IssueVerificationTable } from './components/IssueVerificationTable';
import { LeaveApprovalTable } from './components/LeaveApprovalTable';
import { MaterialQualityTable } from './components/MaterialQualityTable';
import { MeetingPointTable } from './components/MeetingPointTable';
import { PartyAdvanceTable } from './components/PartyAdvanceTable';
import { PaymentTermsVerificationTable } from './components/PaymentTermsVerificationTable';
import { PurchaseQuotationApprovalTable } from './components/PurchaseQuotationApprovalTable';
import { RrsStatusTable } from './components/RrsStatusTable';
import { SadhakMovementTable } from './components/SadhakMovementTable';
import { SadhakAdvanceTable } from './components/SadhakAdvanceTable';
import { TaskTable } from './components/TaskTable';
import { TodoList } from './components/TodoList';
import { TourApprovalTable } from './components/TourApprovalTable';
import { WorkOrderApprovalTable } from './components/WorkOrderApprovalTable';
import {
  ActionOnCorrespondenceItem,
  ActionOnRecruitmentItem,
  BillDetailItem,
  BranchApprovalItem,
  ChargeAcceptItem,
  DashboardItem,
  EmployeeApplicationItem,
  IncentiveApprovalItem,
  IssueVerificationItem,
  LeaveApprovalItem,
  MaterialQualityItem,
  MeetingPointItem,
  PartyAdvanceItem,
  PaymentTermsVerifyItem,
  PurchaseQuotationItem,
  RrsStatusItem,
  SadhakAdvanceItem,
  SadhakMovementItem,
  StaticTaskRow,
  TaskItem,
  TourApprovalItem,
  WorkOrderItem,
} from './components/types';

const staticTodoItems: DashboardItem[] = [
  createStaticItem(-1, 'My RRS Status', 'Due in 2 Days', 1),
  createStaticItem(-2, 'Events', 'Due in 3 Days', 12),
  createStaticItem(-3, 'Tickets', 'Due in 5 Days', 8),
  createStaticItem(-4, 'Daily Report', 'Due in 2 Days', 1),
  createStaticItem(-5, 'Leave or Tour Records', 'Due in 12 Days', 2),
  createStaticItem(-6, 'Event Task Pending', 'Due in 1 week', 10),
];

const staticRows: StaticTaskRow[] = [
  {
    id: '01',
    title: 'Pen',
    subTitle: 'Description',
    department: 'Intertico',
    status: 'Completed',
  },
  {
    id: '02',
    title: 'Headphone',
    subTitle: 'Description',
    department: 'Agoda',
    status: 'Cancelled',
  },
  {
    id: '03',
    title: 'Diary',
    subTitle: 'Description',
    department: 'RoadGee',
    status: 'Pending',
  },
];

function createStaticItem(
  PanelId: number,
  Panel: string,
  Description: string,
  RecordCount: number,
): DashboardItem {
  return {
    PanelId,
    Panel,
    Description,
    RecordCount,
    iconpath: '',
    service_status: 'A',
    source: 'static',
  };
}

const getStoredUser = () => JSON.parse(localStorage.getItem('user') || '{}');
const getEmpNum = () => {
  const user = getStoredUser();
  return user.empNum || user.empnum || 267;
};

const getDataFlag = () => {
  const user = getStoredUser();
  return (
    user.DataFlag ||
    user.Dataflag ||
    user.Data_Flag ||
    user.dataFlag ||
    user.dataflag ||
    'GANGOTRI'
  );
};

const getEmployeeName = () => {
  const user = getStoredUser();
  return user.empName || user.emp_name || user.username || 'User';
};

const getDepartmentName = () => {
  const user = getStoredUser();
  return user.deptName || user.dept_name || user.department || 'Department';
};

const getHodCode = () => {
  const user = getStoredUser();
  return (
    user.hod ||
    user.HOD ||
    user.hodEmpNum ||
    user.HODEmpNum ||
    user.hodNum ||
    user.HOD_EMP_NUM ||
    user.hod_emp_num ||
    ''
  );
};

const normalizeCode = (value: unknown) =>
  String(value ?? '')
    .replace(/\.0$/, '')
    .trim();

const normalizeLabel = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const getTaskFilterType = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  if (label.includes('task reverted')) {
    return '17';
  }

  if (label.includes('task confirmation')) {
    return '19';
  }

  if (label.includes('task pending')) {
    return '16';
  }

  return String(item.PanelId);
};

const isTaskConfirmationItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);

  return `${panel} ${description}`.includes('task confirmation');
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const getTextByKeys = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (value !== null && value !== undefined && value !== '') {
      return value;
    }
  }

  return '';
};

const getBillRecords = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const preferredKeys = [
    'BillDetails',
    'billDetails',
    'billdetails',
    'BillDetail',
    'billdetail',
    'Billing',
    'billing',
    'Data',
    'data',
    'Table',
    'table',
  ];

  for (const key of preferredKeys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
};

const getBranchApprovalRecords = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const data = payload.Data || payload.data;

  if (Array.isArray(data)) {
    return data.filter(isRecord);
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
};

const getDataRecords = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const data = payload.Data || payload.data;

  if (Array.isArray(data)) {
    return data.filter(isRecord);
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
};

const getTotalRecords = (
  payload: unknown,
  rows: Array<{ RecordCount?: number }>,
) => {
  if (isRecord(payload)) {
    const meta = payload.Meta || payload.meta;

    if (isRecord(meta)) {
      const totalRecords =
        meta.TotalRecords ||
        meta.totalRecords ||
        meta.TotalRecord ||
        meta.totalRecord;

      if (totalRecords !== null && totalRecords !== undefined && totalRecords !== '') {
        return Number(totalRecords);
      }
    }
  }

  return Number(rows[0]?.RecordCount || rows.length || 0);
};

const unwrapFirstRecord = (record: Record<string, unknown>): Record<string, unknown> => {
  const directKeys = Object.keys(record);

  if (
    directKeys.some(key =>
      [
        'AR_CODE',
        'ArCode',
        'Code',
        'EDate',
        'VName',
        'Audit_Remark',
        'Stage',
        'Final_Approve',
      ].includes(key),
    )
  ) {
    return record;
  }

  for (const value of Object.values(record)) {
    if (isRecord(value)) {
      const nestedKeys = Object.keys(value);

      if (
        nestedKeys.some(key =>
          [
            'AR_CODE',
            'ArCode',
            'Code',
            'EDate',
            'VName',
            'Audit_Remark',
            'Stage',
            'Final_Approve',
          ].includes(key),
        )
      ) {
        return value;
      }
    }
  }

  return record;
};

const normalizeBillDetail = (record: Record<string, unknown>): BillDetailItem => {
  const status = getTextByKeys(record, [
    'Status',
    'status',
    'bill_status',
    'BillStatus',
    'service_status',
  ]);

  return {
    RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
    vendorSadhak: String(
      getTextByKeys(record, [
        'VendorSadhak',
        'Vendor/Sadhak',
        'sVendor_Name',
        'vendor_sadhak',
        'vendorname',
        'VendorName',
        'vendor_name',
        'sadhak_name',
        'SadhakName',
        'name',
        'Name',
      ]),
    ),
    material: String(
      getTextByKeys(record, [
        'Material_Desc',
        'MaterialDesc',
        'material_desc',
        'Material',
        'material',
      ]),
    ),
    billId: getTextByKeys(record, [
      'BillOrderId',
      'BillId',
      'BillID',
      'bill_id',
      'Bill_Id',
      'billid',
      'id',
    ]),
    billNo: getTextByKeys(record, [
      'sBill_No',
      'BillNo',
      'Bill_No',
      'bill_no',
      'billno',
      'InvoiceNo',
      'invoice_no',
    ]),
    billDate: getTextByKeys(record, [
      'BDate',
      'Bill_Date',
      'BillDate',
      'bill_date',
      'sBill_Date',
      'dBill_Date',
      'BillDt',
      'bill_dt',
    ]),
    billAmount: getTextByKeys(record, [
      'mBill_Amount',
      'BillAmount',
      'Bill_Amount',
      'bill_amount',
      'amount',
      'Amount',
      'NetAmount',
      'net_amount',
    ]),
    status: String(status || 'not check').toLowerCase(),
    raw: record,
  };
};

const isBillsPendingItem = (item: DashboardItem) =>
  normalizeLabel(item.Description) === 'bills pending' ||
  (normalizeLabel(item.Panel) === 'billing' && item.PanelId === 1);

const isMyRrsStatusItem = (item: DashboardItem) =>
  normalizeLabel(item.Panel) === 'my rrs status' ||
  normalizeLabel(item.Description) === 'my rrs status';

const normalizeBranchApproval = (
  record: Record<string, unknown>,
): BranchApprovalItem => {
  const fileListValue = record.FileList || record.fileList;
  const fileList = Array.isArray(fileListValue)
    ? fileListValue
        .filter(isRecord)
        .map(file => ({
          imagePath: String(
            getTextByKeys(file, ['ImagePath', 'imagePath', 'FilePath', 'path']),
          ),
        }))
    : [];

  return {
    RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
    code: getTextByKeys(record, ['BPCODE', 'BPCode', 'Code', 'code']),
    sadhakId: getTextByKeys(record, [
      'PERSONID',
      'PersonId',
      'personId',
      'SadhakId',
      'sadhak_id',
    ]),
    letterId: getTextByKeys(record, ['LetterId', 'letterId', 'LETTERID']),
    name: String(getTextByKeys(record, ['PName', 'Name', 'name'])),
    detail: String(getTextByKeys(record, ['Detail', 'Details', 'detail'])),
    status: String(
      getTextByKeys(record, ['HAPPROVE', 'Status', 'status']) || 'N',
    ),
    amountApproved: getTextByKeys(record, [
      'Amt_Approved',
      'amountApproved',
      'AmountApproved',
    ]),
    approveBy: getTextByKeys(record, ['Approve_By', 'approveBy']),
    approveByName: String(
      getTextByKeys(record, ['Approve_ByName', 'approveByName']),
    ),
    remark: String(getTextByKeys(record, ['HREMARK', 'Remark', 'remark'])),
    voucherCode: getTextByKeys(record, ['Voucher_Code', 'voucherCode']),
    fileList,
    raw: record,
  };
};

const isBranchApprovalItem = (item: DashboardItem) =>
  normalizeLabel(item.Panel) === 'branch' &&
  normalizeLabel(item.Description) === 'branch approval pending';

const normalizeIssueVerification = (
  record: Record<string, unknown>,
): IssueVerificationItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  srNo: getTextByKeys(record, ['ISD_SRNO', 'SrNo', 'srNo']),
  issueDate: String(getTextByKeys(record, ['ISDate', 'issueDate'])),
  sadhakName: String(
    getTextByKeys(record, [
      'SadhakName',
      'sadhakName',
      'PName',
      'Name',
      'Emp_Id',
      'EmpId',
    ]),
  ),
  handOverOpdId: getTextByKeys(record, ['HandOverOpdId', 'handoverOpdId']),
  category: String(getTextByKeys(record, ['CM_NAME', 'category'])),
  itemName: String(getTextByKeys(record, ['IM_Item_Name', 'itemName'])),
  quantityIssued: getTextByKeys(record, ['ISD_Quantity', 'quantityIssued']),
  unit: String(getTextByKeys(record, ['UM_Name', 'unit'])),
  status: String(getTextByKeys(record, ['YN', 'Status', 'status']) || 'No'),
  empId: getTextByKeys(record, ['Emp_Id', 'EmpId', 'empId']),
  issueId: getTextByKeys(record, ['IS_ID', 'issueId']),
  itemId: getTextByKeys(record, ['IM_Item_Id', 'itemId']),
  rrsId: getTextByKeys(record, ['RRS_ID', 'rrsId']),
  handedOver: String(getTextByKeys(record, ['IS_HandedOver', 'handedOver'])),
  raw: record,
});

const isIssueVerificationItem = (item: DashboardItem) =>
  normalizeLabel(item.Description) === 'issue verification' ||
  normalizeLabel(item.Panel) === 'issue verification';

const isActionOnRecruitmentItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return (
    label.includes('actiononrecruitment') ||
    label.includes('action on recruitment')
  );
};

const isActionOnCorrespondenceItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('correspondence') && label.includes('action');
};

const normalizeActionOnRecruitment = (
  record: Record<string, unknown>,
): ActionOnRecruitmentItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  applicationNo: getTextByKeys(record, ['APPLICANT_NUM_NR', 'applicantNumNr']),
  name: String(getTextByKeys(record, ['APPLICANT_NAME', 'applicantName'])),
  dob: String(getTextByKeys(record, ['APPLICANT_DOB', 'applicantDob'])),
  sex: String(getTextByKeys(record, ['APPLICANT_SEX1', 'applicantSex'])),
  departmentName: String(getTextByKeys(record, ['DEPT_NAME', 'deptName'])),
  postName: String(getTextByKeys(record, ['HSR_POST_NAME', 'postName'])),
  salary: getTextByKeys(record, ['NR_APPROVED_SALARY', 'approvedSalary']),
  raw: record,
});

const normalizeActionOnCorrespondence = (
  record: Record<string, unknown>,
): ActionOnCorrespondenceItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  letterId: getTextByKeys(record, ['Letter_Id', 'LetterId', 'letterId']),
  letterFrom: String(getTextByKeys(record, ['Letter_From', 'LetterFrom'])),
  subject: String(getTextByKeys(record, ['Letter_Subject', 'LetterSubject'])),
  letterDate: String(getTextByKeys(record, ['Letter_Date', 'LetterDate'])),
  receiveDate: String(
    getTextByKeys(record, ['RDate', 'Letter_Date_Receive', 'LetterDateReceive']),
  ),
  categoryDescription: String(
    getTextByKeys(record, ['sCategory_Description', 'CategoryDescription']),
  ),
  status: String(getTextByKeys(record, ['Status', 'status'])),
  raw: record,
});

const isEmployeeApplicationItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('employee application') || label.includes('empapplication');
};

const normalizeEmployeeApplication = (
  record: Record<string, unknown>,
): EmployeeApplicationItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  code: getTextByKeys(record, ['ECODE', 'ECode', 'code']),
  name: String(getTextByKeys(record, ['EMP_NAME', 'EmpName', 'name'])),
  department: String(getTextByKeys(record, ['DM_NAME', 'DMName', 'department'])),
  designation: String(
    getTextByKeys(record, ['DESIGNATION_NAME', 'DesignationName', 'designation']),
  ),
  type: String(getTextByKeys(record, ['ATM_TYPE', 'AtmType', 'type'])),
  amount: getTextByKeys(record, ['EA_PADV_AMOUNT1', 'amount']),
  statusRemark: String(
    getTextByKeys(record, ['ADMIN_ACTION_REMARK', 'AdminActionRemark', 'status']),
  ),
  raw: record,
});

const isSadhakMovementItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('sadhak movement');
};

const normalizeSadhakMovement = (
  record: Record<string, unknown>,
): SadhakMovementItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  movementId: getTextByKeys(record, ['MovementId', 'movementId']),
  empNo: getTextByKeys(record, ['EmpNum', 'empNum']),
  empName: String(getTextByKeys(record, ['EmpName', 'empName'])),
  department: String(getTextByKeys(record, ['Department', 'department'])),
  category: String(getTextByKeys(record, ['Category', 'category'])),
  outTime: String(getTextByKeys(record, ['OutTime', 'outTime'])),
  inTime: String(getTextByKeys(record, ['InTime', 'inTime'])),
  gateFrom: String(getTextByKeys(record, ['GateFrom', 'gateFrom'])),
  gateTo: String(getTextByKeys(record, ['GateTo', 'gateTo'])),
  raw: record,
});

const isTourApprovalItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('tour approval');
};

const normalizeTourApproval = (
  record: Record<string, unknown>,
): TourApprovalItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  tourId: getTextByKeys(record, ['TourId', 'tourId']),
  empId: getTextByKeys(record, ['EmpNum', 'empNum']),
  empName: String(getTextByKeys(record, ['EmpName', 'empName'])),
  chargesTo: String(getTextByKeys(record, ['ChargesTo', 'chargesTo'])),
  department: String(getTextByKeys(record, ['DMName', 'department'])),
  fromDate: String(getTextByKeys(record, ['FROMDATE', 'fromDate'])),
  toDate: String(getTextByKeys(record, ['TODATE', 'toDate'])),
  raw: record,
});

const normalizeMeetingPoint = (
  record: Record<string, unknown>,
): MeetingPointItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  srNo: getTextByKeys(record, ['Meet_Sr_No', 'srNo']),
  code: getTextByKeys(record, ['Meet_Mast_Code', 'code']),
  date: String(getTextByKeys(record, ['EDOE', 'date'])),
  assignName: String(getTextByKeys(record, ['Assign_Name', 'assignName'])),
  priority: String(getTextByKeys(record, ['SPriority', 'priority'])),
  dueDate: String(getTextByKeys(record, ['DueDate', 'dueDate'])),
  title: String(getTextByKeys(record, ['Title', 'title'])),
  detail: String(getTextByKeys(record, ['Detail', 'detail'])),
  complete: String(getTextByKeys(record, ['Complete', 'complete']) || 'N'),
  employeeName: String(getTextByKeys(record, ['E_NAME', 'employeeName'])),
  employeeNumber: getTextByKeys(record, ['E_NUM', 'employeeNumber']),
  designation: String(getTextByKeys(record, ['DESG', 'designation'])),
  department: String(getTextByKeys(record, ['D_NAME', 'department'])),
  remark: String(getTextByKeys(record, ['Remark', 'remark'])),
  previousComments: String(getTextByKeys(record, ['PrevComm', 'previousComments'])),
  filePath: String(getTextByKeys(record, ['File_Path', 'filePath'])),
  completeProof: String(getTextByKeys(record, ['CompProof', 'FPath'])),
  assignId: getTextByKeys(record, ['Assign_Id', 'assignId']),
  autoId: getTextByKeys(record, ['Auto_Id', 'autoId']),
  raw: record,
});

const isMeetingPointItem = (item: DashboardItem) =>
  normalizeLabel(item.Panel).includes('meeting points') ||
  normalizeLabel(item.Description).includes('meeting points') ||
  ['meeting points', 'meeting points confirmation'].includes(
    normalizeLabel(item.Panel),
  ) ||
  [
    'meeting points pending',
    'meeting points confirmation pending',
  ].includes(normalizeLabel(item.Description));

const isMeetingPointConfirmationItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return (
    label.includes('meeting points confirmation') ||
    description.includes('meeting points confirmation pending')
  );
};

const getPartyAdvanceStatus = (record: Record<string, unknown>) => {
  const stage = normalizeLabel(getTextByKeys(record, ['Stage', 'stage']));
  const finalApprove = normalizeLabel(
    getTextByKeys(record, ['Final_Approve', 'FinalApprove', 'finalApprove']),
  );
  const status = normalizeLabel(getTextByKeys(record, ['Status', 'status']));

  if (['closed', 'c'].includes(stage) || ['closed', 'c'].includes(status)) {
    return 'Closed';
  }

  if (
    ['yes', 'y', 'approved'].includes(finalApprove) ||
    ['yes', 'y', 'approved'].includes(status)
  ) {
    return 'Yes';
  }

  if (
    ['no', 'n', 'rejected', 'reject'].includes(finalApprove) &&
    !['p', 'pending'].includes(stage) &&
    status !== 'pending'
  ) {
    return 'No';
  }

  if (
    ['p', 'pending'].includes(stage) ||
    ['pending'].includes(status) ||
    finalApprove === 'no'
  ) {
    return 'Pending';
  }

  return 'Pending';
};

const normalizePartyAdvance = (record: Record<string, unknown>): PartyAdvanceItem => {
  const source = unwrapFirstRecord(record);

  return {
    RowNumber: Number(getTextByKeys(source, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(source, ['RecordCount', 'recordCount']) || 0),
    code: getTextByKeys(source, ['AR_CODE', 'ArCode', 'Code', 'code']),
    entryDate: String(
      getTextByKeys(source, ['EDate', 'EntryDate', 'entryDate', 'FTDate']),
    ),
    billDueDate: String(
      getTextByKeys(source, ['EDate', 'BillDueDate', 'billDueDate', 'DueDate', 'FTDate']),
    ),
    vendorName: String(
      getTextByKeys(source, ['VName', 'VendorName', 'vendorName', 'V_Name']),
    ),
    description: String(
      getTextByKeys(source, [
        'Audit_Remark',
        'AuditRemark',
        'Description',
        'description',
        'Event_Name',
      ]),
    ),
    status: getPartyAdvanceStatus(source),
    raw: source,
  };
};

const isPartyAdvanceItem = (item: DashboardItem) =>
  normalizeLabel(item.Panel) === 'party advance' ||
  normalizeLabel(item.Description) === 'party advance pending' ||
  item.PanelId === 6;

const isSadhakAdvanceItem = (item: DashboardItem) =>
  normalizeLabel(item.Panel) === 'sadhak advance' ||
  normalizeLabel(item.Description) === 'sadhak advance pending';

const isIncentiveApprovalItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('incentive approval');
};

const normalizeIncentiveApproval = (
  record: Record<string, unknown>,
): IncentiveApprovalItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  autoId: getTextByKeys(record, ['Auto_Id', 'AutoId', 'autoId']),
  employeeName: String(
    getTextByKeys(record, ['Emp_Name', 'EmpName', 'employeeName']),
  ),
  type: String(getTextByKeys(record, ['Type', 'type'])),
  revertTo: String(getTextByKeys(record, ['revert_to', 'RevertTo', 'revertTo'])),
  doe: String(getTextByKeys(record, ['DOE', 'doe'])),
  remark: String(getTextByKeys(record, ['Remarks', 'Remark', 'remark'])),
  raw: record,
});

const isChargeAcceptItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('charge accept');
};

const normalizeChargeAccept = (
  record: Record<string, unknown>,
): ChargeAcceptItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  id: getTextByKeys(record, ['Id', 'ID', 'id']),
  employeeName: String(getTextByKeys(record, ['EName', 'Emp_Name', 'EmpName'])),
  department: String(getTextByKeys(record, ['DMName', 'Department', 'department'])),
  dayType: String(getTextByKeys(record, ['DDay', 'DayType', 'dayType'])),
  category: String(getTextByKeys(record, ['Category', 'category'])),
  fromDate: String(getTextByKeys(record, ['FROM_DATE', 'FromDate', 'fromDate'])),
  toDate: String(getTextByKeys(record, ['TO_DATE', 'ToDate', 'toDate'])),
  raw: record,
});

const normalizeSadhakAdvance = (record: Record<string, unknown>): SadhakAdvanceItem => {
  const source = unwrapFirstRecord(record);

  return {
    RowNumber: Number(getTextByKeys(source, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(source, ['RecordCount', 'recordCount']) || 0),
    code: getTextByKeys(source, ['AR_CODE', 'ArCode', 'Code', 'code']),
    entryDate: String(
      getTextByKeys(source, ['EDate', 'EntryDate', 'entryDate', 'FTDate']),
    ),
    billDueDate: String(
      getTextByKeys(source, ['EDate', 'BillDueDate', 'billDueDate', 'DueDate', 'FTDate']),
    ),
    employeeName: String(
      getTextByKeys(source, ['Emp_Name', 'EmpName', 'employeeName']),
    ),
    description: String(
      getTextByKeys(source, ['Description', 'description', 'Advance_For']),
    ),
    status: getPartyAdvanceStatus(source),
    raw: source,
  };
};

const isPaymentTermsVerificationItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return (
    label.includes('payment terms verificaton') ||
    label.includes('payment terms verification') ||
    label.includes('pt verification') ||
    description.includes('purchase / work order pt verification pending')
  );
};

const normalizePaymentTermsVerification = (
  record: Record<string, unknown>,
): PaymentTermsVerifyItem => {
  const verifyTermsValue =
    record.VerifyTermsList || record.verifyTermsList || record.verify_terms_list;
  const verifyTermsList = Array.isArray(verifyTermsValue)
    ? verifyTermsValue.filter(isRecord).map(term => ({
        srno: getTextByKeys(term, ['srno', 'SrNo', 'SRNO']),
        amcSrno: getTextByKeys(term, ['amc_srno', 'amcSrno', 'AMCSRNO']),
        workComplete: String(
          getTextByKeys(term, ['workcomplete', 'workComplete', 'WorkComplete']),
        ),
        maintenanceDesc: String(
          getTextByKeys(term, [
            'maintenance_desc',
            'maintenanceDesc',
            'MaintenanceDesc',
          ]),
        ),
        maintenanceRemark: String(
          getTextByKeys(term, [
            'maintenanceremark',
            'maintenanceRemark',
            'MaintenanceRemark',
          ]),
        ),
      }))
    : [];

  return {
    RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
    qcsAppCode: record.qcs_appcode ?? '',
    poId: getTextByKeys(record, ['po_id', 'poId', 'POId']),
    quotationNo: record.quotation_no ?? '',
    autoId: getTextByKeys(record, ['auto_id', 'autoId', 'AutoId']),
    vendorName: String(
      getTextByKeys(record, ['svendor_name', 'vendorName', 'VendorName']),
    ),
    vendorId: getTextByKeys(record, ['ivendor_id', 'vendorId', 'VendorId']),
    paymentTerm: String(
      getTextByKeys(record, ['pay_terms', 'payTerms', 'PaymentTerm']),
    ),
    paymentType: String(
      getTextByKeys(record, ['pay_type', 'payType', 'PaymentType']),
    ),
    payDate: String(getTextByKeys(record, ['PayDate', 'payDate'])),
    scopeOfWork: String(
      getTextByKeys(record, ['scope_of_work', 'scopeOfWork', 'ScopeOfWork']),
    ),
    amount: getTextByKeys(record, [
      'approve_amount',
      'approveAmount',
      'ApproveAmount',
    ]),
    status: String(
      getTextByKeys(record, ['pt_ver_status', 'ptVerStatus', 'Status']) ||
        'Pending',
    ),
    remark: String(
      getTextByKeys(record, ['pt_ver_remark', 'ptVerRemark', 'Remark']),
    ),
    qcsFiles: String(getTextByKeys(record, ['qcsfiles', 'qcsFiles', 'QCSFiles'])),
    orderLink: String(getTextByKeys(record, ['orderlink', 'orderLink', 'OrderLink'])),
    verifyTermsList,
    raw: record,
  };
};

const isPurchaseQuotationItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return (
    label.includes('purchase quotation approval') ||
    label.includes('purchase quotation')
  );
};

const isWorkOrderItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('work order approval') || label.includes('work order');
};

const normalizePurchaseQuotation = (
  record: Record<string, unknown>,
): PurchaseQuotationItem => {
  const lineItemsValue = record.LineItems || record.lineItems;
  const paymentTermsValue = record.PaymentTerms || record.paymentTerms;
  const termsAndConditionsValue =
    record.TermsAndConditions || record.termsAndConditions;

  const lineItems = Array.isArray(lineItemsValue)
    ? lineItemsValue.filter(isRecord).map(item => ({
        srNo: getTextByKeys(item, ['Qcs_SrNo', 'qcsSrNo', 'srNo']),
        itemName: String(
          getTextByKeys(item, ['Im_Item_Name', 'itemName', 'ItemName']),
        ),
        quantity: getTextByKeys(item, ['Qcs_Quantity', 'quantity']),
        unit: String(getTextByKeys(item, ['Um_Name', 'unit'])),
        rate1: getTextByKeys(item, ['Qcs_Rate1', 'rate1']),
        rate2: getTextByKeys(item, ['Qcs_Rate2', 'rate2']),
        rate3: getTextByKeys(item, ['Qcs_Rate3', 'rate3']),
        greenColor: String(getTextByKeys(item, ['Greencolor', 'greenColor'])),
        lastPurchaseHistory: Array.isArray(item.LastPurchaseHistory)
          ? item.LastPurchaseHistory
          : [],
      }))
    : [];

  const paymentTerms = Array.isArray(paymentTermsValue)
    ? paymentTermsValue.filter(isRecord).map(term => ({
        payTerms: String(
          getTextByKeys(term, ['Pay_Terms1', 'payTerms', 'PayTerms']),
        ),
        percentage: getTextByKeys(term, ['Percentage1', 'percentage']),
        assignToName: String(
          getTextByKeys(term, ['Assign_to_name1', 'assignToName']),
        ),
      }))
    : [];

  return {
    RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
    qcsId: getTextByKeys(record, ['Qcs_Id', 'qcsId']),
    qcsDate: String(getTextByKeys(record, ['Qcs_Date', 'qcsDate'])),
    qcsType: String(getTextByKeys(record, ['Qcs_Type', 'qcsType'])),
    vendorName1: String(getTextByKeys(record, ['Qcs_VendorName1', 'vendorName1'])),
    vendorName2: String(getTextByKeys(record, ['Qcs_VendorName2', 'vendorName2'])),
    vendorName3: String(getTextByKeys(record, ['Qcs_VendorName3', 'vendorName3'])),
    netTotal1: getTextByKeys(record, ['NetTotal1', 'netTotal1']),
    netTotal2: getTextByKeys(record, ['NetTotal2', 'netTotal2']),
    netTotal3: getTextByKeys(record, ['NetTotal3', 'netTotal3']),
    location: String(getTextByKeys(record, ['Location', 'location'])),
    qcsFile: String(getTextByKeys(record, ['Qcs_File', 'qcsFile'])),
    qcsStage: String(getTextByKeys(record, ['Qcs_Stage', 'qcsStage'])),
    lineItems,
    paymentTerms,
    termsAndConditions: Array.isArray(termsAndConditionsValue)
      ? termsAndConditionsValue
      : [],
    raw: record,
  };
};

const normalizeRrsStatus = (record: Record<string, unknown>): RrsStatusItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  id: getTextByKeys(record, ['id', 'Id', 'ID', 'RRS_ID', 'rrs_id']),
  employeeName: String(getTextByKeys(record, ['empname', 'empName', 'EmpName'])),
  storeName: String(getTextByKeys(record, ['im_st_name', 'imStName', 'StoreName'])),
  itemName: String(getTextByKeys(record, ['imname', 'imName', 'ItemName'])),
  employeeMobile: String(
    getTextByKeys(record, ['emp_mobile', 'empMobile', 'EmpMobile']),
  ),
  rrsType: String(getTextByKeys(record, ['rrs_type', 'rrsType', 'RRSType'])),
  raw: record,
});

const isMaterialQualityItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return (
    label.includes('material quality') ||
    description.includes('material quality pending')
  );
};

const normalizeMaterialQuality = (
  record: Record<string, unknown>,
): MaterialQualityItem => {
  const lineItemsValue =
    record.LineItemsList || record.lineItemsList || record.LineItems;
  const lineItems = Array.isArray(lineItemsValue)
    ? lineItemsValue.filter(isRecord).map(line => ({
        rrsFor: getTextByKeys(line, ['rrs_for', 'rrsFor']),
        demandBy: getTextByKeys(line, ['rrs_demandby', 'rrsDemandBy']),
        sadhakName: String(getTextByKeys(line, ['emp_name', 'empName'])),
        itemName: String(getTextByKeys(line, ['itemname', 'itemName'])),
        amount: getTextByKeys(line, ['rd_amount', 'amount']),
        poSrNo: getTextByKeys(line, ['po_srno', 'poSrNo']),
        companyName: String(
          getTextByKeys(line, ['po_com_name', 'rd_com_name', 'companyName']),
        ),
        pendingQuantity: getTextByKeys(line, ['po_inpenqty', 'pendingQuantity']),
        unit: String(getTextByKeys(line, ['uname', 'unit'])),
        qmCode: getTextByKeys(line, ['qm_code', 'qmCode']),
        qmStatus: String(getTextByKeys(line, ['qm_status', 'qmStatus'])),
        remark: String(getTextByKeys(line, ['utl_remark', 'remark'])),
        qualityQuestions: Array.isArray(line.QualityQuesList)
          ? line.QualityQuesList
          : [],
      }))
    : [];

  return {
    RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
    rmId: getTextByKeys(record, ['rm_id', 'rmId']),
    poNo: getTextByKeys(record, ['rm_po_no', 'rmPoNo']),
    date: String(getTextByKeys(record, ['rm_date', 'rmDate'])),
    vendorName: String(getTextByKeys(record, ['svendor_name', 'vendorName'])),
    mobile: String(getTextByKeys(record, ['svendor_mobile', 'vendorMobile'])),
    sadhakName: lineItems[0]?.sadhakName || '',
    storeName: String(getTextByKeys(record, ['im_st_name', 'storeName'])),
    lineItems,
    raw: record,
  };
};

const isLeaveApprovalItem = (item: DashboardItem) => {
  const panel = normalizeLabel(item.Panel);
  const description = normalizeLabel(item.Description);
  const label = `${panel} ${description}`;

  return label.includes('leave or tour records') || label.includes('leave');
};

const normalizeLeaveApproval = (
  record: Record<string, unknown>,
): LeaveApprovalItem => ({
  RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
  RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
  leaveId: getTextByKeys(record, ['LeaveId', 'leaveId']),
  empNum: getTextByKeys(record, ['EmpNum', 'empNum']),
  sadhakName: String(getTextByKeys(record, ['EmpName', 'empName'])),
  applyDate: String(getTextByKeys(record, ['EntryDate', 'entryDate'])),
  fromDate: String(getTextByKeys(record, ['FROMDATE', 'fromDate'])),
  toDate: String(getTextByKeys(record, ['TODATE', 'toDate'])),
  applied: getTextByKeys(record, ['TotalLeave', 'totalLeave']),
  leaveType: String(getTextByKeys(record, ['LeaveType', 'leaveType'])),
  leaveDay: String(getTextByKeys(record, ['LeaveDay', 'leaveDay'])),
  chargeGiven: String(getTextByKeys(record, ['ChargesTo', 'chargesTo'])),
  sanction: String(getTextByKeys(record, ['FSanction', 'fSanction'])),
  department: String(getTextByKeys(record, ['DMName', 'dmName'])),
  reason: String(getTextByKeys(record, ['LeaveReason', 'leaveReason'])),
  raw: record,
});

const normalizeWorkOrder = (record: Record<string, unknown>): WorkOrderItem => {
  const lineItemsValue = record.wolineitems || record.WOLineItems || record.lineItems;
  const paymentTermsValue =
    record.wopaymentterms1 || record.WOPaymentTerms1 || record.paymentTerms;
  const termsValue = record.wotandc || record.WOTandC || record.termsAndConditions;

  const lineItems = Array.isArray(lineItemsValue)
    ? lineItemsValue.filter(isRecord).map(item => ({
        srNo: getTextByKeys(item, ['amc_srno', 'srNo', 'SrNo']),
        workScope: String(getTextByKeys(item, ['work_scope', 'workScope'])),
        totalPrice1: getTextByKeys(item, ['totalprice1', 'totalPrice1']),
        totalPrice2: getTextByKeys(item, ['totalprice2', 'totalPrice2']),
        totalPrice3: getTextByKeys(item, ['totalprice3', 'totalPrice3']),
        insurance: String(getTextByKeys(item, ['insurance', 'Insurance'])),
        dateFrom: String(getTextByKeys(item, ['datefr', 'dateFrom'])),
        dateTo: String(getTextByKeys(item, ['dateto', 'dateTo'])),
        remark: String(getTextByKeys(item, ['remark', 'Remark'])),
      }))
    : [];
  const paymentTerms = Array.isArray(paymentTermsValue)
    ? paymentTermsValue.filter(isRecord).map(term => ({
        payTerms: String(getTextByKeys(term, ['Pay_Terms', 'payTerms'])),
        percentage: getTextByKeys(term, ['Percentage', 'percentage']),
        amount: getTextByKeys(term, ['Amount', 'amount']),
        payType: String(getTextByKeys(term, ['Pay_Type', 'payType'])),
        assignToName: String(getTextByKeys(term, ['Assign_to_name', 'assignToName'])),
        ptVerificationRequired: String(
          getTextByKeys(term, ['PT_VER_REQ', 'ptVerReq']),
        ),
      }))
    : [];
  const termsAndConditions = Array.isArray(termsValue)
    ? termsValue.filter(isRecord).map(term => ({
        id: getTextByKeys(term, ['TC_ID', 'tcId']),
        srNo: getTextByKeys(term, ['TCSrNo', 'tcSrNo']),
        particulars: String(getTextByKeys(term, ['Particulars', 'particulars'])),
        description: String(getTextByKeys(term, ['Description1', 'description'])),
        selected: Boolean(term.selected),
      }))
    : [];
  const workDate =
    lineItems[0]?.dateTo ||
    getTextByKeys(record, ['dateto', 'quotation_date', 'entry_date']);

  return {
    RowNumber: Number(getTextByKeys(record, ['RowNumber', 'rowNumber']) || 0),
    RecordCount: Number(getTextByKeys(record, ['RecordCount', 'recordCount']) || 0),
    orderNo: getTextByKeys(record, ['quotation_no', 'quotationNo']),
    date: String(workDate),
    createdBy: String(getTextByKeys(record, ['user_name', 'userName'])),
    vendorName1: String(getTextByKeys(record, ['vendor1_name', 'vendorName1'])),
    vendorName2: String(getTextByKeys(record, ['vendor2_name', 'vendorName2'])),
    vendorName3: String(getTextByKeys(record, ['vendor3_name', 'vendorName3'])),
    netAmount1: getTextByKeys(record, ['netprice1', 'netAmount1']),
    netAmount2: getTextByKeys(record, ['netprice2', 'netAmount2']),
    netAmount3: getTextByKeys(record, ['netprice3', 'netAmount3']),
    closeRenewed: String(getTextByKeys(record, ['close_by', 'renewal', 'rc'])),
    contractType: String(getTextByKeys(record, ['contract_type', 'contractType'])),
    place: String(getTextByKeys(record, ['place', 'Place'])),
    scopeOfWork: String(getTextByKeys(record, ['scope_of_work', 'scopeOfWork'])),
    filePath: String(getTextByKeys(record, ['file_path', 'filePath'])),
    status: String(getTextByKeys(record, ['sanction', 'status']) || 'Pending'),
    lineItems,
    paymentTerms,
    termsAndConditions,
    raw: record,
  };
};

const getEmployeeRecords = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
};

const findEmployeeNameByCode = (payload: unknown, hodCode: unknown) => {
  const normalizedHodCode = normalizeCode(hodCode);

  const match = getEmployeeRecords(payload).find(record =>
    [
      record.emp_num,
      record.Emp_Num,
      record.empNum,
      record.EmpNum,
      record.emp_code,
      record.Emp_Code,
      record.empCode,
    ].some(value => normalizeCode(value) === normalizedHodCode),
  );

  return (
    match?.emp_name ||
    match?.Emp_Name ||
    match?.empName ||
    match?.EmpName ||
    match?.name_eng ||
    match?.Name_Eng ||
    ''
  );
};

const findEmployeeNameByEmpNum = (payload: unknown, empNum: unknown) => {
  const normalizedEmpNum = normalizeCode(empNum);

  const match = getEmployeeRecords(payload).find(record =>
    [
      record.emp_num,
      record.Emp_Num,
      record.empNum,
      record.EmpNum,
      record.emp_code,
      record.Emp_Code,
      record.empCode,
    ].some(value => normalizeCode(value) === normalizedEmpNum),
  );

  return (
    match?.emp_name ||
    match?.Emp_Name ||
    match?.empName ||
    match?.EmpName ||
    match?.name_eng ||
    match?.Name_Eng ||
    ''
  );
};

const normalizeIssueVerificationWithEmployees = (
  record: Record<string, unknown>,
  employeePayload: unknown,
) => {
  const issue = normalizeIssueVerification(record);
  const employeeName = findEmployeeNameByEmpNum(employeePayload, issue.empId);

  return {
    ...issue,
    sadhakName: String(employeeName || issue.sadhakName),
  };
};

export const DashboardContent: React.FC = () => {
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [activeItem, setActiveItem] = useState<DashboardItem | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [billDetails, setBillDetails] = useState<BillDetailItem[]>([]);
  const [branchApprovals, setBranchApprovals] = useState<BranchApprovalItem[]>([]);
  const [issueVerifications, setIssueVerifications] = useState<
    IssueVerificationItem[]
  >([]);
  const [actionOnRecruitments, setActionOnRecruitments] = useState<
    ActionOnRecruitmentItem[]
  >([]);
  const [actionOnCorrespondences, setActionOnCorrespondences] = useState<
    ActionOnCorrespondenceItem[]
  >([]);
  const [employeeApplications, setEmployeeApplications] = useState<
    EmployeeApplicationItem[]
  >([]);
  const [sadhakMovements, setSadhakMovements] = useState<SadhakMovementItem[]>([]);
  const [tourApprovals, setTourApprovals] = useState<TourApprovalItem[]>([]);
  const [meetingPoints, setMeetingPoints] = useState<MeetingPointItem[]>([]);
  const [partyAdvances, setPartyAdvances] = useState<PartyAdvanceItem[]>([]);
  const [sadhakAdvances, setSadhakAdvances] = useState<SadhakAdvanceItem[]>([]);
  const [incentiveApprovals, setIncentiveApprovals] = useState<
    IncentiveApprovalItem[]
  >([]);
  const [chargeAccepts, setChargeAccepts] = useState<ChargeAcceptItem[]>([]);
  const [paymentTermsVerifications, setPaymentTermsVerifications] = useState<
    PaymentTermsVerifyItem[]
  >([]);
  const [purchaseQuotations, setPurchaseQuotations] = useState<
    PurchaseQuotationItem[]
  >([]);
  const [rrsStatuses, setRrsStatuses] = useState<RrsStatusItem[]>([]);
  const [materialQualities, setMaterialQualities] = useState<
    MaterialQualityItem[]
  >([]);
  const [leaveApprovals, setLeaveApprovals] = useState<LeaveApprovalItem[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrderItem[]>([]);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showBranchApprovals, setShowBranchApprovals] = useState(false);
  const [showIssueVerifications, setShowIssueVerifications] = useState(false);
  const [showActionOnRecruitments, setShowActionOnRecruitments] = useState(false);
  const [showActionOnCorrespondences, setShowActionOnCorrespondences] =
    useState(false);
  const [showEmployeeApplications, setShowEmployeeApplications] = useState(false);
  const [showSadhakMovements, setShowSadhakMovements] = useState(false);
  const [showTourApprovals, setShowTourApprovals] = useState(false);
  const [showMeetingPoints, setShowMeetingPoints] = useState(false);
  const [showPartyAdvances, setShowPartyAdvances] = useState(false);
  const [showSadhakAdvances, setShowSadhakAdvances] = useState(false);
  const [showIncentiveApprovals, setShowIncentiveApprovals] = useState(false);
  const [showChargeAccepts, setShowChargeAccepts] = useState(false);
  const [showPaymentTermsVerifications, setShowPaymentTermsVerifications] =
    useState(false);
  const [showPurchaseQuotations, setShowPurchaseQuotations] = useState(false);
  const [showRrsStatuses, setShowRrsStatuses] = useState(false);
  const [showMaterialQualities, setShowMaterialQualities] = useState(false);
  const [showLeaveApprovals, setShowLeaveApprovals] = useState(false);
  const [showWorkOrders, setShowWorkOrders] = useState(false);
  const [showStaticTable, setShowStaticTable] = useState(false);
  const [taskPageNumber, setTaskPageNumber] = useState(1);
  const [taskPageSize, setTaskPageSize] = useState(10);
  const [taskTotalCount, setTaskTotalCount] = useState(0);
  const [taskSearch, setTaskSearch] = useState('');
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');
  const [hodName, setHodName] = useState('');
  const hodCode = getHodCode();
  const toolbarDescription = `${getEmployeeName()} (${getEmpNum()}) ${getDepartmentName()} - HOD : ${
    hodName || hodCode || '-'
  }`;

  const fetchTasks = useCallback(async (
    item: DashboardItem,
    pageNumber = 1,
    pageSize = 10,
    searchText = '',
  ) => {
    const normalizedSearchText = searchText.trim();
    const isSearchActive = normalizedSearchText.length >= 3;
    const requestPageNumber = isSearchActive ? 1 : pageNumber;
    const requestPageSize = isSearchActive
      ? Math.max(pageSize, item.RecordCount || 0, 500)
      : pageSize;

    setActiveItem(item);
    setTaskPageNumber(requestPageNumber);
    setTaskPageSize(pageSize);
    setBillDetails([]);
    setBranchApprovals([]);
    setIssueVerifications([]);
    setActionOnRecruitments([]);
    setActionOnCorrespondences([]);
    setEmployeeApplications([]);
    setSadhakMovements([]);
    setTourApprovals([]);
    setMeetingPoints([]);
    setPartyAdvances([]);
    setSadhakAdvances([]);
    setIncentiveApprovals([]);
    setChargeAccepts([]);
    setPaymentTermsVerifications([]);
    setPurchaseQuotations([]);
    setRrsStatuses([]);
    setMaterialQualities([]);
    setLeaveApprovals([]);
    setWorkOrders([]);
    setShowBillDetails(false);
    setShowBranchApprovals(false);
    setShowIssueVerifications(false);
    setShowActionOnRecruitments(false);
    setShowActionOnCorrespondences(false);
    setShowEmployeeApplications(false);
    setShowSadhakMovements(false);
    setShowTourApprovals(false);
    setShowMeetingPoints(false);
    setShowPartyAdvances(false);
    setShowSadhakAdvances(false);
    setShowIncentiveApprovals(false);
    setShowChargeAccepts(false);
    setShowPaymentTermsVerifications(false);
    setShowPurchaseQuotations(false);
    setShowRrsStatuses(false);
    setShowMaterialQualities(false);
    setShowLeaveApprovals(false);
    setShowWorkOrders(false);

    if (isMyRrsStatusItem(item)) {
      setTasks([]);
      setTaskTotalCount(0);
      setShowStaticTable(false);
      setShowRrsStatuses(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetRRSDetails', {
          rrsid: 0,
          filtertype: 'Issue',
          userid: getEmpNum(),
          searchempnum: '',
          dataflag: getDataFlag(),
          type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const rrsRows = getDataRecords(response.data).map(normalizeRrsStatus);
        const totalRecords = getTotalRecords(response.data, rrsRows);
        const nextTotalCount = Number(totalRecords);

        setRrsStatuses(rrsRows);
        setTaskTotalCount(nextTotalCount);
        setActiveItem(currentItem =>
          currentItem?.PanelId === item.PanelId
            ? { ...currentItem, RecordCount: nextTotalCount }
            : currentItem,
        );
        setItems(currentItems =>
          currentItems.map(currentItem =>
            currentItem.PanelId === item.PanelId
              ? { ...currentItem, RecordCount: nextTotalCount }
              : currentItem,
          ),
        );
      } catch (apiError) {
        setRrsStatuses([]);
        setTaskTotalCount(0);
        setError('Unable to load RRS status listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isLeaveApprovalItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowLeaveApprovals(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetLeaveApproval', {
          EmpNum: getEmpNum(),
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
          DataFlag: getDataFlag(),
        });
        const leaveRows = getDataRecords(response.data).map(normalizeLeaveApproval);
        const totalRecords = getTotalRecords(response.data, leaveRows);

        setLeaveApprovals(leaveRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setLeaveApprovals([]);
        setTaskTotalCount(0);
        setError('Unable to load leave or tour records listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (item.source === 'static') {
      setTasks([]);
      setTaskTotalCount(staticRows.length);
      setShowStaticTable(true);
      setLoadingTasks(false);
      setError('');
      return;
    }

    if (isActionOnRecruitmentItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowActionOnRecruitments(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post(
          '/ToDo/GetActionOnRecruitmentDetails',
          {
            DM_ID: '',
            DG_ID: '',
            HSR_POST_NAME: '',
            APPLICANT_NAME: '',
            SHOW_EXPERIENCED: '',
            INTERVIEW_DATE: '',
            ADMIN_ACTION: '',
            COMPANY: '',
            DataFlag: getDataFlag(),
            empnum: String(getEmpNum()),
            Type: 2,
            PageIndex: requestPageNumber,
            PageSize: requestPageSize,
          },
        );
        const recruitmentRows = getDataRecords(response.data).map(
          normalizeActionOnRecruitment,
        );
        const totalRecords = Math.max(
          getTotalRecords(response.data, recruitmentRows),
          recruitmentRows.length,
        );

        setActionOnRecruitments(recruitmentRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setActionOnRecruitments([]);
        setTaskTotalCount(0);
        setError('Unable to load action on recruitment listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isActionOnCorrespondenceItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowActionOnCorrespondences(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post(
          '/ToDo/GetActionOnCorrespondenceDetails',
          {
            Type: 2,
            empnum: getEmpNum(),
            DataFlag: getDataFlag(),
            LetterDateReceive: '',
            LetterTypeID: 0,
            ReplyStatus: 'A',
            EntryClose: 'Y',
            LetterFrom: '',
            LetterSubject: '',
            ReplyContents: '',
            LetterId: 0,
            PageIndex: requestPageNumber,
            PageSize: requestPageSize,
          },
        );
        const correspondenceRows = getDataRecords(response.data).map(
          normalizeActionOnCorrespondence,
        );
        const totalRecords = getTotalRecords(response.data, correspondenceRows);

        setActionOnCorrespondences(correspondenceRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setActionOnCorrespondences([]);
        setTaskTotalCount(0);
        setError('Unable to load action on correspondence listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isEmployeeApplicationItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowEmployeeApplications(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetEmployeeApplication', {
          empnum: getEmpNum(),
          DataFlag: getDataFlag(),
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const applicationRows = getDataRecords(response.data).map(
          normalizeEmployeeApplication,
        );
        const totalRecords = getTotalRecords(response.data, applicationRows);
        const nextTotalCount = Number(totalRecords);

        setEmployeeApplications(applicationRows);
        setTaskTotalCount(nextTotalCount);
        setActiveItem(currentItem =>
          currentItem?.PanelId === item.PanelId
            ? { ...currentItem, RecordCount: nextTotalCount }
            : currentItem,
        );
        setItems(currentItems =>
          currentItems.map(currentItem =>
            currentItem.PanelId === item.PanelId
              ? { ...currentItem, RecordCount: nextTotalCount }
              : currentItem,
          ),
        );
      } catch (apiError) {
        setEmployeeApplications([]);
        setTaskTotalCount(0);
        setError('Unable to load employee application listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isSadhakMovementItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowSadhakMovements(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetSadhakMovementApproval', {
          EmpNum: getEmpNum(),
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
          DataFlag: getDataFlag(),
        });
        const movementRows = getDataRecords(response.data).map(
          normalizeSadhakMovement,
        );
        const totalRecords = getTotalRecords(response.data, movementRows);

        setSadhakMovements(movementRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setSadhakMovements([]);
        setTaskTotalCount(0);
        setError('Unable to load sadhak movement listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isTourApprovalItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowTourApprovals(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetTourApproval', {
          EmpNum: getEmpNum(),
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
          DataFlag: getDataFlag(),
        });
        const tourRows = getDataRecords(response.data).map(normalizeTourApproval);
        const totalRecords = getTotalRecords(response.data, tourRows);

        setTourApprovals(tourRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setTourApprovals([]);
        setTaskTotalCount(0);
        setError('Unable to load tour approval listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isMeetingPointConfirmationItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowMeetingPoints(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetMeetingPointConfApproval', {
          empnum: getEmpNum(),
          DataFlag: getDataFlag(),
          Type: 2,
          MeetId: 0,
          Title: '',
          FromDate: '',
          ToDate: '',
          Priority: '',
          EmpName: '',
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const meetingRows = getDataRecords(response.data).map(
          normalizeMeetingPoint,
        );
        const totalRecords = getTotalRecords(response.data, meetingRows);

        setMeetingPoints(meetingRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setMeetingPoints([]);
        setTaskTotalCount(0);
        setError('Unable to load meeting points confirmation listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isMeetingPointItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowMeetingPoints(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetMeetingPointApproval', {
          empnum: String(getEmpNum()),
          dataflag: getDataFlag(),
          DataFlag: getDataFlag(),
          PageNumber: requestPageNumber,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const meetingRows = getDataRecords(response.data).map(
          normalizeMeetingPoint,
        );
        const totalRecords =
          response.data?.Meta?.TotalRecords ||
          response.data?.meta?.totalRecords ||
          meetingRows[0]?.RecordCount ||
          meetingRows.length ||
          0;

        setMeetingPoints(meetingRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setMeetingPoints([]);
        setTaskTotalCount(0);
        setError('Unable to load meeting points listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isPaymentTermsVerificationItem(item)) {
      setTasks([]);
      setTaskTotalCount(0);
      setShowStaticTable(false);
      setShowPaymentTermsVerifications(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetPaymentTerms', {
          poid: 0,
          filtertype: '',
          contract_type: '',
          userid: 188,
          dataflag: getDataFlag(),
          searchvendor: '',
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const paymentTermsRows = getDataRecords(response.data).map(
          normalizePaymentTermsVerification,
        );
        const totalRecords = getTotalRecords(response.data, paymentTermsRows);
        const nextTotalCount = Number(totalRecords);

        setPaymentTermsVerifications(paymentTermsRows);
        setTaskTotalCount(nextTotalCount);
        setActiveItem(currentItem =>
          currentItem?.PanelId === item.PanelId
            ? { ...currentItem, RecordCount: nextTotalCount }
            : currentItem,
        );
        setItems(currentItems =>
          currentItems.map(currentItem =>
            currentItem.PanelId === item.PanelId
              ? { ...currentItem, RecordCount: nextTotalCount }
              : currentItem,
          ),
        );
      } catch (apiError) {
        setPaymentTermsVerifications([]);
        setTaskTotalCount(0);
        setError('Unable to load payment terms verification listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isPurchaseQuotationItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowPurchaseQuotations(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetPurchaseQuotation', {
          qcsid: 0,
          filtertype: '',
          userid: getEmpNum(),
          username: '',
          dataflag: getDataFlag(),
          searchvendor: '',
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const quotationRows = getDataRecords(response.data).map(
          normalizePurchaseQuotation,
        );
        const totalRecords =
          response.data?.Meta?.TotalRecords ||
          response.data?.meta?.totalRecords ||
          quotationRows[0]?.RecordCount ||
          item.RecordCount ||
          0;

        setPurchaseQuotations(quotationRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setPurchaseQuotations([]);
        setTaskTotalCount(0);
        setError('Unable to load purchase quotation listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isWorkOrderItem(item)) {
      setTasks([]);
      setTaskTotalCount(0);
      setShowStaticTable(false);
      setShowWorkOrders(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetWorkOrders', {
          quotation_no: 0,
          filtertype: '',
          userid: 267,
          username: '',
          dataflag: getDataFlag(),
          searchvendor: '',
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const workOrderRows = getDataRecords(response.data).map(normalizeWorkOrder);
        const totalRecords = getTotalRecords(response.data, workOrderRows);
        const nextTotalCount = Number(totalRecords);

        setWorkOrders(workOrderRows);
        setTaskTotalCount(nextTotalCount);
        setActiveItem(currentItem =>
          currentItem?.PanelId === item.PanelId
            ? { ...currentItem, RecordCount: nextTotalCount }
            : currentItem,
        );
        setItems(currentItems =>
          currentItems.map(currentItem =>
            currentItem.PanelId === item.PanelId
              ? { ...currentItem, RecordCount: nextTotalCount }
              : currentItem,
          ),
        );
      } catch (apiError) {
        setWorkOrders([]);
        setTaskTotalCount(0);
        setError('Unable to load work order listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isMaterialQualityItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowMaterialQualities(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetMaterialQuality', {
          rmid: 0,
          filtertype: '',
          userid: 9225,
          username: '',
          dataflag: getDataFlag(),
          searchvendor: '',
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const qualityRows = getDataRecords(response.data).map(
          normalizeMaterialQuality,
        );
        const totalRecords =
          response.data?.Meta?.TotalRecords ||
          response.data?.meta?.totalRecords ||
          qualityRows[0]?.RecordCount ||
          item.RecordCount ||
          0;

        setMaterialQualities(qualityRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setMaterialQualities([]);
        setTaskTotalCount(0);
        setError('Unable to load material quality listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isSadhakAdvanceItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowSadhakAdvances(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetSadhakAdvanceApproval', {
          empnum: getEmpNum(),
          DataFlag: getDataFlag(),
          Type: 2,
          EmpName: '',
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const advanceRows = getDataRecords(response.data).map(normalizeSadhakAdvance);
        const totalRecords =
          response.data?.Meta?.TotalRecords ||
          response.data?.meta?.totalRecords ||
          advanceRows[0]?.RecordCount ||
          item.RecordCount ||
          0;

        setSadhakAdvances(advanceRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setSadhakAdvances([]);
        setTaskTotalCount(0);
        setError('Unable to load sadhak advance listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isPartyAdvanceItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowPartyAdvances(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetPartyAdvanceApproval', {
          empnum: getEmpNum(),
          DataFlag: getDataFlag(),
          Type: 2,
          VendorName: '',
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const advanceRows = getDataRecords(response.data).map(normalizePartyAdvance);
        const totalRecords =
          response.data?.Meta?.TotalRecords ||
          response.data?.meta?.totalRecords ||
          advanceRows[0]?.RecordCount ||
          item.RecordCount ||
          0;

        setPartyAdvances(advanceRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setPartyAdvances([]);
        setTaskTotalCount(0);
        setError('Unable to load party advance listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isIncentiveApprovalItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowIncentiveApprovals(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetIncentiveApproval', {
          empnum: getEmpNum(),
          DataFlag: getDataFlag(),
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: isSearchActive ? requestPageSize : Math.max(pageSize, 100),
        });
        const incentiveRows = getDataRecords(response.data).map(
          normalizeIncentiveApproval,
        );
        const totalRecords = getTotalRecords(response.data, incentiveRows);

        setIncentiveApprovals(incentiveRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setIncentiveApprovals([]);
        setTaskTotalCount(0);
        setError('Unable to load incentive approval listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isChargeAcceptItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowChargeAccepts(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetChargeAccept', {
          EmpNum: getEmpNum(),
          Type: 2,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
          DataFlag: getDataFlag(),
        });
        const chargeRows = getDataRecords(response.data).map(normalizeChargeAccept);
        const totalRecords = getTotalRecords(response.data, chargeRows);

        setChargeAccepts(chargeRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setChargeAccepts([]);
        setTaskTotalCount(0);
        setError('Unable to load charge accept listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isIssueVerificationItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowIssueVerifications(true);
      setLoadingTasks(true);
      setError('');

      try {
        const [response, employeeResponse] = await Promise.all([
          axiosInstance.post('/ToDo/GetIssueVerification', {
            empnum: String(getEmpNum()),
            dataflag: getDataFlag(),
            DataFlag: getDataFlag(),
            PageNumber: requestPageNumber,
            PageIndex: requestPageNumber,
            PageSize: requestPageSize,
          }),
          getEmployeeAll({
            emp_num: 0,
            dm_id: 0,
            emp_code: 0,
          }),
        ]);
        const issueRows = getDataRecords(response.data).map(record =>
          normalizeIssueVerificationWithEmployees(record, employeeResponse.data),
        );
        const totalRecords =
          response.data?.Meta?.TotalRecords ||
          response.data?.meta?.totalRecords ||
          issueRows[0]?.RecordCount ||
          issueRows.length ||
          0;

        setIssueVerifications(issueRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setIssueVerifications([]);
        setTaskTotalCount(0);
        setError('Unable to load issue verification listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isBranchApprovalItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowBranchApprovals(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetBranchApproval', {
          empnum: String(getEmpNum()),
          dataflag: getDataFlag(),
          DataFlag: getDataFlag(),
          PageNumber: requestPageNumber,
          PageIndex: requestPageNumber,
          PageSize: requestPageSize,
        });
        const approvalRows = getBranchApprovalRecords(response.data).map(
          normalizeBranchApproval,
        );
        const totalRecords =
          response.data?.Meta?.TotalRecords ||
          response.data?.meta?.totalRecords ||
          approvalRows[0]?.RecordCount ||
          item.RecordCount ||
          0;

        setBranchApprovals(approvalRows);
        setTaskTotalCount(Number(totalRecords));
      } catch (apiError) {
        setBranchApprovals([]);
        setTaskTotalCount(0);
        setError('Unable to load branch approval listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    if (isBillsPendingItem(item)) {
      setTasks([]);
      setTaskTotalCount(item.RecordCount || 0);
      setShowStaticTable(false);
      setShowBillDetails(true);
      setLoadingTasks(true);
      setError('');

      try {
        const response = await axiosInstance.post('/ToDo/GetBillDetails', {
          empnum: String(getEmpNum()),
          dataflag: getDataFlag(),
          DataFlag: getDataFlag(),
          Type: '2',
          PageIndex: String(requestPageNumber),
          PageSize: String(requestPageSize),
        });
        const billRows = getBillRecords(response.data).map(normalizeBillDetail);

        setBillDetails(billRows);
        setTaskTotalCount(billRows[0]?.RecordCount || item.RecordCount || 0);
      } catch (apiError) {
        setBillDetails([]);
        setTaskTotalCount(0);
        setError('Unable to load bill pending listing.');
      } finally {
        setLoadingTasks(false);
      }

      return;
    }

    setShowStaticTable(false);
    setLoadingTasks(true);
    setError('');

    try {
      const response = await axiosInstance.post('/ToDo/GetTasks', {
        taskid: '0',
        filterempnum: '',
        filterfdate: '',
        filtertdate: '',
        filtertype: getTaskFilterType(item),
        empnum: String(getEmpNum()),
        dataflag: getDataFlag(),
        Type: '2',
        PageIndex: String(requestPageNumber),
        PageSize: String(requestPageSize),
      });

      const taskRows =
        response.data?.taskdetail ||
        response.data?.TaskDetail ||
        response.data?.Data ||
        response.data?.data ||
        [];
      const taskList = Array.isArray(taskRows) ? taskRows : [];
      const visibleTaskRows = isTaskConfirmationItem(item)
        ? taskList.filter(
            task =>
              isRecord(task) &&
              normalizeLabel(getTextByKeys(task, ['completed', 'Completed'])) === 'y',
          )
        : taskList;
      const totalRecords =
        response.data?.Meta?.TotalRecords ||
        response.data?.meta?.totalRecords ||
        visibleTaskRows[0]?.RecordCount ||
        0;
      setTasks(visibleTaskRows as TaskItem[]);
      setTaskTotalCount(
        isTaskConfirmationItem(item)
          ? visibleTaskRows.length
          : Number(totalRecords),
      );
    } catch (apiError) {
      setTasks([]);
      setTaskTotalCount(0);
      setError('Unable to load task listing.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const handleTaskPageChange = (pageNumber: number) => {
    if (!activeItem) {
      return;
    }

    fetchTasks(activeItem, pageNumber, taskPageSize, taskSearch);
  };

  const handleTaskPageSizeChange = (pageSize: number) => {
    if (!activeItem) {
      return;
    }

    fetchTasks(activeItem, 1, pageSize, taskSearch);
  };

  const handleTaskSearchChange = (searchText: string) => {
    setTaskSearch(searchText);

    if (!activeItem) {
      return;
    }

    fetchTasks(activeItem, 1, taskPageSize, searchText);
  };

  const refreshPaymentTermsDashboardCount = useCallback(
    async (dashboardItems: DashboardItem[]) => {
      const paymentTermsItem = dashboardItems.find(isPaymentTermsVerificationItem);

      if (!paymentTermsItem) {
        return;
      }

      try {
        const response = await axiosInstance.post('/ToDo/GetPaymentTerms', {
          poid: 0,
          filtertype: '',
          contract_type: '',
          userid: 188,
          dataflag: getDataFlag(),
          searchvendor: '',
          Type: 2,
          PageIndex: 1,
          PageSize: 10,
        });
        const paymentTermsRows = getDataRecords(response.data).map(
          normalizePaymentTermsVerification,
        );
        const nextTotalCount = Number(
          getTotalRecords(response.data, paymentTermsRows),
        );

        setItems(currentItems =>
          currentItems.map(currentItem =>
            currentItem.PanelId === paymentTermsItem.PanelId
              ? { ...currentItem, RecordCount: nextTotalCount }
              : currentItem,
          ),
        );
        setActiveItem(currentItem =>
          currentItem?.PanelId === paymentTermsItem.PanelId
            ? { ...currentItem, RecordCount: nextTotalCount }
            : currentItem,
        );
      } catch (apiError) {
        // Keep the dashboard count if the count refresh fails.
      }
    },
    [],
  );

  const refreshWorkOrderDashboardCount = useCallback(
    async (dashboardItems: DashboardItem[]) => {
      const workOrderItem = dashboardItems.find(isWorkOrderItem);

      if (!workOrderItem) {
        return;
      }

      try {
        const response = await axiosInstance.post('/ToDo/GetWorkOrders', {
          quotation_no: 0,
          filtertype: '',
          userid: 267,
          username: '',
          dataflag: getDataFlag(),
          searchvendor: '',
          Type: 2,
          PageIndex: 1,
          PageSize: 10,
        });
        const workOrderRows = getDataRecords(response.data).map(normalizeWorkOrder);
        const nextTotalCount = Number(getTotalRecords(response.data, workOrderRows));

        setItems(currentItems =>
          currentItems.map(currentItem =>
            currentItem.PanelId === workOrderItem.PanelId
              ? { ...currentItem, RecordCount: nextTotalCount }
              : currentItem,
          ),
        );
        setActiveItem(currentItem =>
          currentItem?.PanelId === workOrderItem.PanelId
            ? { ...currentItem, RecordCount: nextTotalCount }
            : currentItem,
        );
      } catch (apiError) {
        // Keep the dashboard count if the count refresh fails.
      }
    },
    [],
  );

  const fetchDashboard = useCallback(async () => {
    setLoadingTodos(true);
    setError('');

    try {
      const response = await getDashboard({
        empnum: getEmpNum(),
        DataFlag: getDataFlag(),
        Type: 1,
        Show: 'Testing',
      });

      const dashboardItems = response.data?.Dashboard || [];
      const allDashboardItems = [...dashboardItems];
      setItems(allDashboardItems);
      await Promise.all([
        refreshPaymentTermsDashboardCount(allDashboardItems),
        refreshWorkOrderDashboardCount(allDashboardItems),
      ]);

      if (allDashboardItems.length) {
        fetchTasks(allDashboardItems[0]);
      }
    } catch (apiError) {
      setError('Unable to load dashboard todo list.');
    } finally {
      setLoadingTodos(false);
    }
  }, [
    fetchTasks,
    refreshPaymentTermsDashboardCount,
    refreshWorkOrderDashboardCount,
  ]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const loadHodName = async () => {
      if (!hodCode) {
        return;
      }

      try {
        const response = await getEmployeeAll({
          emp_num: 0,
          dm_id: 0,
          emp_code: 0,
        });
        const nextHodName = findEmployeeNameByCode(response.data, hodCode);
        setHodName(nextHodName ? String(nextHodName) : '');
      } catch (apiError) {
        setHodName('');
      }
    };

    loadHodName();
  }, [hodCode]);

  return (
    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
      <PageToolbar title="Dashboard" description={toolbarDescription} />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-3">
              <TodoList
                items={items}
                activeId={activeItem?.PanelId}
                loading={loadingTodos}
                onSelect={item => {
                  setTaskSearch('');
                  fetchTasks(item, 1, taskPageSize, '');
                }}
              />
            </div>

            <div className="col-md-9">
              {showBillDetails ? (
                <BillDetailsTable
                  bills={billDetails}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showBranchApprovals ? (
                <BranchApprovalTable
                  approvals={branchApprovals}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showIssueVerifications ? (
                <IssueVerificationTable
                  issues={issueVerifications}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showActionOnRecruitments ? (
                <ActionOnRecruitmentTable
                  items={actionOnRecruitments}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showActionOnCorrespondences ? (
                <ActionOnCorrespondenceTable
                  items={actionOnCorrespondences}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showEmployeeApplications ? (
                <EmployeeApplicationTable
                  items={employeeApplications}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showSadhakMovements ? (
                <SadhakMovementTable
                  items={sadhakMovements}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showTourApprovals ? (
                <TourApprovalTable
                  items={tourApprovals}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showMeetingPoints ? (
                <MeetingPointTable
                  meetings={meetingPoints}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showPartyAdvances ? (
                <PartyAdvanceTable
                  advances={partyAdvances}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showSadhakAdvances ? (
                <SadhakAdvanceTable
                  advances={sadhakAdvances}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showIncentiveApprovals ? (
                <IncentiveApprovalTable
                  approvals={incentiveApprovals}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showChargeAccepts ? (
                <ChargeAcceptTable
                  items={chargeAccepts}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showPaymentTermsVerifications ? (
                <PaymentTermsVerificationTable
                  items={paymentTermsVerifications}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showPurchaseQuotations ? (
                <PurchaseQuotationApprovalTable
                  quotations={purchaseQuotations}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showRrsStatuses ? (
                <RrsStatusTable
                  items={rrsStatuses}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showMaterialQualities ? (
                <MaterialQualityTable
                  items={materialQualities}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showLeaveApprovals ? (
                <LeaveApprovalTable
                  leaves={leaveApprovals}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : showWorkOrders ? (
                <WorkOrderApprovalTable
                  orders={workOrders}
                  loading={loadingTasks}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              ) : (
                <TaskTable
                  title={activeItem?.Panel || 'Task Listing'}
                  tasks={tasks}
                  loading={loadingTasks}
                  staticRows={showStaticTable ? staticRows : undefined}
                  pageNumber={taskPageNumber}
                  pageSize={taskPageSize}
                  totalCount={taskTotalCount}
                  onPageChange={handleTaskPageChange}
                  onPageSizeChange={handleTaskPageSizeChange}
                  searchValue={taskSearch}
                  onSearchChange={handleTaskSearchChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
