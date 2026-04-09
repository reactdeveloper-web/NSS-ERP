import React, { useEffect, useRef, useState } from 'react';
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
  AddedAnnounceCause,
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
        'Yojna_ID',
        'YOJNA_ID',
        'SchemeId',
        'SCHEME_ID',
        'Id',
        'ID',
      ]);
      const qtyValue = getFirstValue(record, [
        'Qty',
        'QTY',
        'Quantity',
        'QUANTITY',
      ]);

      return {
        value: yojnaId || amountValue || yojnaName,
        label:
          yojnaName && amountValue
            ? `${yojnaName} (Rs. ${Number(amountValue).toLocaleString('en-IN')})`
            : yojnaName || amountValue || yojnaId,
        yojnaId,
        qtyValue,
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

const extractHowToDonateOptions = (payload: unknown): EventOption[] => {
  if (Array.isArray(payload)) {
    const scalarOptions = payload
      .filter(
        (item): item is string | number =>
          typeof item === 'string' || typeof item === 'number',
      )
      .map(item => {
        const normalizedValue = String(item).trim();

        return {
          value: normalizedValue,
          label: normalizedValue,
        };
      })
      .filter((option, index, currentOptions) => {
        return (
          option.value !== '' &&
          currentOptions.findIndex(item => item.value === option.value) ===
            index
        );
      });

    if (scalarOptions.length > 0) {
      return scalarOptions;
    }
  }

  const howToDonateRecords = extractArrayPayload(payload);

  return howToDonateRecords
    .map(record => {
      const value = getFirstValue(record, [
        'id',
        'Id',
        'ID',
        'code',
        'Code',
        'CODE',
        'HOW_TO_DONATE_ID',
        'HowToDonateId',
        'HOWTODONATEID',
        'RemarkId',
        'REMARK_ID',
        'REMARKID',
        'MasterId',
        'MASTER_ID',
        'Value',
        'value',
        'Name',
        'name',
        'Text',
        'text',
        'Remark',
        'remark',
        'RemarkName',
        'REMARK_NAME',
        'REMARKNAME',
      ]);
      const label = getFirstValue(record, [
        'name',
        'Name',
        'NAME',
        'Text',
        'text',
        'label',
        'Label',
        'LABEL',
        'Remark',
        'remark',
        'RemarkName',
        'REMARK_NAME',
        'REMARKNAME',
        'HOW_TO_DONATE_NAME',
        'HowToDonateName',
        'HOWTODONATENAME',
        'Value',
        'value',
      ]);

      return {
        value: value || label,
        label: label || value,
      };
    })
    .filter(
      (option, index, currentOptions) =>
        option.value.trim() !== '' &&
        option.label.trim() !== '' &&
        currentOptions.findIndex(item => item.value === option.value) === index,
    );
};

const extractCurrencyId = (payload: unknown): string => {
  const currencyRecords = extractArrayPayload(payload);

  for (const record of currencyRecords) {
    const currencyId = getFirstValue(record, [
      'CurrencyId',
      'CurrencyID',
      'CURRENCY_ID',
      'currencyId',
      'Id',
      'ID',
    ]);

    if (currencyId.trim() !== '') {
      return currencyId.trim();
    }
  }

  if (payload && typeof payload === 'object') {
    return getFirstValue(payload as Record<string, unknown>, [
      'CurrencyId',
      'CurrencyID',
      'CURRENCY_ID',
      'currencyId',
      'Id',
      'ID',
    ]).trim();
  }

  return '';
};

const extractOperationAmount = (payload: unknown): string => {
  const candidates = [
    ...extractArrayPayload(payload),
    ...collectObjectArrayCandidates(payload).flat(),
    ...(payload && typeof payload === 'object'
      ? [payload as Record<string, unknown>]
      : []),
  ];

  for (const record of candidates) {
    const amountValue = getFirstValue(record, [
      'Amount',
      'AMOUNT',
      'TotalAmount',
      'TOTAL_AMOUNT',
      'OperationAmount',
      'OPERATION_AMOUNT',
      'OperationAmt',
      'Amt',
      'NetAmount',
      'DonationAmount',
      'Value',
    ]);

    if (amountValue.trim() !== '') {
      return amountValue.trim();
    }
  }

  return '';
};

const parseAmountValue = (value: string): number => {
  const sanitizedValue = value.replace(/,/g, '').trim();
  const parsedValue = Number(sanitizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const createEmptyCauseFields = (): Pick<
  AnnounceDetailsForm,
  | 'causeHead'
  | 'causeHeadDate'
  | 'namePlateName'
  | 'donorInstruction'
  | 'purpose'
  | 'quantity'
> => ({
  causeHead: '',
  causeHeadDate: '',
  namePlateName: '',
  donorInstruction: '',
  purpose: '',
  quantity: 1,
});

const buildQuantityOptions = (
  baseQuantity: number,
): { value: number; label: string }[] =>
  Array.from({ length: 10 }, (_, index) => {
    const quantityValue = baseQuantity * (index + 1);

    return {
      value: quantityValue,
      label: String(quantityValue),
    };
  });

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
      districtCode: getFirstValue(record, [
        'District_Code',
        'DistrictCode',
        'DISTRICT_CODE',
        'district_code',
        'districtCode',
        'DistrictId',
        'DISTRICTID',
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

const extractPincodeLocation = (
  payload: unknown,
): {
  country: string;
  state: string;
  stateCode: string;
  district: string;
} | null => {
  const candidates = [
    ...extractArrayPayload(payload),
    ...collectObjectArrayCandidates(payload).flat(),
    ...(payload && typeof payload === 'object'
      ? [payload as Record<string, unknown>]
      : []),
  ];

  for (const record of candidates) {
    const country = getFirstValue(record, [
      'Country_Name',
      'CountryName',
      'COUNTRY_NAME',
      'country_name',
      'countryName',
      'Country',
      'COUNTRY',
      'country',
    ]);
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
    const stateCode = getFirstValue(record, [
      'State_Code',
      'StateCode',
      'STATE_CODE',
      'state_code',
      'stateCode',
      'StateId',
      'STATEID',
      'stateId',
      'Code',
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

    if (country || state || stateCode || district) {
      return {
        country,
        state,
        stateCode,
        district,
      };
    }
  }

  return null;
};

const resolveStateOption = (
  options: EventOption[],
  location: { state: string; stateCode: string },
): EventOption | undefined => {
  const normalizedState = location.state.trim().toLowerCase();
  const normalizedStateCode = location.stateCode.trim().toLowerCase();

  return options.find(option => {
    const optionValue = option.value.trim().toLowerCase();
    const optionLabel = option.label.trim().toLowerCase();
    const optionStateCode = option.stateCode?.trim().toLowerCase() ?? '';

    return (
      (normalizedStateCode !== '' && optionStateCode === normalizedStateCode) ||
      (normalizedState !== '' &&
        (optionValue === normalizedState || optionLabel === normalizedState))
    );
  });
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

const formatDateForApi = (value: string): string | null => {
  const normalizedDate = normalizeApiDate(value);

  if (!normalizedDate) {
    return null;
  }

  const [year, month, day] = normalizedDate.split('-');
  return `${day}/${month}/${year}`;
};

const formatTimeForApi = (value: string): string | null => {
  const normalizedTime = normalizeApiTime(value);

  if (!normalizedTime) {
    return null;
  }

  const [rawHours, minutes] = normalizedTime.split(':');
  const parsedHours = Number(rawHours);

  if (!Number.isFinite(parsedHours)) {
    return null;
  }

  const period = parsedHours >= 12 ? 'PM' : 'AM';
  const displayHours = parsedHours % 12 || 12;

  return `${displayHours}:${minutes} ${period}`;
};

const parseStoredUser = (): Partial<IUser> => {
  try {
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as Partial<IUser>) : {};
  } catch {
    return {};
  }
};

const toNullableText = (value: string): string | null => {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue : null;
};

const toDigitsNumber = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
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
  cityCode: getFirstValue(record, [
    'CITY_CODE',
    'CityCode',
    'CityID',
    'CityId',
    'BhagCityCode',
    'BHAG_CITY_CODE',
  ]),
  channelCode: getFirstValue(record, [
    'CHANNEL_CODE',
    'ChannelCode',
    'ChannelID',
    'ChannelId',
  ]),
  panditCode: getFirstValue(record, [
    'PANDIT_CODE',
    'PanditCode',
    'PanditID',
    'PanditId',
  ]),
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
  const [howToDonateOptions, setHowToDonateOptions] = useState<EventOption[]>(
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
  const [currencyId, setCurrencyId] = useState('');
  const [autoAmount, setAutoAmount] = useState('');
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const [addedCauses, setAddedCauses] = useState<AddedAnnounceCause[]>([]);
  const [editingCauseId, setEditingCauseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<AnnouncerTabKey>('personal');
  const [isSearchingDonor, setIsSearchingDonor] = useState(false);
  const [donorSearchError, setDonorSearchError] = useState('');
  const [donorOptions, setDonorOptions] = useState<DonorSearchResult[]>([]);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [isPincodeLocationLocked, setIsPincodeLocationLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveRequestPayload, setSaveRequestPayload] = useState<unknown>(null);
  const [saveResultPayload, setSaveResultPayload] = useState<unknown>(null);
  const [causeIdPendingDelete, setCauseIdPendingDelete] = useState<number | null>(
    null,
  );
  const lastDonorSearchKeyRef = useRef('');
  const donorSearchRequestIdRef = useRef(0);
  const pincodeRequestIdRef = useRef(0);
  const purposeOptionsRequestIdRef = useRef(0);
  const amountRequestIdRef = useRef(0);

  const handleDonorIdentificationChange = <
    K extends keyof DonorIdentificationForm
  >(
    field: K,
    value: DonorIdentificationForm[K],
  ) => {
    if (field === 'donorSearchType' || field === 'donorId') {
      setDonorSearchError('');
    }

    if (field === 'donorSearchType') {
      lastDonorSearchKeyRef.current = '';
      donorSearchRequestIdRef.current += 1;
      setIsSearchingDonor(false);
      setDonorOptions([]);
      setShowDonorModal(false);
      resetPersonalInfo();
      setDonorIdentificationForm(current => ({
        ...current,
        donorSearchType: value as DonorIdentificationForm['donorSearchType'],
        donorId: '',
      }));
      return;
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
    if (field === 'causeHead') {
      const nextCauseHead = String(value).trim();

      purposeOptionsRequestIdRef.current += 1;
      amountRequestIdRef.current += 1;
      setCurrencyId('');
      setPurposeOptions([]);
      setAutoAmount('');
      setIsAmountEditable(false);
      setAnnounceDetailsForm(current => ({
        ...current,
        causeHead: nextCauseHead,
        causeHeadDate: nextCauseHead === '150' ? current.causeHeadDate : '',
        namePlateName: ['162', '167', '168'].includes(nextCauseHead)
          ? current.namePlateName
          : '',
        donorInstruction: ['162', '167', '168'].includes(nextCauseHead)
          ? current.donorInstruction
          : '',
        purpose: '',
        quantity: 1,
      }));
      return;
    }

    if (field === 'purpose') {
      amountRequestIdRef.current += 1;
      setAutoAmount('');
      setIsAmountEditable(false);
      setAnnounceDetailsForm(current => ({
        ...current,
        purpose: value as AnnounceDetailsForm['purpose'],
        quantity: 1,
      }));
      return;
    }

    setAnnounceDetailsForm(current => ({ ...current, [field]: value }));
  };

  const handleAmountChange = (value: string) => {
    const normalizedValue = value.replace(/[^\d.]/g, '');
    setAutoAmount(normalizedValue);
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

  const handleAddCause = () => {
    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === announceDetailsForm.causeHead,
    );
    const selectedPurpose = purposeOptions.find(
      option => option.value === announceDetailsForm.purpose,
    );
    const yojnaId =
      selectedPurpose?.yojnaId?.trim() || announceDetailsForm.purpose.trim();
    const causeAmount =
      autoAmount.trim() || selectedPurpose?.amountValue?.trim() || '';

    if (
      !announceDetailsForm.causeHead.trim() ||
      !announceDetailsForm.purpose.trim() ||
      !yojnaId ||
      !causeAmount ||
      (announceDetailsForm.causeHead === '150' &&
        !announceDetailsForm.causeHeadDate.trim())
    ) {
      return;
    }

    const nextCause: AddedAnnounceCause = {
      id: editingCauseId ?? Date.now(),
      causeHead: announceDetailsForm.causeHead,
      causeHeadLabel:
        selectedCauseHead?.label || announceDetailsForm.causeHead.trim(),
      causeHeadPurposeId:
        selectedCauseHead?.purposeId?.trim() ||
        announceDetailsForm.causeHead.trim(),
      purpose: announceDetailsForm.purpose,
      purposeLabel: selectedPurpose?.label || announceDetailsForm.purpose.trim(),
      yojnaId,
      quantity: Math.max(1, Number(announceDetailsForm.quantity) || 1),
      amount: causeAmount,
      causeHeadDate: announceDetailsForm.causeHeadDate,
      namePlateName: announceDetailsForm.namePlateName.trim(),
      donorInstruction: announceDetailsForm.donorInstruction.trim(),
    };

    setAddedCauses(current => {
      const nextCauses =
        editingCauseId === null
          ? [...current, nextCause]
          : current.map(item => (item.id === editingCauseId ? nextCause : item));

      return nextCauses;
    });
    setEditingCauseId(null);
    purposeOptionsRequestIdRef.current += 1;
    amountRequestIdRef.current += 1;
    setCurrencyId('');
    setPurposeOptions([]);
    setAutoAmount('');
    setIsAmountEditable(false);
    setAnnounceDetailsForm(current => ({
      ...current,
      ...createEmptyCauseFields(),
    }));
  };

  const handleEditCause = (causeId: number) => {
    const cause = addedCauses.find(item => item.id === causeId);

    if (!cause) {
      return;
    }

    setEditingCauseId(causeId);
    setAutoAmount(cause.amount);
    setAnnounceDetailsForm(current => ({
      ...current,
      causeHead: cause.causeHead,
      causeHeadDate: cause.causeHeadDate,
      namePlateName: cause.namePlateName,
      donorInstruction: cause.donorInstruction,
      purpose: cause.purpose,
      quantity: cause.quantity,
    }));
  };

  const handleDeleteCause = (causeId: number) => {
    setCauseIdPendingDelete(causeId);
  };

  const handleCloseDeleteCauseModal = () => {
    setCauseIdPendingDelete(null);
  };

  const handleConfirmDeleteCause = () => {
    if (causeIdPendingDelete === null) {
      return;
    }

    const causeId = causeIdPendingDelete;
    setAddedCauses(current => current.filter(item => item.id !== causeId));

    if (editingCauseId === causeId) {
      setEditingCauseId(null);
      purposeOptionsRequestIdRef.current += 1;
      amountRequestIdRef.current += 1;
      setCurrencyId('');
      setPurposeOptions([]);
      setAutoAmount('');
      setIsAmountEditable(false);
      setAnnounceDetailsForm(current => ({
        ...current,
        ...createEmptyCauseFields(),
      }));
    }

    setCauseIdPendingDelete(null);
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
        const response = await axiosInstance.get('CRM/GetAnnounceCauses', {
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
          '/crm/GetOccasionMaster?DataFlag=GANGOTRI',
          {
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
    const loadHowToDonateOptions = async () => {
      try {
        const response = await axiosInstance.get(
          'crm/GetAnnounceRemarkMasterHowToDonate',
          {
            headers: createDirectApiHeaders(),
          },
        );

        setHowToDonateOptions(extractHowToDonateOptions(response.data));
      } catch (error) {
        setHowToDonateOptions([]);
      }
    };

    void loadHowToDonateOptions();
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
          const response = await axiosInstance.post(
            '/master/GetStateAndDistrictByPinCode',
            null,
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

          const matchedState = resolveStateOption(stateOptions, location);

          setPersonalInfoForm(current => ({
            ...current,
            country: location.country.trim() || 'India',
            state:
              matchedState?.value || location.state.trim() || current.state,
            district: location.district.trim() || current.district,
          }));
          setIsPincodeLocationLocked(
            Boolean(
              matchedState?.value ||
                location.state.trim() ||
                location.district.trim(),
            ),
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
  }, [personalInfoForm.pincode, stateOptions]);

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
      purposeOptionsRequestIdRef.current += 1;
      setCurrencyId('');
      setPurposeOptions([]);
      setAutoAmount('');
      setIsAmountEditable(false);
      setAnnounceDetailsForm(current =>
        current.purpose || current.quantity !== 1
          ? { ...current, purpose: '', quantity: 1 }
          : current,
      );
      return;
    }

    const requestId = purposeOptionsRequestIdRef.current + 1;
    purposeOptionsRequestIdRef.current = requestId;

    const loadPurposeOptions = async () => {
      try {
        const currencyResponse = await axiosInstance.get(
          '/master/GetCurrencyByCountry',
          {
            params: {
              countryCode: 22,
              DataFlag: ContentTypes.DataFlag,
            },
            headers: createDirectApiHeaders(),
          },
        );

        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        const nextCurrencyId = extractCurrencyId(currencyResponse.data);

        if (!nextCurrencyId) {
          setCurrencyId('');
          setPurposeOptions([]);
          setAutoAmount('');
          setIsAmountEditable(false);
          setAnnounceDetailsForm(current =>
            current.purpose || current.quantity !== 1
              ? { ...current, purpose: '', quantity: 1 }
              : current,
          );
          return;
        }

        setCurrencyId(nextCurrencyId);

        const response = await axiosInstance.get(
          '/master/GetYojnaByPurposeAndCurrency',
          {
            params: {
              DataFlag: ContentTypes.DataFlag,
              CurrencyId: nextCurrencyId,
              PurposeId: purposeId,
            },
            headers: createDirectApiHeaders(),
          },
        );

        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        const nextPurposeOptions = extractYojnaOptions(response.data);
        setPurposeOptions(nextPurposeOptions);
        setIsAmountEditable(false);
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
            quantity: 1,
          };
        });
      } catch (error) {
        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        setCurrencyId('');
        setPurposeOptions([]);
        setAutoAmount('');
        setIsAmountEditable(false);
        setAnnounceDetailsForm(current =>
          current.purpose || current.quantity !== 1
            ? { ...current, purpose: '', quantity: 1 }
            : current,
        );
      }
    };

    void loadPurposeOptions();
  }, [announceDetailsForm.causeHead, causeHeadOptions]);

  useEffect(() => {
    const quantity = Math.max(1, Number(announceDetailsForm.quantity) || 1);
    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === announceDetailsForm.causeHead,
    );
    const selectedCauseHeadPurposeId =
      selectedCauseHead?.purposeId?.trim() || announceDetailsForm.causeHead.trim();
    const selectedPurpose = purposeOptions.find(
      option => option.value === announceDetailsForm.purpose,
    );
    const selectedPurposeId =
      selectedPurpose?.yojnaId?.trim() || announceDetailsForm.purpose.trim();
    const selectedPurposeQty = selectedPurpose?.qtyValue?.trim() || '';
    const selectedPurposeQtyNumber = Math.max(
      0,
      Number(selectedPurposeQty || 0),
    );
    const selectedPurposeAmount = parseAmountValue(
      selectedPurpose?.amountValue?.trim() || '',
    );

    amountRequestIdRef.current += 1;
    const requestId = amountRequestIdRef.current;

    if (!selectedPurposeId) {
      setAutoAmount('');
      setIsAmountEditable(false);
      return;
    }

    if (selectedPurposeQty === '0') {
      const shouldEnableAmountField = selectedPurposeAmount <= 1;

      setIsAmountEditable(shouldEnableAmountField);
      setAutoAmount(current =>
        current || (selectedPurposeAmount > 0 ? String(selectedPurposeAmount) : ''),
      );
      return;
    }

    setIsAmountEditable(false);

    if (currencyId !== '4' || selectedCauseHeadPurposeId !== '2') {
      setAutoAmount(
        selectedPurposeAmount > 0
          ? (
              selectedPurposeAmount *
              (selectedPurposeQtyNumber > 1
                ? quantity / selectedPurposeQtyNumber
                : quantity)
            ).toLocaleString('en-IN')
          : '',
      );
      return;
    }

    const loadOperationAmount = async () => {
      try {
        const response = await axiosInstance.get(
          '/master/GetOperationAmountBYQty',
          {
            params: {
              DataFlag: ContentTypes.DataFlag,
              CurrencyId: currencyId,
              qty: quantity,
            },
            headers: createDirectApiHeaders(),
          },
        );

        if (requestId !== amountRequestIdRef.current) {
          return;
        }

        setAutoAmount(extractOperationAmount(response.data));
      } catch (error) {
        if (requestId !== amountRequestIdRef.current) {
          return;
        }

        setAutoAmount('');
      }
    };

    void loadOperationAmount();
  }, [announceDetailsForm.purpose, announceDetailsForm.quantity, currencyId, purposeOptions]);

  useEffect(() => {
    const selectedPurpose = purposeOptions.find(
      option => option.value === announceDetailsForm.purpose,
    );
    const selectedPurposeQty = Math.max(
      0,
      Number(selectedPurpose?.qtyValue?.trim() || 0),
    );

    if (selectedPurposeQty <= 1) {
      return;
    }

    setAnnounceDetailsForm(current =>
      current.quantity === selectedPurposeQty
        ? current
        : { ...current, quantity: selectedPurposeQty },
    );
  }, [announceDetailsForm.purpose, purposeOptions]);

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
    setShowSaveResultModal(false);
    setSaveRequestPayload(null);
    setSaveResultPayload(null);
    setIsSaving(false);
    setCauseIdPendingDelete(null);
    setAddedCauses([]);
    setEditingCauseId(null);
    setIsPincodeLocationLocked(false);
    lastDonorSearchKeyRef.current = '';
    donorSearchRequestIdRef.current += 1;
    pincodeRequestIdRef.current += 1;
  };

  const selectedPurposeOption = purposeOptions.find(
    option => option.value === announceDetailsForm.purpose,
  );
  const selectedCauseHeadOption = causeHeadOptions.find(
    option => option.value === announceDetailsForm.causeHead,
  );
  const selectedHowToDonateOption = howToDonateOptions.find(
    option => option.value === announceDetailsForm.howToDonate,
  );
  const selectedStateOption = stateOptions.find(
    option =>
      option.value === personalInfoForm.state ||
      option.label === personalInfoForm.state,
  );
  const selectedDistrictOption = districtOptions.find(
    option =>
      option.value === personalInfoForm.district ||
      option.label === personalInfoForm.district,
  );
  const selectedEventDetail = eventDetails.find(
    option => option.eventName === announceEventForm.eventName,
  );
  const selectedEventCityDetail = eventDetails.find(
    option =>
      option.eventCity === announceEventForm.eventCity &&
      option.cityCode?.trim() !== '',
  );
  const selectedEventChannelDetail = eventDetails.find(
    option =>
      option.eventChannel === announceEventForm.eventChannel &&
      option.channelCode?.trim() !== '',
  );
  const selectedEventPanditDetail = eventDetails.find(
    option =>
      option.panditJi === announceEventForm.panditJi &&
      option.panditCode?.trim() !== '',
  );
  const selectedPurposeQty = Math.max(
    0,
    Number(selectedPurposeOption?.qtyValue?.trim() || 1),
  );
  const effectiveCauseAmount =
    autoAmount.trim() || selectedPurposeOption?.amountValue?.trim() || '';
  const currentPurposeKey =
    selectedPurposeOption?.yojnaId?.trim() || announceDetailsForm.purpose.trim();
  const usedPurposeKeys = new Set(
    addedCauses
      .filter(cause => cause.id !== editingCauseId)
      .map(cause => cause.yojnaId),
  );
  const availablePurposeOptions = purposeOptions.filter(option => {
    const optionKey = option.yojnaId?.trim() || option.value.trim();

    return optionKey === '' || !usedPurposeKeys.has(optionKey);
  });
  const isCauseReadyToAdd =
    announceDetailsForm.causeHead.trim() !== '' &&
    announceDetailsForm.purpose.trim() !== '' &&
    currentPurposeKey !== '' &&
    !usedPurposeKeys.has(currentPurposeKey) &&
    Math.max(1, Number(announceDetailsForm.quantity) || 1) > 0 &&
    effectiveCauseAmount !== '' &&
    (announceDetailsForm.causeHead !== '150' ||
      announceDetailsForm.causeHeadDate.trim() !== '');
  const quantityControlMode: 'disabled' | 'stepper' | 'select' =
    selectedPurposeQty === 0
      ? 'disabled'
      : selectedPurposeQty === 1
        ? 'stepper'
        : 'select';
  const quantityOptions =
    quantityControlMode === 'select'
      ? buildQuantityOptions(selectedPurposeQty)
      : [];

  const handleCloseSaveResultModal = () => {
    setShowSaveResultModal(false);
  };

  const handleSave = async () => {
    const currentUser = parseStoredUser();
    const currentCauseForPayload =
      isCauseReadyToAdd && selectedPurposeOption
        ? {
            id: Date.now(),
            causeHead: announceDetailsForm.causeHead,
            causeHeadLabel: selectedCauseHeadOption?.label || '',
            causeHeadPurposeId:
              selectedCauseHeadOption?.purposeId?.trim() ||
              announceDetailsForm.causeHead.trim(),
            purpose: announceDetailsForm.purpose,
            purposeLabel:
              selectedPurposeOption.label || announceDetailsForm.purpose,
            yojnaId:
              selectedPurposeOption.yojnaId?.trim() ||
              announceDetailsForm.purpose.trim(),
            quantity: Math.max(1, Number(announceDetailsForm.quantity) || 1),
            amount: autoAmount.trim(),
            causeHeadDate: announceDetailsForm.causeHeadDate,
            namePlateName: announceDetailsForm.namePlateName.trim(),
            donorInstruction: announceDetailsForm.donorInstruction.trim(),
          }
        : null;
    const causesForPayload = currentCauseForPayload
      ? [...addedCauses, currentCauseForPayload]
      : addedCauses;
    const announceAmount = causesForPayload.reduce(
      (total, cause) => total + parseAmountValue(cause.amount),
      0,
    );
    const payload = {
      annoucePurposeList: causesForPayload.map(cause => ({
        yojna_id: cause.yojnaId || '0',
        qty: String(Math.max(1, Number(cause.quantity) || 1)),
        amount: String(parseAmountValue(cause.amount) || 0),
        bhojan_date: formatDateForApi(cause.causeHeadDate) || '',
      })),
      ashri: personalInfoForm.salutation || '',
      ashri_oth:
        personalInfoForm.announcedForName.trim() ||
        (personalInfoForm.announceInOtherName ? personalInfoForm.announcerName.trim() : 'N.A.'),
      announcer_name: personalInfoForm.announcerName.trim(),
      announce_amount: announceAmount,
      address1: '',
      address2: '',
      address3: '',
      ph_no: 0,
      mob_no: personalInfoForm.mobileNo.trim(),
      announce_through: 'CALLCENTER',
      announce_date: formatDateForApi(donorIdentificationForm.announceDate),
      announce_time: null,
      std_code: 0,
      email_id: '',
      purpose: Number(causesForPayload[0]?.yojnaId || 0),
      due_date: formatDateForApi(followUpForm.date),
      due_time: formatTimeForApi(followUpForm.time),
      completed: 0,
      remark1:
        selectedHowToDonateOption?.label?.trim() ||
        announceDetailsForm.howToDonate.trim(),
      first_remark: toNullableText(announceDetailsForm.occasionRemark),
      second_remark: toNullableText(
        causesForPayload
          .map(cause => cause.donorInstruction)
          .filter(Boolean)
          .join(', '),
      ),
      third_remark: toNullableText(
        causesForPayload.map(cause => cause.namePlateName).filter(Boolean).join(', '),
      ),
      city_code: null,
      district_code: Number(selectedDistrictOption?.districtCode?.trim() || 0),
      state_code: Number(selectedStateOption?.stateCode?.trim() || 0),
      remark2: announceDetailsForm.occasionRemark.trim(),
      channel_code: Number(
        selectedEventDetail?.channelCode?.trim() ||
          selectedEventChannelDetail?.channelCode?.trim() ||
          0,
      ),
      pandit_code: Number(
        selectedEventDetail?.panditCode?.trim() ||
          selectedEventPanditDetail?.panditCode?.trim() ||
          0,
      ),
      bhag_city_code: Number(
        selectedEventDetail?.cityCode?.trim() ||
          selectedEventCityDetail?.cityCode?.trim() ||
          0,
      ),
      user_name: currentUser.username || '',
      emp_code: Number(currentUser.empNum || 0),
      live: announceEventForm.liveType === 'live' ? 'Y' : 'N',
      ash_event_id: selectedEventDetail?.id?.trim() || '0',
      event_name: announceEventForm.eventName.trim(),
      user_id: String(currentUser.id || ''),
      cash_pickup: 'N',
      other_type: personalInfoForm.announceInOtherName ? 1 : 0,
      currency_id: Number(currencyId || 0),
      cause_id: Number(causesForPayload[0]?.causeHeadPurposeId || 0),
      ngcode: donorIdentificationForm.donorId.trim() || '0',
      data_flag: ContentTypes.DataFlag,
      fy_id: '21',
      dmobilewhatsapp1: personalInfoForm.whatsappNo.trim(),
      aadhar_number: '',
      pan_number: '',
      pincode_code: Number(personalInfoForm.pincode.trim() || 0),
      country_code: '22',
      pincode: personalInfoForm.pincode.trim(),
      PostType: 'App',
    };

    setIsSaving(true);
    setSaveRequestPayload(payload);

    try {
      const response = await axiosInstance.post('CRM/CreateAnnounce', payload, {
        headers: createDirectApiHeaders(),
      });

      setSaveResultPayload(response.data);
      setShowSaveResultModal(true);
    } catch (error) {
      const errorPayload = axios.isAxiosError(error)
        ? error.response?.data || { message: error.message }
        : { message: 'Failed to save announce.' };

      setSaveResultPayload(errorPayload);
      setShowSaveResultModal(true);
    } finally {
      setIsSaving(false);
    }
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
              addedCauses={addedCauses}
              editingCauseId={editingCauseId}
              occasionTypeOptions={occasionTypeOptions}
              causeHeadOptions={causeHeadOptions}
              purposeOptions={availablePurposeOptions}
              howToDonateOptions={howToDonateOptions}
              amount={autoAmount}
              isAmountEditable={isAmountEditable}
              quantityControlMode={quantityControlMode}
              quantityOptions={quantityOptions}
              isAddCauseDisabled={!isCauseReadyToAdd}
              isSaving={isSaving}
              onAmountChange={handleAmountChange}
              onAddCause={handleAddCause}
              onEditCause={handleEditCause}
              onDeleteCause={handleDeleteCause}
              onSave={handleSave}
              followUpForm={followUpForm}
              followUpItems={followUpItems}
                banks={banks}
                bankLoading={bankLoading}
                bankError={bankError}
                selectedBankIds={selectedBankIds}
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

      {showSaveResultModal ? (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header p-4">
                  <h4 className="modal-title">Create Announce Response</h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-icon btn-active-color-primary"
                    aria-label="Close"
                    onClick={handleCloseSaveResultModal}
                  >
                    <i className="ki-duotone ki-cross fs-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="bg-light-primary rounded p-4 mb-5">
                    <div className="fw-bold mb-2">Request Payload</div>
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(saveRequestPayload, null, 2)}
                    </pre>
                  </div>

                  {Array.isArray((saveResultPayload as { result?: unknown[] } | null)?.result) ? (
                    <div className="mb-5">
                      {(saveResultPayload as { result: Array<Record<string, unknown>> }).result.map(
                        (item, index) => (
                          <div
                            key={`${String(item.code ?? index)}-${index}`}
                            className={`alert ${
                              String(item.status || '').toLowerCase() === 'success'
                                ? 'alert-success'
                                : 'alert-danger'
                            } py-3`}
                          >
                            <div className="fw-semibold">
                              {String(item.msg || 'No message returned.')}
                            </div>
                            <div className="fs-8 mt-1 text-muted">
                              Code: {String(item.code ?? '-')} | Status:{' '}
                              {String(item.status ?? '-')}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : null}

                  <div className="bg-light rounded p-4">
                    <div className="fw-bold mb-2">Raw Response</div>
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(saveResultPayload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCloseSaveResultModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={handleCloseSaveResultModal}
          />
        </>
      ) : null}

      {causeIdPendingDelete !== null ? (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header p-4">
                  <h4 className="modal-title">Confirm Delete</h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-icon btn-active-color-primary"
                    aria-label="Close"
                    onClick={handleCloseDeleteCauseModal}
                  >
                    <i className="ki-duotone ki-cross fs-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </button>
                </div>

                <div className="modal-body">
                  <p className="mb-0">
                    Kya aap is added cause ko delete karna chahte hain?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCloseDeleteCauseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmDeleteCause}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={handleCloseDeleteCauseModal}
          />
        </>
      ) : null}
    </div>
  );
};
