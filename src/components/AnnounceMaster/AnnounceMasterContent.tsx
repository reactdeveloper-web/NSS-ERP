import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { ContentTypes } from 'src/constants/content';
import axiosInstance from 'src/redux/interceptor';
import { AnnounceMasterNav } from './AnnounceMasterNav';
import {
  createInitialAnnounceDetailsForm,
  createInitialAnnounceEventForm,
  createInitialDonorIdentificationForm,
  createInitialFollowUpForm,
  createInitialPersonalInfoForm,
} from './data';
import { AnnounceEventCard } from './components/AnnounceEventCard';
import { AnnouncerPersonalDetailsCard } from './components/AnnouncerPersonalDetailsCard';
import { DonorIdentificationCard } from './components/DonorIdentificationCard';
import {
  AnnouncerTabKey,
  AnnounceDetailsForm,
  AnnounceEventForm,
  DepositBank,
  DonorIdentificationForm,
  DonorSearchResult,
  EventOption,
  FollowUpForm,
  FollowUpItem,
  PersonalInfoForm,
  SalutationOption,
} from './types';

const getToday = () => new Date().toISOString().split('T')[0];

const donorSearchTypeCandidates: Record<string, string[]> = {
  donorId: ['NGCode', 'donorId', 'DonorId'],
  mobile: ['mobile', 'DMobile'],
  email: ['email', 'DEmail'],
  pan: ['pan', 'PAN_Number', 'panNo'],
  aadhaar: ['aadhaar', 'aadhar', 'AadharNo'],
};

const getFirstValue = (
  record: Record<string, unknown>,
  keys: string[],
): string => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }

  return '';
};

const getMappedValue = (
  record: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];
      return value === undefined || value === null ? '' : String(value).trim();
    }
  }

  return undefined;
};

const createDirectApiHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    APIKey: 'NSSAPI4SANSTHANUAT',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('accessToken');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const normalizeStateValue = (value: string): string => {
  const normalizedValue = value.trim().toLowerCase();
  const stateMap: Record<string, string> = {
    rajasthan: 'Rajasthan',
    delhi: 'Delhi',
    gujarat: 'Gujarat',
  };

  return stateMap[normalizedValue] ?? value.trim();
};

const extractDonorRecord = (
  payload: unknown,
): Record<string, unknown> | null => {
  if (Array.isArray(payload)) {
    const [first] = payload;
    return first && typeof first === 'object'
      ? (first as Record<string, unknown>)
      : null;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const nestedKeys = [
    'data',
    'Data',
    'result',
    'Result',
    'donorData',
    'DonorData',
  ];

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    if (Array.isArray(nestedValue)) {
      const [first] = nestedValue;
      if (first && typeof first === 'object') {
        return first as Record<string, unknown>;
      }
    }

    if (nestedValue && typeof nestedValue === 'object') {
      return nestedValue as Record<string, unknown>;
    }
  }

  return record;
};

const extractDonorRecords = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object',
    );
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const nestedKeys = [
    'data',
    'Data',
    'result',
    'Result',
    'donorData',
    'DonorData',
  ];

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    if (Array.isArray(nestedValue)) {
      return nestedValue.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object',
      );
    }
  }

  return extractDonorRecord(payload) ? [extractDonorRecord(payload)!] : [];
};

const mapDonorToPersonalInfo = (
  donorRecord: Record<string, unknown>,
): Partial<PersonalInfoForm> => {
  const rawState = getMappedValue(donorRecord, ['StateName', 'State']);
  const state =
    rawState === undefined ? undefined : normalizeStateValue(rawState);
  const donorSalutation = getMappedValue(donorRecord, [
    'DShri',
    'Salutation',
    'SalutationName',
    'Title',
    'TitleName',
    'Prefix',
  ]);

  return {
    salutation: donorSalutation,
    salutationLocked:
      donorSalutation === undefined ? undefined : donorSalutation.trim() !== '',
    mobileNo: getMappedValue(donorRecord, [
      'DMobile',
      'MobileNo',
      'Mobile',
      'mobile',
    ]),
    whatsappNo: getMappedValue(donorRecord, [
      'WhatsappNo',
      'WhatsAppNo',
      'WMobile',
      'AltMobile',
      'DMobile',
    ]),
    announcerName: getMappedValue(donorRecord, [
      'DonorName',
      'DName',
      'Name',
      'AnnouncerName',
    ]),
    pincode: getMappedValue(donorRecord, ['PinCode', 'Pincode', 'ZipCode']),
    country: getMappedValue(donorRecord, ['CountryName', 'Country']),
    state,
    stateLocked: state === undefined ? undefined : state !== '',
    district: getMappedValue(donorRecord, [
      'DistrictName',
      'District',
      'CityName',
    ]),
  };
};

const mapDonorSearchResult = (
  donorRecord: Record<string, unknown>,
): DonorSearchResult => ({
  donorId: getFirstValue(donorRecord, ['NGCode', 'DonorID', 'DonorId']),
  donorName: getFirstValue(donorRecord, ['DonorName', 'DName', 'Name']),
  mobileNo: getFirstValue(donorRecord, [
    'DMobile',
    'MobileNo',
    'Mobile',
    'mobile',
  ]),
  email: getFirstValue(donorRecord, ['DEmail', 'Email', 'email']),
  record: donorRecord,
});

const extractArrayPayload = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object',
    );
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const nestedKeys = [
    'data',
    'Data',
    'result',
    'Result',
    'banks',
    'Banks',
    'table',
    'Table',
    'table1',
    'Table1',
    'list',
    'List',
    'items',
    'Items',
    'rows',
    'Rows',
  ];

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    if (Array.isArray(nestedValue)) {
      return nestedValue.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object',
      );
    }
  }

  for (const value of Object.values(record)) {
    if (Array.isArray(value)) {
      const objectItems = value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object',
      );

      if (objectItems.length > 0) {
        return objectItems;
      }
    }

    if (value && typeof value === 'object') {
      const nestedRecords = extractArrayPayload(value);

      if (nestedRecords.length > 0) {
        return nestedRecords;
      }
    }
  }

  return [];
};

const collectObjectArrayCandidates = (
  payload: unknown,
): Record<string, unknown>[][] => {
  if (Array.isArray(payload)) {
    const objectItems = payload.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object',
    );

    return objectItems.length > 0 ? [objectItems] : [];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  return Object.values(payload as Record<string, unknown>).flatMap(value =>
    collectObjectArrayCandidates(value),
  );
};

const extractSalutationOptions = (payload: unknown): SalutationOption[] => {
  const salutationRecords = extractArrayPayload(payload);

  return salutationRecords
    .map(record => ({
      value: getFirstValue(record, [
        'SAL_CODE',
        'SalutationCode',
        'Code',
        'Id',
        'ID',
      ]),
      label: getFirstValue(record, [
        'SAL_NAME',
        'Salutation',
        'SalutationName',
        'Title',
        'TitleName',
        'Prefix',
        'Name',
        'Text',
      ]),
    }))
    .filter((option, index, currentOptions) => {
      const normalizedValue = option.value.trim();
      const normalizedLabel = option.label.trim();
      return (
        normalizedValue !== '' &&
        normalizedLabel !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index
      );
    });
};

const extractAnnounceCauseOptions = (payload: unknown): EventOption[] => {
  const causeRecords = extractArrayPayload(payload);

  return causeRecords
    .map(record => ({
      value: getFirstValue(record, [
        'VC_Code',
        'VCCode',
        'Code',
        'CAUSE_NAME',
        'CauseName',
        'EventCause',
        'CAUSE',
        'Name',
        'Text',
      ]),
      label: getFirstValue(record, [
        'CName',
        'CauseLabel',
        'CAUSE_NAME',
        'CauseName',
        'EventCause',
        'CAUSE',
        'Name',
        'Text',
      ]),
    }))
    .filter(
      (option, index, currentOptions) =>
        option.value.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );
};

const extractOccasionOptions = (payload: unknown): EventOption[] => {
  const occasionRecords = extractArrayPayload(payload);

  return occasionRecords
    .map(record => ({
      value: getFirstValue(record, [
        'OM_CODE',
        'OccasionCode',
        'Code',
        'OccasionName',
        'OM_NAME',
        'Name',
        'Text',
      ]),
      label: getFirstValue(record, [
        'OM_NAME',
        'OccasionName',
        'Name',
        'Text',
        'OM_CODE',
        'OccasionCode',
        'Code',
      ]),
    }))
    .filter(
      (option, index, currentOptions) =>
        option.value.trim() !== '' &&
        option.label.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );
};

const extractCauseHeadOptions = (payload: unknown): EventOption[] => {
  const purposeRecords = extractArrayPayload(payload);

  return purposeRecords
    .map(record => {
      const purposeId = getFirstValue(record, [
        'Purpose_id',
        'PurposeId',
        'PURPOSE_ID',
        'PurposeHeadId',
        'PURPOSEHEADID',
        'Id',
        'ID',
      ]);

      return {
        value:
          purposeId ||
          getFirstValue(record, [
            'PurposeCode',
            'PURPOSE_CODE',
            'PurposeHeadCode',
            'PURPOSEHEADCODE',
            'P_CODE',
            'PCODE',
            'Code',
            'Id',
            'ID',
            'PurposeName',
            'PURPOSE_NAME',
            'PurposeHeadName',
            'PURPOSEHEADNAME',
            'Purpose',
            'Name',
            'Text',
          ]),
        label: getFirstValue(record, [
          'PurposeName',
          'PURPOSE_NAME',
          'PurposeHeadName',
          'PURPOSEHEADNAME',
          'PName',
          'Purpose',
          'HeadName',
          'Description',
          'Name',
          'Text',
          'PurposeCode',
          'PURPOSE_CODE',
          'PurposeHeadCode',
          'PURPOSEHEADCODE',
          'P_CODE',
          'PCODE',
          'Code',
        ]),
        purposeId,
      };
    })
    .filter(
      (option, index, currentOptions) =>
        option.value.trim() !== '' &&
        option.label.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );
};

const extractYojnaOptions = (payload: unknown): EventOption[] => {
  const yojnaRecords = extractArrayPayload(payload);

  return yojnaRecords
    .map(record => {
      const amountValue = getFirstValue(record, [
        'Amount',
        'AMOUNT',
        'YojnaAmount',
        'YOJNA_AMOUNT',
        'FixedAmount',
        'FIXED_AMOUNT',
        'Rate',
        'RATE',
        'DonationAmount',
      ]);
      const yojnaName = getFirstValue(record, [
        'YojnaName',
        'YOJNA_NAME',
        'SchemeName',
        'SCHEME_NAME',
        'PlanName',
        'PLAN_NAME',
        'Yojna',
        'PurposeName',
        'Name',
        'Text',
      ]);
      const yojnaId = getFirstValue(record, [
        'YojnaId',
        'YOJNA_ID',
        'SchemeId',
        'SCHEME_ID',
        'Id',
        'ID',
      ]);

      return {
        value: amountValue || yojnaId || yojnaName,
        label:
          yojnaName && amountValue
            ? `${yojnaName} (Rs. ${Number(amountValue).toLocaleString('en-IN')})`
            : yojnaName || amountValue || yojnaId,
        amountValue,
      };
    })
    .filter(
      (option, index, currentOptions) =>
        option.value.trim() !== '' &&
        option.label.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );
};

const extractStateOptions = (payload: unknown): EventOption[] => {
  const stateKeyCandidates = [
    'State',
    'StateName',
    'State_Name',
    'STATE_NAME',
    'state_name',
    'stateName',
    'STATE',
    'state',
    'State_Code',
    'StateCode',
    'STATE_CODE',
    'state_code',
    'stateCode',
  ];
  const candidateArrays = [
    extractArrayPayload(payload),
    ...collectObjectArrayCandidates(payload),
  ].filter(candidate => candidate.length > 0);

  const stateRecords =
    candidateArrays
      .map(records => ({
        records,
        score: records.reduce((total, record) => {
          const recordKeys = Object.keys(record);
          const matchedKeys = stateKeyCandidates.filter(key =>
            recordKeys.some(recordKey => recordKey === key),
          ).length;

          return total + matchedKeys;
        }, 0),
      }))
      .sort((left, right) => right.score - left.score)[0]?.records ?? [];

  return stateRecords
    .map(record => ({
      value: getFirstValue(record, [
        'State_Name',
        'StateName',
        'STATE_NAME',
        'state_name',
        'stateName',
        'State',
        'STATE',
        'Name',
        'Text',
        'state',
      ]),
      label: getFirstValue(record, [
        'State_Name',
        'StateName',
        'STATE_NAME',
        'state_name',
        'stateName',
        'State',
        'STATE',
        'Name',
        'Text',
        'state',
      ]),
      stateCode: getFirstValue(record, [
        'State_Code',
        'StateCode',
        'STATE_CODE',
        'state_code',
        'stateCode',
        'Code',
      ]),
    }))
    .filter(
      (option, index, currentOptions) =>
        option.value.trim() !== '' &&
        option.label.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );
};

const extractDistrictOptions = (payload: unknown): EventOption[] => {
  const districtRecords = extractArrayPayload(payload);

  return districtRecords
    .map(record => ({
      value: getFirstValue(record, [
        'District_Name',
        'DistrictName',
        'DISTRICT_NAME',
        'district_name',
        'districtName',
        'District',
        'DISTRICT',
        'Name',
        'Text',
      ]),
      label: getFirstValue(record, [
        'District_Name',
        'DistrictName',
        'DISTRICT_NAME',
        'district_name',
        'districtName',
        'District',
        'DISTRICT',
        'Name',
        'Text',
      ]),
    }))
    .filter(
      (option, index, currentOptions) =>
        option.value.trim() !== '' &&
        option.label.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );
};

const extractPincodeLocation = (
  payload: unknown,
): { state: string; district: string } | null => {
  const candidates = [
    ...extractArrayPayload(payload),
    ...collectObjectArrayCandidates(payload).flat(),
    ...(payload && typeof payload === 'object'
      ? [payload as Record<string, unknown>]
      : []),
  ];

  for (const record of candidates) {
    const state = getFirstValue(record, [
      'State_Name',
      'StateName',
      'STATE_NAME',
      'state_name',
      'stateName',
      'State',
      'STATE',
      'state',
      'statename',
    ]);
    const district = getFirstValue(record, [
      'District_Name',
      'DistrictName',
      'DISTRICT_NAME',
      'district_name',
      'districtName',
      'District',
      'DISTRICT',
      'district',
      'districtname',
    ]);

    if (state || district) {
      return {
        state,
        district,
      };
    }
  }

  return null;
};

const normalizeApiDate = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  const rawValue = String(value).trim();
  if (!rawValue) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    return rawValue;
  }

  const normalizedValue = rawValue.replace(/\//g, '-');
  const ddmmyyyyMatch = normalizedValue.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${year}-${month}-${day}`;
  }

  const parsedDate = new Date(rawValue);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }

  return '';
};

const normalizeApiTime = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  const rawValue = String(value).trim();
  if (!rawValue) {
    return '';
  }

  const normalizedSeparators = rawValue.replace(/\./g, ':').toUpperCase();
  const amPmMatch = normalizedSeparators.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/,
  );
  if (amPmMatch) {
    const [, rawHours, minutes, , period] = amPmMatch;
    const parsedHours = Number(rawHours);

    if (parsedHours >= 1 && parsedHours <= 12) {
      const normalizedHours =
        period === 'AM'
          ? parsedHours % 12
          : parsedHours % 12 === 0
            ? 12
            : (parsedHours % 12) + 12;

      return `${String(normalizedHours).padStart(2, '0')}:${minutes}`;
    }
  }

  const timeMatch = rawValue.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeMatch) {
    const [, hours, minutes] = timeMatch;
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  const dotTimeMatch = rawValue.match(/^(\d{1,2})\.(\d{2})(?:\.\d{2})?$/);
  if (dotTimeMatch) {
    const [, hours, minutes] = dotTimeMatch;
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  const parsedDate = new Date(`1970-01-01T${rawValue}`);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().slice(11, 16);
  }

  return '';
};

const mapEventDetailRecord = (record: Record<string, unknown>) => ({
  id: getFirstValue(record, ['EVENT_ID', 'EventId', 'EventID', 'Id', 'ID']),
  eventName: getFirstValue(record, ['EName', 'EVENT_NAME', 'EventName', 'Name']),
  eventCause: getFirstValue(record, [
    'CAUSE_NAME',
    'EventCause',
    'CauseName',
    'CAUSE',
  ]),
  eventFromDate: normalizeApiDate(
    getFirstValue(record, ['EVENT_START_DATE', 'StartDate', 'EVENTDATEFROM']),
  ),
  eventToDate: normalizeApiDate(
    getFirstValue(record, ['EVENT_END_DATE', 'EndDate', 'EVENTDATETO']),
  ),
  eventFromTime: normalizeApiTime(
    getFirstValue(record, [
      'Frm_Time',
      'EVENT_START_TIME',
      'StartTime',
      'EVENTTIMEFROM',
    ]),
  ),
  eventToTime: normalizeApiTime(
    getFirstValue(record, [
      'To_Time',
      'EVENT_END_TIME',
      'EndTime',
      'EVENTTIMETO',
    ]),
  ),
  eventCity: getFirstValue(record, ['CITY_NAME', 'CityName', 'CITY']),
  eventChannel: getFirstValue(record, ['CHANNEL_NAME', 'ChannelName', 'CHANNEL']),
  panditJi: getFirstValue(record, ['PANDIT_NAME', 'PanditName', 'PANDITJI']),
  eventLocation: getFirstValue(record, [
    'FULL_ADDRESS',
    'FullAddress',
    'Address',
    'EVENT_ADDRESS',
  ]),
});

const createEventOptions = (
  eventRecords: ReturnType<typeof mapEventDetailRecord>[],
): EventOption[] =>
  eventRecords
    .map((record, index) => ({
      value: record.eventName,
      label: record.eventName,
      sortOrder: index,
    }))
    .filter(
      (
        option,
        index,
        currentOptions,
      ): option is EventOption & { sortOrder: number } =>
        option.value.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    )
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(({ value, label }) => ({
      value,
      label,
    }));

const createUniqueFieldOptions = (
  eventRecords: ReturnType<typeof mapEventDetailRecord>[],
  field: 'eventCity' | 'eventChannel' | 'panditJi',
): EventOption[] =>
  eventRecords
    .map(record => record[field].trim())
    .filter(
      (value, index, currentValues) =>
        value !== '' && currentValues.indexOf(value) === index,
    )
    .map(value => ({
      value,
      label: value,
    }));

const mapBankRecord = (
  bankRecord: Record<string, unknown>,
  index: number,
): DepositBank => ({
  id:
    getFirstValue(bankRecord, ['ID', 'Id', 'BankId', 'DepositBankId']) ||
    `bank-${index}`,
  bankName: getFirstValue(bankRecord, [
    'FullName',
    'BankName',
    'bankName',
    'BANKNAME',
  ]),
  accountNo: getFirstValue(bankRecord, [
    'Acc_No',
    'AccountNo',
    'AccountNumber',
    'AccNo',
    'BANKACCOUNTNO',
  ]),
  accountType: getFirstValue(bankRecord, [
    'Account_Type',
    'AccountType',
    'AcType',
    'BankAccountType',
  ]),
  ifsc: getFirstValue(bankRecord, ['IFSC', 'IFSCCode', 'IfscCode']),
  branch:
    getFirstValue(bankRecord, ['Branch', 'BranchName', 'BANKBRANCH']) ||
    'Udaipur',
});

export const AnnounceMasterContent = () => {
  const [
    donorIdentificationForm,
    setDonorIdentificationForm,
  ] = useState<DonorIdentificationForm>(() =>
    createInitialDonorIdentificationForm(getToday()),
  );
  const [announceEventForm, setAnnounceEventForm] = useState<AnnounceEventForm>(
    createInitialAnnounceEventForm,
  );
  const [personalInfoForm, setPersonalInfoForm] = useState<PersonalInfoForm>(
    createInitialPersonalInfoForm,
  );
  const [
    announceDetailsForm,
    setAnnounceDetailsForm,
  ] = useState<AnnounceDetailsForm>(createInitialAnnounceDetailsForm);
  const [followUpForm, setFollowUpForm] = useState<FollowUpForm>(
    createInitialFollowUpForm,
  );
  const [followUpItems, setFollowUpItems] = useState<FollowUpItem[]>([]);
  const [salutations, setSalutations] = useState<SalutationOption[]>([]);
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventDetails, setEventDetails] = useState<
    ReturnType<typeof mapEventDetailRecord>[]
  >([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState('');
  const [eventCauseOptions, setEventCauseOptions] = useState<EventOption[]>([]);
  const [occasionTypeOptions, setOccasionTypeOptions] = useState<EventOption[]>(
    [],
  );
  const [stateOptions, setStateOptions] = useState<EventOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<EventOption[]>([]);
  const [causeHeadOptions, setCauseHeadOptions] = useState<EventOption[]>([]);
  const [purposeOptions, setPurposeOptions] = useState<EventOption[]>([]);
  const [eventCityOptions, setEventCityOptions] = useState<EventOption[]>([]);
  const [eventChannelOptions, setEventChannelOptions] = useState<EventOption[]>(
    [],
  );
  const [panditOptions, setPanditOptions] = useState<EventOption[]>([]);
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
  const [banks, setBanks] = useState<DepositBank[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState('');
  const [activeTab, setActiveTab] = useState<AnnouncerTabKey>('personal');
  const [isSearchingDonor, setIsSearchingDonor] = useState(false);
  const [donorSearchError, setDonorSearchError] = useState('');
  const [donorOptions, setDonorOptions] = useState<DonorSearchResult[]>([]);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [isPincodeLocationLocked, setIsPincodeLocationLocked] = useState(false);
  const lastDonorSearchKeyRef = useRef('');
  const donorSearchRequestIdRef = useRef(0);
  const pincodeRequestIdRef = useRef(0);

  const amount = useMemo(() => {
    const purposeAmount = Number(announceDetailsForm.purpose || 0);

    return purposeAmount * announceDetailsForm.quantity;
  }, [announceDetailsForm.purpose, announceDetailsForm.quantity]);

  const handleDonorIdentificationChange = <
    K extends keyof DonorIdentificationForm
  >(
    field: K,
    value: DonorIdentificationForm[K],
  ) => {
    if (field === 'donorSearchType' || field === 'donorId') {
      setDonorSearchError('');
    }

    setDonorIdentificationForm(current => ({ ...current, [field]: value }));
  };

  const handleAnnounceEventChange = <K extends keyof AnnounceEventForm>(
    field: K,
    value: AnnounceEventForm[K],
  ) => {
    setAnnounceEventForm(current => ({ ...current, [field]: value }));
  };

  const handlePersonalInfoChange = <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => {
    if (field === 'pincode') {
      const normalizedPincode = String(value).replace(/\D/g, '').slice(0, 6);

      setPersonalInfoForm(current => ({
        ...current,
        pincode: normalizedPincode,
      }));
      return;
    }

    setPersonalInfoForm(current => ({ ...current, [field]: value }));
  };

  const handleAnnounceDetailsChange = <K extends keyof AnnounceDetailsForm>(
    field: K,
    value: AnnounceDetailsForm[K],
  ) => {
    setAnnounceDetailsForm(current => ({ ...current, [field]: value }));
  };

  const handleFollowUpChange = <K extends keyof FollowUpForm>(
    field: K,
    value: FollowUpForm[K],
  ) => {
    setFollowUpForm(current => ({ ...current, [field]: value }));
  };

  const handleQuantityChange = (nextQuantity: number) => {
    setAnnounceDetailsForm(current => ({
      ...current,
      quantity: Math.max(1, Number.isFinite(nextQuantity) ? nextQuantity : 1),
    }));
  };

  const handleToggleBank = (bankId: string) => {
    setSelectedBankIds(current =>
      current.includes(bankId)
        ? current.filter(id => id !== bankId)
        : [...current, bankId],
    );
  };

  const handleAddFollowUp = () => {
    if (!followUpForm.date && !followUpForm.note && !followUpForm.assignTo) {
      return;
    }

    setFollowUpItems(current => [
      ...current,
      {
        id: Date.now(),
        ...followUpForm,
      },
    ]);
    setFollowUpForm(createInitialFollowUpForm());
  };

  const handleRemoveFollowUp = (id: number) => {
    setFollowUpItems(current => current.filter(item => item.id !== id));
  };

  const applyDonorRecord = (
    donorRecord: Record<string, unknown>,
    fallbackSearchData: string,
    nextSearchType?: DonorIdentificationForm['donorSearchType'],
  ) => {
    const resolvedDonorId =
      getFirstValue(donorRecord, ['NGCode', 'DonorID', 'DonorId']) ||
      fallbackSearchData;
    const resolvedSearchType =
      nextSearchType ?? donorIdentificationForm.donorSearchType;

    setDonorSearchError('');
    lastDonorSearchKeyRef.current = `${resolvedSearchType}:${resolvedDonorId}`;
    setDonorIdentificationForm(current => ({
      ...current,
      donorSearchType: resolvedSearchType,
      donorId: resolvedDonorId,
    }));

    const donorPersonalInfo = mapDonorToPersonalInfo(donorRecord);

    setPersonalInfoForm(current => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(donorPersonalInfo).filter(
          ([, value]) => value !== undefined,
        ),
      ),
    }));
    setActiveTab('personal');
  };

  const resetPersonalInfo = () => {
    setPersonalInfoForm(createInitialPersonalInfoForm());
  };

  const handleSelectDonor = (donor: DonorSearchResult) => {
    applyDonorRecord(
      donor.record,
      donorIdentificationForm.donorId.trim(),
      'donorId',
    );
    setShowDonorModal(false);
    setDonorOptions([]);
  };

  const handleCloseDonorModal = () => {
    setShowDonorModal(false);
  };

  const resetEventSelectionFields = (
    liveType: AnnounceEventForm['liveType'],
    eventName = '',
  ) => {
    setAnnounceEventForm(current => ({
      ...current,
      liveType,
      eventName,
      eventCause: '',
      eventFromDate: '',
      eventToDate: '',
      eventFromTime: '',
      eventToTime: '',
      eventCity: '',
      eventChannel: '',
      panditJi: '',
      eventLocation: '',
      currency: current.currency || 'INR',
    }));
  };

  const handleSearchDonor = async () => {
    const searchData = donorIdentificationForm.donorId.trim();
    const requestId = donorSearchRequestIdRef.current + 1;
    donorSearchRequestIdRef.current = requestId;

    if (!searchData) {
      setDonorSearchError('Please enter a value to search.');
      resetPersonalInfo();
      return;
    }

    setIsSearchingDonor(true);
    setDonorSearchError('');

    try {
      const searchTypeOptions =
        donorSearchTypeCandidates[donorIdentificationForm.donorSearchType] ??
        donorSearchTypeCandidates.donorId;
      let response = null;
      let lastError: unknown = null;

      for (const searchType of searchTypeOptions) {
        try {
          response = await axiosInstance.get(
            '/master/searchDonorData',
            {
              params: {
                searchType,
                searchData,
                dataFlag: ContentTypes.DataFlag,
              },
              headers: createDirectApiHeaders(),
            },
          );
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!response) {
        throw lastError;
      }

      const donorRecords = extractDonorRecords(response.data);
      const uniqueDonorOptions = donorRecords
        .map(mapDonorSearchResult)
        .filter(
          (donor, index, currentDonors) =>
            donor.donorId &&
            currentDonors.findIndex(item => item.donorId === donor.donorId) ===
              index,
        );

      if (requestId !== donorSearchRequestIdRef.current) {
        return;
      }

      if (donorRecords.length === 0) {
        setDonorSearchError('No donor data found.');
        setDonorOptions([]);
        setShowDonorModal(false);
        resetPersonalInfo();
        return;
      }

      if (
        donorIdentificationForm.donorSearchType === 'mobile' &&
        uniqueDonorOptions.length > 1
      ) {
        setDonorOptions(uniqueDonorOptions);
        setShowDonorModal(true);
        return;
      }

      setDonorOptions([]);
      setShowDonorModal(false);
      applyDonorRecord(donorRecords[0], searchData);
    } catch (error: any) {
      if (requestId !== donorSearchRequestIdRef.current) {
        return;
      }

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.message ||
        'Failed to search donor data.';
      setDonorSearchError(message);
      resetPersonalInfo();
    } finally {
      if (requestId === donorSearchRequestIdRef.current) {
        setIsSearchingDonor(false);
      }
    }
  };

  useEffect(() => {
    const searchData = donorIdentificationForm.donorId.trim();

    if (!searchData) {
      lastDonorSearchKeyRef.current = '';
      donorSearchRequestIdRef.current += 1;
      setIsSearchingDonor(false);
      setDonorSearchError('');
      setDonorOptions([]);
      setShowDonorModal(false);
      resetPersonalInfo();
      return;
    }

    const searchKey = `${donorIdentificationForm.donorSearchType}:${searchData}`;
    if (lastDonorSearchKeyRef.current === searchKey) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      lastDonorSearchKeyRef.current = searchKey;
      void handleSearchDonor();
    }, 600);

    return () => {
      window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    donorIdentificationForm.donorId,
    donorIdentificationForm.donorSearchType,
  ]);

  useEffect(() => {
    const loadEventCauses = async () => {
      try {
        const response = await axiosInstance.get('master/GetAnnounceCauses', {
          params: {
            DataFlag: ContentTypes.DataFlag,
            Operation: 'EDIT',
          },
        });

        setEventCauseOptions(extractAnnounceCauseOptions(response.data));
      } catch (error) {
        setEventCauseOptions([]);
      }
    };

    void loadEventCauses();
  }, []);

  useEffect(() => {
    const loadEventDetails = async () => {
      setEventLoading(true);
      setEventError('');

      try {
        const response = await axiosInstance.get('/master/getEventDetails', {
          params: {
            dataflag: ContentTypes.DataFlag,
            IsLive: announceEventForm.liveType === 'live' ? 'Y' : 'N',
            Operation: 'EDIT',
          },
        });

        const records = extractArrayPayload(response.data).map(
          mapEventDetailRecord,
        );

        setEventDetails(records);
        setEventOptions(createEventOptions(records));
        setEventCityOptions(createUniqueFieldOptions(records, 'eventCity'));
        setEventChannelOptions(
          createUniqueFieldOptions(records, 'eventChannel'),
        );
        setPanditOptions(createUniqueFieldOptions(records, 'panditJi'));

        const matchedRecord = records.find(
          record => record.eventName === announceEventForm.eventName,
        );

        if (!matchedRecord) {
          resetEventSelectionFields(announceEventForm.liveType);
        }
      } catch (error: any) {
        setEventDetails([]);
        setEventOptions([]);
        setEventCityOptions([]);
        setEventChannelOptions([]);
        setPanditOptions([]);
        resetEventSelectionFields(announceEventForm.liveType);
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.Message ||
          error?.message ||
          'Failed to load event list.';
        setEventError(message);
      } finally {
        setEventLoading(false);
      }
    };

    void loadEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announceEventForm.liveType]);

  useEffect(() => {
    if (!announceEventForm.eventName) {
      resetEventSelectionFields(announceEventForm.liveType);
      return;
    }

    const selectedEvent = eventDetails.find(
      record => record.eventName === announceEventForm.eventName,
    );

    if (!selectedEvent) {
      return;
    }

    setAnnounceEventForm(current => ({
      ...current,
      liveType: announceEventForm.liveType,
      eventName: selectedEvent.eventName,
      eventCause: selectedEvent.eventCause || current.eventCause,
      eventFromDate: selectedEvent.eventFromDate,
      eventToDate: selectedEvent.eventToDate,
      eventFromTime: selectedEvent.eventFromTime,
      eventToTime: selectedEvent.eventToTime,
      eventCity: selectedEvent.eventCity,
      eventChannel: selectedEvent.eventChannel,
      panditJi: selectedEvent.panditJi,
      eventLocation: selectedEvent.eventLocation,
      currency: current.currency || 'INR',
    }));
  }, [announceEventForm.eventName, announceEventForm.liveType, eventDetails]);

  useEffect(() => {
    const loadOccasionTypes = async () => {
      try {
        const response = await axiosInstance.get(
          '/master/GetOccasionMaster',
          {
            params: {
              DataFlag: ContentTypes.DataFlag,
            },
            headers: createDirectApiHeaders(),
          },
        );

        setOccasionTypeOptions(extractOccasionOptions(response.data));
      } catch (error) {
        setOccasionTypeOptions([]);
      }
    };

    void loadOccasionTypes();
  }, []);

  useEffect(() => {
    const loadStateOptions = async () => {
      try {
        const response = await axiosInstance.get('/master/GetStatesByCountry', {
          params: {
            countryCode: 22,
            DataFlag: ContentTypes.DataFlag,
          },
          headers: createDirectApiHeaders(),
        });

        setStateOptions(extractStateOptions(response.data));
      } catch (error) {
        setStateOptions([]);
      }
    };

    void loadStateOptions();
  }, []);

  useEffect(() => {
    const selectedState = stateOptions.find(
      option => option.value === personalInfoForm.state,
    );
    const stateCode = selectedState?.stateCode?.trim();

    if (!stateCode) {
      setDistrictOptions([]);
      return;
    }

    const loadDistrictOptions = async () => {
      try {
        const response = await axiosInstance.get('/master/GetDistrictByState', {
          params: {
            stateCode,
            DataFlag: ContentTypes.DataFlag,
          },
          headers: createDirectApiHeaders(),
        });

        setDistrictOptions(extractDistrictOptions(response.data));
      } catch (error) {
        setDistrictOptions([]);
      }
    };

    void loadDistrictOptions();
  }, [personalInfoForm.state, stateOptions]);

  useEffect(() => {
    const normalizedPincode = personalInfoForm.pincode.replace(/\D/g, '');

    if (!/^\d{6}$/.test(normalizedPincode)) {
      pincodeRequestIdRef.current += 1;
      setIsPincodeLocationLocked(false);
      return;
    }

    const requestId = pincodeRequestIdRef.current + 1;
    pincodeRequestIdRef.current = requestId;

    const timeoutId = window.setTimeout(() => {
      const loadLocationByPincode = async () => {
        try {
          const response = await axiosInstance.get(
            '/master/GetStateAndDistrictByPinCode',
            {
              params: {
                countryCode: 22,
                dataFlag: ContentTypes.DataFlag,
                pincode: normalizedPincode,
              },
              headers: createDirectApiHeaders(),
            },
          );

          if (requestId !== pincodeRequestIdRef.current) {
            return;
          }

          const location = extractPincodeLocation(response.data);

          if (!location) {
            setIsPincodeLocationLocked(false);
            return;
          }

          setPersonalInfoForm(current => ({
            ...current,
            state: location.state || current.state,
            district: location.district || current.district,
          }));
          setIsPincodeLocationLocked(
            Boolean(location.state.trim() || location.district.trim()),
          );
        } catch (error) {
          if (requestId !== pincodeRequestIdRef.current) {
            return;
          }

          setIsPincodeLocationLocked(false);
        }
      };

      void loadLocationByPincode();
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [personalInfoForm.pincode]);

  useEffect(() => {
    const loadCauseHeadOptions = async () => {
      try {
        const response = await axiosInstance.get(
          '/master/GetPurposeByDataFlag',
          {
            params: {
              DataFlag: ContentTypes.DataFlag,
            },
            headers: createDirectApiHeaders(),
          },
        );

        setCauseHeadOptions(extractCauseHeadOptions(response.data));
      } catch (error) {
        setCauseHeadOptions([]);
      }
    };

    void loadCauseHeadOptions();
  }, []);

  useEffect(() => {
    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === announceDetailsForm.causeHead,
    );
    const purposeId =
      selectedCauseHead?.purposeId || announceDetailsForm.causeHead.trim();

    if (!purposeId) {
      setPurposeOptions([]);
      setAnnounceDetailsForm(current =>
        current.purpose ? { ...current, purpose: '' } : current,
      );
      return;
    }

    const loadPurposeOptions = async () => {
      try {
        const response = await axiosInstance.get(
          '/master/GetYojnaByPurposeAndCurrency',
          {
            params: {
              DataFlag: ContentTypes.DataFlag,
              CurrencyId: 4,
              PurposeId: purposeId,
            },
            headers: createDirectApiHeaders(),
          },
        );

        const nextPurposeOptions = extractYojnaOptions(response.data);
        setPurposeOptions(nextPurposeOptions);
        setAnnounceDetailsForm(current => {
          if (
            !current.purpose ||
            nextPurposeOptions.some(option => option.value === current.purpose)
          ) {
            return current;
          }

          return {
            ...current,
            purpose: '',
          };
        });
      } catch (error) {
        setPurposeOptions([]);
        setAnnounceDetailsForm(current =>
          current.purpose ? { ...current, purpose: '' } : current,
        );
      }
    };

    void loadPurposeOptions();
  }, [announceDetailsForm.causeHead, causeHeadOptions]);

  useEffect(() => {
    const loadSalutations = async () => {
      const requestConfigs = [
        {
          url: 'master/GetSalutations',
          params: {
            Data_Flag: ContentTypes.DataFlag,
          },
        },
        {
          url: 'master/GetSalutations',
          params: {
            dataflag: ContentTypes.DataFlag,
          },
        },
        {
          url: 'master/GetSalutations',
          params: {
            Data_Flag: ContentTypes.DataFlag,
          },
        },
        {
          url: 'master/GetSalutations',
          params: {
            dataflag: ContentTypes.DataFlag,
          },
        },
        {
          url: 'master/GetSalutations',
          params: {
            Data_Flag: ContentTypes.DataFlag,
          },
        },
      ];

      try {
        let response = null;
        let lastError: unknown = null;

        for (const config of requestConfigs) {
          try {
            response = await axiosInstance.get(config.url, {
              params: config.params,
            });
            break;
          } catch (error) {
            lastError = error;
          }
        }

        if (!response) {
          throw lastError;
        }

        setSalutations(extractSalutationOptions(response.data));
      } catch (error) {
        setSalutations([]);
      }
    };

    void loadSalutations();
  }, []);

  useEffect(() => {
    const loadBanks = async () => {
      setBankLoading(true);
      setBankError('');

      try {
        const response = await axiosInstance.get('/master/GetDepositBanks', {
          params: {
            dataflag: ContentTypes.DataFlag,
          },
        });

        const bankRecords = extractArrayPayload(response.data);
        setBanks(
          bankRecords
            .map(mapBankRecord)
            .filter(
              (bank, index, currentBanks) =>
                (bank.bankName || bank.accountNo || bank.ifsc || bank.branch) &&
                currentBanks.findIndex(item => item.id === bank.id) === index,
            ),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.Message ||
          error?.message ||
          'Failed to load bank list.';
        setBankError(message);
      } finally {
        setBankLoading(false);
      }
    };

    void loadBanks();
  }, []);

  const handleReset = () => {
    setDonorIdentificationForm(
      createInitialDonorIdentificationForm(getToday()),
    );
    setAnnounceEventForm(createInitialAnnounceEventForm());
    setPersonalInfoForm(createInitialPersonalInfoForm());
    setAnnounceDetailsForm(createInitialAnnounceDetailsForm());
    setFollowUpForm(createInitialFollowUpForm());
    setFollowUpItems([]);
    setSelectedBankIds([]);
    setActiveTab('personal');
    setIsSearchingDonor(false);
    setDonorSearchError('');
    setDonorOptions([]);
    setShowDonorModal(false);
    setIsPincodeLocationLocked(false);
    lastDonorSearchKeyRef.current = '';
    donorSearchRequestIdRef.current += 1;
    pincodeRequestIdRef.current += 1;
  };

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      <AnnounceMasterNav />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-6">
          <div className="row g-6">
            <div className="col-xl-4">
              <DonorIdentificationCard
                form={donorIdentificationForm}
                isSearching={isSearchingDonor}
                searchError={donorSearchError}
                donorOptions={donorOptions}
                showDonorModal={showDonorModal}
                onChange={handleDonorIdentificationChange}
                onSelectDonor={handleSelectDonor}
                onCloseDonorModal={handleCloseDonorModal}
              />
            </div>

            <div className="col-xl-8">
              <AnnounceEventCard
                form={announceEventForm}
                eventOptions={eventOptions}
                eventCauseOptions={eventCauseOptions}
                eventCityOptions={eventCityOptions}
                eventChannelOptions={eventChannelOptions}
                panditOptions={panditOptions}
                eventLoading={eventLoading}
                eventError={eventError}
                onChange={handleAnnounceEventChange}
              />
            </div>

            <div className="col-12">
            <AnnouncerPersonalDetailsCard
              activeTab={activeTab}
              personalInfoForm={personalInfoForm}
              salutations={salutations}
              stateOptions={stateOptions}
              districtOptions={districtOptions}
              isPincodeLocationLocked={isPincodeLocationLocked}
              announceDetailsForm={announceDetailsForm}
              occasionTypeOptions={occasionTypeOptions}
              causeHeadOptions={causeHeadOptions}
              purposeOptions={purposeOptions}
              followUpForm={followUpForm}
              followUpItems={followUpItems}
                banks={banks}
                bankLoading={bankLoading}
                bankError={bankError}
                selectedBankIds={selectedBankIds}
                amount={amount}
                onTabChange={setActiveTab}
                onPersonalInfoChange={handlePersonalInfoChange}
                onAnnounceDetailsChange={handleAnnounceDetailsChange}
                onFollowUpChange={handleFollowUpChange}
                onQuantityChange={handleQuantityChange}
                onToggleBank={handleToggleBank}
                onAddFollowUp={handleAddFollowUp}
                onRemoveFollowUp={handleRemoveFollowUp}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
