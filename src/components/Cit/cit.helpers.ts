import { masterApiPaths } from 'src/utils/masterApiPaths';
import { FloatingSelectOption } from 'src/components/Common/FloatingSelectField';
import {
  extractArrayPayload,
  getFirstValue,
  normalizeApiDate,
  normalizeApiTime,
} from '../AnnounceMaster/AnnounceMasterContent.helpers';
import {
  CallCenterTicketForm,
  CallCenterTicketValidationErrors,
} from './components/CallCenterTicketTab';
import { TicketFollowUpItem } from './components/TicketFollowUpTab';

export type CitOperation = 'ADD' | 'EDIT' | 'VIEW';
export type CitApiRecord = Record<string, unknown>;
export type CitCallCategoryRecord = Record<string, unknown>;
export type CitCallSubCategoryRecord = Record<string, unknown>;
export type CitEmployeeRecord = Record<string, unknown>;
export interface CitCallCategoryOption extends FloatingSelectOption {
  deptIds: string[];
  employeeIds: string[];
  completionEmployeeIds: string[];
}

export interface CitCacheRecord {
  informationCode: string;
  completed: boolean;
  ticketForm: CallCenterTicketForm;
  followUps: TicketFollowUpItem[];
  createdAt: string;
  updatedAt: string;
}

type StoredUser = Partial<IUser> & {
  userId?: number | string;
  user_ID?: number | string;
  USER_ID?: number | string;
  EmpNum?: number | string;
  emp_num?: number | string;
  Emp_Num?: number | string;
  deptId?: number | string;
  dept_Id?: number | string;
  Dept_Id?: number | string;
  fy_id?: number | string;
  fyId?: number | string;
  FY_ID?: number | string;
  DataFlag?: string;
  dataFlag?: string;
};

export const CIT_STORAGE_KEY = 'cit-listing-cache';

const CIT_ID_KEYS = [
  'iCall_Information_Traits_ID',
  'ICall_Information_Traits_ID',
  'Call_Information_Traits_ID',
  'InformationCode',
  'informationCode',
  'call_Id',
  'CallId',
  'id',
  'ID',
];

export const getToday = () => new Date().toISOString().split('T')[0];

const getCurrentLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentLocalTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getCurrentLocalTimeWithSeconds = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const normalizeCitDateValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  const rawValue = String(value).trim();

  if (!rawValue) {
    return '';
  }

  const dateToken = rawValue.split(/\s+/)[0].replace(/\./g, '/');
  const yyyyMmDdMatch = dateToken.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);

  if (yyyyMmDdMatch) {
    const [, year, month, day] = yyyyMmDdMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const slashDateMatch = dateToken.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (slashDateMatch) {
    const [, firstPart, secondPart, year] = slashDateMatch;
    const firstNumber = Number(firstPart);
    const secondNumber = Number(secondPart);

    if (firstNumber > 12 && secondNumber <= 12) {
      return `${year}-${secondPart.padStart(2, '0')}-${firstPart.padStart(2, '0')}`;
    }

    return `${year}-${firstPart.padStart(2, '0')}-${secondPart.padStart(2, '0')}`;
  }

  return normalizeApiDate(rawValue);
};

export const createInitialTicketForm = (): CallCenterTicketForm => ({
  ticketId: 'AUTO/VIEW',
  creatorUserId: '',
  date: getToday(),
  ngCode: '',
  callCategoryId: '',
  callCategoryName: '',
  selectTypeId: [],
  selectType: '',
  selectSadhakId: '',
  selectSadhakName: '',
  requestBy: '',
  country1: '',
  mobileNo1: '',
  country2: '',
  mobileNo2: '',
  callBackDate: '',
  callBackTime: '',
  details: '',
  completionReply: '',
});

export const readCitCache = (): CitCacheRecord[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(CIT_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as CitCacheRecord[]) : [];
  } catch {
    return [];
  }
};

export const writeCitCache = (records: CitCacheRecord[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CIT_STORAGE_KEY, JSON.stringify(records));
};

export const createNextInformationCode = (records: CitCacheRecord[]) =>
  String(
    records.reduce((maxValue, record) => {
      const parsedValue = Number(record.informationCode);
      return Number.isFinite(parsedValue)
        ? Math.max(maxValue, parsedValue)
        : maxValue;
    }, 0) + 1,
  );

export const readCurrentUser = (): StoredUser => {
  try {
    const storedValue = localStorage.getItem('user');
    return storedValue ? JSON.parse(storedValue) : {};
  } catch {
    return {};
  }
};

const resolveCurrentUserId = (currentUser: StoredUser) =>
  Number(
    currentUser.empNum ||
      currentUser.EmpNum ||
      currentUser.emp_num ||
      currentUser.Emp_Num ||
      currentUser.userId ||
      currentUser.user_ID ||
      currentUser.USER_ID ||
      currentUser.id ||
      0,
  ) || 0;

export const getCurrentUserMeta = () => {
  const currentUser = readCurrentUser();

  return {
    empNum: resolveCurrentUserId(currentUser),
    deptId:
      Number(currentUser.deptId || currentUser.dept_Id || currentUser.Dept_Id || 228) ||
      228,
    fyId:
      Number(currentUser.fy_id || currentUser.fyId || currentUser.FY_ID || 0) ||
      0,
    dataFlag: currentUser.DataFlag || currentUser.dataFlag || 'GANGOTRI',
  };
};

export const toNullableText = (value: string) => {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue : null;
};

const toNullableDigitsText = (value: string) => {
  const normalizedValue = value.replace(/[^\d]/g, '');
  return normalizedValue ? normalizedValue : null;
};

export const toNumberValue = (value: string) => {
  const normalizedValue = value.replace(/[^\d]/g, '');
  return normalizedValue ? Number(normalizedValue) : 0;
};

export const toDateTimeValue = (date: string, time: string) =>
  date ? `${date} ${time || '00:00'}` : null;

const parseDelimitedIds = (value: string) =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '' && item !== '0');

export const validateCitForm = (
  form: CallCenterTicketForm,
  options?: {
    hasSelectableTypes?: boolean;
    completed?: boolean;
  },
): CallCenterTicketValidationErrors => {
  const nextErrors: CallCenterTicketValidationErrors = {};
  const hasSelectableTypes = options?.hasSelectableTypes ?? false;
  const completed = options?.completed ?? false;

  if (!form.callCategoryId.trim()) {
    nextErrors.callCategoryName = 'Call Category Name is required.';
  }
  if (
    form.callCategoryId.trim() &&
    form.callCategoryId !== '27' &&
    hasSelectableTypes &&
    !form.selectTypeId.length
  ) {
    nextErrors.selectType = 'Select Types is required.';
  }
  if (form.callCategoryId === '27' && !form.selectSadhakId.trim()) {
    nextErrors.selectSadhakName = 'Select Sadhak is required.';
  }
  if (!form.requestBy.trim()) {
    nextErrors.requestBy = 'Request By is required.';
  }
  const normalizedMobileNo1 = form.mobileNo1.replace(/[^\d]/g, '');
  if (!normalizedMobileNo1) {
    nextErrors.mobileNo1 = 'Mobile No 1 is required.';
  } else if (normalizedMobileNo1.length !== 10) {
    nextErrors.mobileNo1 = 'Mobile No 1 must be 10 digits.';
  }
  if (normalizedMobileNo1 && !form.country1.trim()) {
    nextErrors.country1 = 'Country 1 is required when Mobile No 1 is entered.';
  }
  if (!form.callBackDate.trim()) {
    nextErrors.callBackDate = 'Call Back Date is required.';
  }
  if (!form.details.trim()) {
    nextErrors.details = 'Details is required.';
  }
  if (completed && !form.completionReply.trim()) {
    nextErrors.completionReply = 'Reply is required when completed is checked.';
  }

  return nextErrors;
};

export const extractCitId = (payload: unknown, fallbackValue: string) => {
  const records = extractArrayPayload(payload);

  for (const record of records) {
    const resolvedId = getFirstValue(record, CIT_ID_KEYS).trim();

    if (resolvedId && resolvedId !== '0') {
      return resolvedId;
    }
  }

  if (payload && typeof payload === 'object') {
    const resolvedId = getFirstValue(payload as CitApiRecord, CIT_ID_KEYS).trim();

    if (resolvedId && resolvedId !== '0') {
      return resolvedId;
    }
  }

  return fallbackValue;
};

export const mapCitRecordToCache = (record: CitApiRecord): CitCacheRecord => {
  const resolvedMobileNo2 = getFirstValue(record, ['mno2', 'MNo2', 'Mno2']);

  return {
    informationCode: getFirstValue(record, CIT_ID_KEYS),
    completed: ['y', 'yes', 'true', '1'].includes(
      getFirstValue(record, ['complete', 'Complete']).trim().toLowerCase(),
    ),
    ticketForm: {
      ...createInitialTicketForm(),
      ticketId: getFirstValue(record, CIT_ID_KEYS),
      creatorUserId: getFirstValue(record, ['USER_ID', 'useR_ID', 'User_Id']),
      date: normalizeCitDateValue(
        getFirstValue(record, [
          'call_Date',
          'CallDate',
          'Call_Date',
          'Call_Date_Time',
        ]),
      ),
      ngCode: getFirstValue(record, ['ngCode', 'NGCode', 'NgCode']),
      callCategoryId: getFirstValue(record, [
        'iCall_Category_ID',
        'ICall_Category_ID',
        'Call_Category_ID',
      ]),
      callCategoryName: getFirstValue(record, [
        'sCategory',
        'category',
        'Category',
        'CATEGORY',
      ]),
      selectTypeId: getFirstValue(record, [
        'call_SubCat_ID',
        'Call_SubCat_ID',
        'Sub_Cat_Id',
        'sub_Cat_Id',
      ])
        .split(',')
        .map(value => value.trim())
        .filter(Boolean),
      selectType: getFirstValue(record, [
        'call_SubCat_Name',
        'call_SubCat_Name',
      ]),
      selectSadhakId: getFirstValue(record, [
        'Emp_Id',
        'emp_Id',
        'Emp_id',
        'call_User_Id',
        'Call_User_Id',
      ]),
      selectSadhakName: getFirstValue(record, [
        'Emp_Name',
        'EMP_NAME',
        'emp_name',
        'EmpName',
        'calling_sadhak_name',
        'CallingSadhakName',
        'call_User_Name',
        'Call_User_Name',
        'ENAME',
      ]),
      requestBy: getFirstValue(record, [
        'request_by',
        'RequestBy',
        'Request_by',
        'NAME',
        'name',
        'Rec_Head',
        'rec_Head',
      ]),
      country1:
        getFirstValue(record, [
          'Country_Name1',
          'country_name1',
          'CountryName1',
          'countryName1',
          'Country_Name',
          'country_name',
          'Country_code1',
          'Country_code1',
          'CountryCode1',
          'Country_code1',
          'Country_code1',
        ]) ||
        'India',
      mobileNo1: getFirstValue(record, ['mno1', 'MNo1', 'Mno1']),
      country2: resolvedMobileNo2
        ? getFirstValue(record, [
            'Country_Name2',
            'country_name2',
            'CountryName2',
            'countryName2',
            'Country_Code2',
            'country_Code2',
            'Country_Code2',
            'Country_Code2',
            'Country_Code2',
          ])
        : '',
      mobileNo2: resolvedMobileNo2,
      callBackDate: normalizeCitDateValue(
        getFirstValue(record, [
          'call_Back_Date',
          'CallBackDate',
          'Call_Back_Date',
          'Call_Back_Date_Time',
          'Target_Date',
        ]),
      ),
      callBackTime: normalizeApiTime(
        getFirstValue(record, [
          'call_Back_Date_Time',
          'Call_Back_Date_Time',
          'call_Back_Time',
          'Call_Back_Time',
        ]),
      ),
      details: getFirstValue(record, [
        'sInformation_Trait',
        'InformationTrait',
        'icallReply',
        'ICallReply',
        'iCallReply',
      ]),
      completionReply: getFirstValue(record, [
        'iCallReply',
        'ICallReply',
        'icallReply',
      ]),
    },
    followUps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const extractCitDetailRecord = (
  payload: unknown,
): CitApiRecord | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const nestedResult = record.result;

  if (Array.isArray(nestedResult)) {
    const [firstRecord] = nestedResult;
    return firstRecord && typeof firstRecord === 'object'
      ? (firstRecord as CitApiRecord)
      : null;
  }

  if (nestedResult && typeof nestedResult === 'object') {
    return nestedResult as CitApiRecord;
  }

  return record as CitApiRecord;
};

export const extractCitFollowUps = (
  payload: unknown,
): TicketFollowUpItem[] => {
  const detailRecord = extractCitDetailRecord(payload);

  if (!detailRecord) {
    return [];
  }

  const rawFollowUps = detailRecord.citFollowup;

  if (!Array.isArray(rawFollowUps)) {
    return [];
  }

  return rawFollowUps
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object',
    )
    .map((item, index) => ({
      id:
        Number(
          getFirstValue(item, ['AutoId', 'autoId', 'Id', 'ID']) || 0,
        ) || Date.now() + index,
      note: getFirstValue(item, ['Followup_Remark', 'followup_Remark']).trim(),
      userId:
        Number(
          getFirstValue(item, ['Followup_UserId', 'followup_UserId']) || 0,
        ) || undefined,
      citId:
        Number(getFirstValue(item, ['CIT_Id', 'CIT_ID', 'cit_Id']) || 0) ||
        undefined,
      followupDate:
        getFirstValue(item, ['Followup_Date', 'followup_Date']) || undefined,
      followupTime:
        getFirstValue(item, ['Followup_Time', 'followup_Time']) || undefined,
      dataFlag:
        getFirstValue(item, ['Data_Flag', 'data_Flag', 'dataFlag']) ||
        undefined,
    }))
    .filter(item => item.note);
};

export const buildCitSavePayload = ({
  form,
  followUps,
  completed,
  operation,
  informationCodeParam,
  donorSearchValue,
  selectedCategoryOption,
}: {
  form: CallCenterTicketForm;
  followUps: TicketFollowUpItem[];
  completed: boolean;
  operation: CitOperation;
  informationCodeParam: string;
  donorSearchValue?: string;
  selectedCategoryOption?: CitCallCategoryOption | null;
}) => {
  const { empNum, deptId, fyId, dataFlag } = getCurrentUserMeta();
  const resolvedNgCode = toNumberValue(form.ngCode || donorSearchValue || '');
  const currentLocalDate = getCurrentLocalDate();
  const currentLocalTime = getCurrentLocalTime();
  const normalizedMobileNo1 = toNullableDigitsText(form.mobileNo1);
  const normalizedMobileNo2 = toNullableDigitsText(form.mobileNo2);
  const resolvedRequestBy = toNullableText(form.requestBy);
  const resolvedCountryCode1 = normalizedMobileNo1
    ? toNullableText(form.country1) || '1'
    : null;
  const resolvedCountryCode2 = normalizedMobileNo2
    ? toNullableText(form.country2) || resolvedCountryCode1
    : null;
  const resolvedCategoryName =
    toNullableText(form.callCategoryName) || selectedCategoryOption?.label || null;
  const resolvedAssignedEmpId =
    form.callCategoryId === '27' ? toNumberValue(form.selectSadhakId) : 0;
  const resolvedCurrentLoginUserId = empNum;
  const resolvedCreatorUserId = toNumberValue(form.creatorUserId) || empNum;
  const resolvedTargetDate = form.date || currentLocalDate;
  const resolvedCompletionValue = completed ? '1' : '0';
  const resolvedCompletionDate = completed ? currentLocalDate : null;
  const resolvedCompletionUserId = completed
    ? String(resolvedCurrentLoginUserId)
    : null;
  const resolvedCompletionReply = toNullableText(form.completionReply);
  const resolvedInformationCode =
    operation === 'ADD' ? 0 : Number(informationCodeParam || 0) || 0;
  const currentLocalTimeWithSeconds = getCurrentLocalTimeWithSeconds();

  return {
    path: operation === 'EDIT' ? masterApiPaths.updateCit : masterApiPaths.createCit,
    payload: {
      iCall_Information_Traits_ID: resolvedInformationCode,
      iCall_Category_ID: toNumberValue(form.callCategoryId),
      Call_Id: 0,
      Call_Date: currentLocalDate,
      sInformation_Trait: toNullableText(form.details),
      Dept_Id: deptId,
      iCallReply: resolvedCompletionReply,
      Complete: resolvedCompletionValue,
      USER_ID: resolvedCurrentLoginUserId,
      Rec: null,
      Rec_Comp: resolvedCompletionValue,
      Rec_User_ID: null,
      Disp: null,
      Disp_Comp: resolvedCompletionValue,
      Disp_User_ID: null,
      Call: null,
      Call_Comp: resolvedCompletionValue,
      Call_User_Id: String(resolvedCreatorUserId),
      Mno1: normalizedMobileNo1,
      Mno2: normalizedMobileNo2,
      Call_Back_Date: form.callBackDate || null,
      Comp_Date: resolvedCompletionDate,
      NgCode: resolvedNgCode,
      Comp_User_Id: resolvedCompletionUserId,
      Scan_Files: null,
      File_Name: null,
      Rec_Date: null,
      Disp_Date: null,
      Dispatch_Id: null,
      Data_Flag: dataFlag,
      FY_ID: fyId,
      crtObjectId: null,
      Call_Date_Time: toDateTimeValue(currentLocalDate, currentLocalTime),
      Call_Back_Date_Time: toDateTimeValue(form.callBackDate, form.callBackTime),
      Emp_Id: resolvedAssignedEmpId,
      EMail_Id: null,
      FROM_WEB: 'Y',
      Isd1: null,
      Isd2: null,
      Call_SubCat_ID: form.selectTypeId.length
        ? form.selectTypeId.join(',')
        : null,
      Call_SubCat_Name: toNullableText(form.selectType),
      Rec_Id: 0,
      Rec_Head: null,
      sInformation_TraitId: null,
      NAME: resolvedRequestBy,
      Request_by: resolvedRequestBy,
      Country_code1: resolvedCountryCode1,
      Country_Code2: resolvedCountryCode2,
      Category: resolvedCategoryName,
      Target_Date: resolvedTargetDate,
      citFollowup: followUps
        .map(item => ({
          CIT_Id: item.citId || resolvedInformationCode,
          Followup_UserId: item.userId || resolvedCurrentLoginUserId,
          Followup_Remark: item.note.trim(),
          Followup_Date: item.followupDate || `${currentLocalDate}T00:00:00`,
          Followup_Time: item.followupTime || currentLocalTimeWithSeconds,
          Data_Flag: item.dataFlag || dataFlag,
        }))
        .filter(item => item.Followup_Remark),
    },
  };
};

export const extractCitCallCategoryOptions = (
  payload: unknown,
): CitCallCategoryOption[] => {
  const records = extractArrayPayload(payload) as CitCallCategoryRecord[];

  const options = records
    .map(record => ({
      value: getFirstValue(record, ['iCall_Category_ID', 'ICall_Category_ID']),
      label: getFirstValue(record, ['sCategory', 'Category']).trim(),
      deptIds: parseDelimitedIds(
        getFirstValue(record, ['Dept_id', 'Dept_Id', 'dept_Id']),
      ),
      employeeIds: parseDelimitedIds(
        getFirstValue(record, ['Emp_id', 'Emp_Id', 'emp_Id']),
      ),
      completionEmployeeIds: parseDelimitedIds(
        getFirstValue(record, ['Complete_by_EmpIds']),
      ),
    }))
    .filter(
      (option, index, currentOptions) =>
        option.label !== '' &&
        option.label.toLowerCase() !== 'select' &&
        option.label.toLowerCase() !== '-select-' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );

  return [
    {
      value: '',
      label: 'Select',
      deptIds: [],
      employeeIds: [],
      completionEmployeeIds: [],
    },
    ...options,
  ];
};

export const extractCitCallSubCategoryOptions = (
  payload: unknown,
): FloatingSelectOption[] => {
  const records = extractArrayPayload(payload) as CitCallSubCategoryRecord[];

  const options = records
    .map(record => ({
      value: getFirstValue(record, ['Sub_Cat_Id', 'sub_Cat_Id', 'Call_SubCat_ID']),
      label: getFirstValue(record, ['Sub_Cat_Name', 'sub_Cat_Name', 'Call_SubCat_Name']).trim(),
    }))
    .filter(
      (option, index, currentOptions) =>
        option.label !== '' &&
        option.label.toLowerCase() !== 'select' &&
        option.label.toLowerCase() !== '-select-' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );

  return [{ value: '', label: 'Select' }, ...options];
};

export const extractCitEmployeeOptions = (
  payload: unknown,
): FloatingSelectOption[] => {
  const records = extractArrayPayload(payload) as CitEmployeeRecord[];

  const options = records
    .map(record => {
      const employeeNumber = getFirstValue(record, [
        'emp_num',
        'Emp_Num',
        'EMP_NUM',
        'empNum',
        'EmpNum',
      ]);

      return {
        value: employeeNumber,
        label: getFirstValue(record, [
          'emp_name',
          'Emp_Name',
          'EMP_NAME',
          'employee_name',
          'EmployeeName',
          'Name',
        ]).trim(),
      };
    })
    .filter(
      (option, index, currentOptions) =>
        option.value !== '' &&
        option.label !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );

  return [{ value: '', label: 'Select' }, ...options];
};
