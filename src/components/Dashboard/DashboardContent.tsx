import React, { useCallback, useEffect, useState } from 'react';
import { getDashboard, getEmployeeAll } from 'src/api/masterApi';
import { PageToolbar } from 'src/components/Common/PageToolbar';
import axiosInstance from 'src/redux/interceptor';
import { BillDetailsTable } from './components/BillDetailsTable';
import { BranchApprovalTable } from './components/BranchApprovalTable';
import { IssueVerificationTable } from './components/IssueVerificationTable';
import { MeetingPointTable } from './components/MeetingPointTable';
import { TaskTable } from './components/TaskTable';
import { TodoList } from './components/TodoList';
import {
  BillDetailItem,
  BranchApprovalItem,
  DashboardItem,
  IssueVerificationItem,
  MeetingPointItem,
  StaticTaskRow,
  TaskItem,
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

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
  const [meetingPoints, setMeetingPoints] = useState<MeetingPointItem[]>([]);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showBranchApprovals, setShowBranchApprovals] = useState(false);
  const [showIssueVerifications, setShowIssueVerifications] = useState(false);
  const [showMeetingPoints, setShowMeetingPoints] = useState(false);
  const [showStaticTable, setShowStaticTable] = useState(false);
  const [taskPageNumber, setTaskPageNumber] = useState(1);
  const [taskPageSize, setTaskPageSize] = useState(10);
  const [taskTotalCount, setTaskTotalCount] = useState(0);
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
  ) => {
    setActiveItem(item);
    setTaskPageNumber(pageNumber);
    setTaskPageSize(pageSize);
    setBillDetails([]);
    setBranchApprovals([]);
    setIssueVerifications([]);
    setMeetingPoints([]);
    setShowBillDetails(false);
    setShowBranchApprovals(false);
    setShowIssueVerifications(false);
    setShowMeetingPoints(false);

    if (item.source === 'static') {
      setTasks([]);
      setTaskTotalCount(staticRows.length);
      setShowStaticTable(true);
      setLoadingTasks(false);
      setError('');
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
          PageNumber: pageNumber,
          PageIndex: pageNumber,
          PageSize: pageSize,
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
            PageNumber: pageNumber,
            PageIndex: pageNumber,
            PageSize: pageSize,
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
          PageNumber: pageNumber,
          PageIndex: pageNumber,
          PageSize: pageSize,
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
          PageIndex: String(pageNumber),
          PageSize: String(pageSize),
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
        PageIndex: String(pageNumber),
        PageSize: String(pageSize),
      });

      const taskRows =
        response.data?.taskdetail ||
        response.data?.TaskDetail ||
        response.data?.Data ||
        response.data?.data ||
        [];
      const totalRecords =
        response.data?.Meta?.TotalRecords ||
        response.data?.meta?.totalRecords ||
        taskRows[0]?.RecordCount ||
        0;
      setTasks(taskRows);
      setTaskTotalCount(Number(totalRecords));
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

    fetchTasks(activeItem, pageNumber, taskPageSize);
  };

  const handleTaskPageSizeChange = (pageSize: number) => {
    if (!activeItem) {
      return;
    }

    fetchTasks(activeItem, 1, pageSize);
  };

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
      const allDashboardItems = [...staticTodoItems, ...dashboardItems];
      setItems(allDashboardItems);

      if (allDashboardItems.length) {
        fetchTasks(allDashboardItems[0]);
      }
    } catch (apiError) {
      setError('Unable to load dashboard todo list.');
    } finally {
      setLoadingTodos(false);
    }
  }, [fetchTasks]);

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
                onSelect={item => fetchTasks(item, 1, taskPageSize)}
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
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
