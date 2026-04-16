import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  extractArrayPayload,
  getFirstValue,
  normalizeApiDate,
} from '../AnnounceMaster/AnnounceMasterContent.helpers';
import {
  CallCenterTicketForm,
  CallCenterTicketValidationErrors,
} from './components/CallCenterTicketTab';
import { TicketFollowUpItem } from './components/TicketFollowUpTab';

export type CitOperation = 'ADD' | 'EDIT' | 'VIEW';
export type CitApiRecord = Record<string, unknown>;

export interface CitCacheRecord {
  informationCode: string;
  completed: boolean;
  ticketForm: CallCenterTicketForm;
  followUps: TicketFollowUpItem[];
  createdAt: string;
  updatedAt: string;
}

type StoredUser = Partial<IUser> & {
  deptId?: number | string;
  dept_Id?: number | string;
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

export const createInitialTicketForm = (): CallCenterTicketForm => ({
  ticketId: 'AUTO/VIEW',
  date: getToday(),
  ngCode: '',
  callCategoryName: '',
  selectType: '',
  requestBy: '',
  country1: 'India',
  mobileNo1: '',
  country2: '',
  mobileNo2: '',
  callBackDate: '',
  callBackTime: '',
  pincode: '',
  state: '',
  district: '',
  details: '',
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

export const getCurrentUserMeta = () => {
  const currentUser = readCurrentUser();

  return {
    empNum: Number(currentUser.empNum || 0) || 0,
    deptId: Number(currentUser.deptId || currentUser.dept_Id || 228) || 228,
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

export const toNumberValue = (value: string) => {
  const normalizedValue = value.replace(/[^\d]/g, '');
  return normalizedValue ? Number(normalizedValue) : 0;
};

export const toDateTimeValue = (date: string, time: string) =>
  date ? `${date} ${time || '00:00'}` : null;

export const validateCitForm = (
  form: CallCenterTicketForm,
): CallCenterTicketValidationErrors => {
  const nextErrors: CallCenterTicketValidationErrors = {};

  if (!form.callCategoryName.trim()) {
    nextErrors.callCategoryName = 'Call Category Name is required.';
  }
  if (!form.selectType.trim()) {
    nextErrors.selectType = 'Select Types is required.';
  }
  if (!form.requestBy.trim()) {
    nextErrors.requestBy = 'Request By is required.';
  }
  if (!form.callBackDate.trim()) {
    nextErrors.callBackDate = 'Call Back Date is required.';
  }
  if (!form.details.trim()) {
    nextErrors.details = 'Details is required.';
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

export const mapCitRecordToCache = (record: CitApiRecord): CitCacheRecord => ({
  informationCode: getFirstValue(record, CIT_ID_KEYS),
  completed: ['y', 'yes', 'true', '1'].includes(
    getFirstValue(record, ['complete', 'Complete']).trim().toLowerCase(),
  ),
  ticketForm: {
    ...createInitialTicketForm(),
    ticketId: getFirstValue(record, CIT_ID_KEYS),
    date: normalizeApiDate(getFirstValue(record, ['call_Date', 'CallDate'])),
    ngCode: getFirstValue(record, ['ngCode', 'NGCode']),
    callCategoryName: getFirstValue(record, ['category', 'Category']),
    selectType: getFirstValue(record, [
      'sInformation_Trait',
      'InformationTrait',
      'call_SubCat_Name',
    ]),
    requestBy: getFirstValue(record, ['request_by', 'RequestBy']),
    country1:
      getFirstValue(record, ['country_code1', 'CountryCode1']) || 'India',
    mobileNo1: getFirstValue(record, ['mno1', 'MNo1']),
    country2: getFirstValue(record, ['country_Code2', 'CountryCode2']),
    mobileNo2: getFirstValue(record, ['mno2', 'MNo2']),
    callBackDate: normalizeApiDate(
      getFirstValue(record, ['call_Back_Date', 'CallBackDate']),
    ),
    callBackTime: '',
    pincode: '',
    state: '',
    district: '',
    details: getFirstValue(record, ['icallReply', 'ICallReply']),
  },
  followUps: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const buildCitSavePayload = ({
  form,
  followUps,
  completed,
  operation,
  informationCodeParam,
}: {
  form: CallCenterTicketForm;
  followUps: TicketFollowUpItem[];
  completed: boolean;
  operation: CitOperation;
  informationCodeParam: string;
}) => {
  const { empNum, deptId, fyId, dataFlag } = getCurrentUserMeta();

  return {
    path: masterApiPaths.createCit,
    payload: {
      iCall_Information_Traits_ID:
        operation === 'ADD' ? 0 : Number(informationCodeParam || 0) || 0,
      iCall_Category_ID: 0,
      call_Id: Number(informationCodeParam || 0) || 0,
      call_Date: form.date || null,
      sInformation_Trait: toNullableText(form.selectType),
      dept_Id: deptId,
      icallReply: toNullableText(form.details) || 'test',
      complete: completed ? 'Y' : null,
      useR_ID: empNum,
      rec: null,
      rec_Comp: null,
      rec_User_ID: null,
      disp: null,
      disp_Comp: null,
      disp_User_ID: null,
      call: null,
      call_Comp: null,
      call_User_Id: empNum,
      mno1: toNullableText(form.mobileNo1),
      mno2: toNullableText(form.mobileNo2),
      call_Back_Date: form.callBackDate || null,
      comp_Date: null,
      ngCode: toNumberValue(form.ngCode),
      comp_User_Id: null,
      scan_Files: null,
      file_Name: null,
      rec_Date: null,
      disp_Date: null,
      dispatch_Id: null,
      data_Flag: dataFlag,
      fY_ID: fyId,
      crtObjectId: null,
      call_Date_Time: toDateTimeValue(form.date, ''),
      call_Back_Date_Time: toDateTimeValue(form.callBackDate, form.callBackTime),
      target_Date: null,
      emp_Id: empNum,
      eMail_Id: null,
      name: null,
      froM_WEB: 'Y',
      request_by: toNullableText(form.requestBy),
      isd1: null,
      isd2: null,
      country_code1: toNullableText(form.country1),
      country_Code2: toNullableText(form.country2),
      call_SubCat_ID: null,
      call_SubCat_Name: null,
      rec_Id: 0,
      rec_Head:
        toNullableText(form.requestBy) || toNullableText(form.callCategoryName),
      sInformation_TraitId: null,
      category: toNullableText(form.callCategoryName),
      citFollowup: followUps
        .map(item => ({
          Followup_Remark: item.note.trim(),
        }))
        .filter(item => item.Followup_Remark),
    },
  };
};
