import { AnnouncementListingItem } from './components/AnnouncementListing';
import {
  AddedAnnounceCause,
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

const isValidDateValue = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  return !Number.isNaN(parsedDate.getTime());
};

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

  const donorRecord = extractDonorRecord(payload);
  return donorRecord ? [donorRecord] : [];
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

const getPayloadRecordCandidates = (
  payload: unknown,
): Record<string, unknown>[] => [
  ...extractArrayPayload(payload),
  ...collectObjectArrayCandidates(payload).flat(),
  ...(payload && typeof payload === 'object'
    ? [payload as Record<string, unknown>]
    : []),
];

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
            'Purpose',
            'PurposeHeadName',
            'PURPOSEHEADNAME',
            'Name',
            'Text',
          ]),
        label: getFirstValue(record, [
          'PurposeName',
          'PURPOSE_NAME',
          'Purpose',
          'PurposeHeadName',
          'PURPOSEHEADNAME',
          'PName',
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
        'Yojna',
        'YojnaName',
        'YOJNA_NAME',
        'SchemeName',
        'SCHEME_NAME',
        'PlanName',
        'PLAN_NAME',
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
        label: yojnaName || amountValue || yojnaId,
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
  for (const record of getPayloadRecordCandidates(payload)) {
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
  for (const record of getPayloadRecordCandidates(payload)) {
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

const ANNOUNCEMENT_CACHE_KEY = 'announcement-list-cache';

export interface AnnouncementCacheRecord {
  announceId: string;
  donorIdentificationForm: DonorIdentificationForm;
  announceEventForm: AnnounceEventForm;
  personalInfoForm: PersonalInfoForm;
  announceDetailsForm: AnnounceDetailsForm;
  followUpForm: FollowUpForm;
  followUpItems: FollowUpItem[];
  addedCauses: AddedAnnounceCause[];
  selectedBankIds: string[];
  currencyId?: string;
  savedAt: string;
}

const readAnnouncementCache = (): AnnouncementCacheRecord[] => {
  try {
    const rawValue = localStorage.getItem(ANNOUNCEMENT_CACHE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue)
      ? (parsedValue as AnnouncementCacheRecord[])
      : [];
  } catch {
    return [];
  }
};

const writeAnnouncementCache = (records: AnnouncementCacheRecord[]) => {
  localStorage.setItem(ANNOUNCEMENT_CACHE_KEY, JSON.stringify(records));
};

const mapCacheToListingItem = (
  record: AnnouncementCacheRecord,
): AnnouncementListingItem => ({
  announceId: record.announceId,
  announceDate: record.donorIdentificationForm.announceDate,
  announcerName: record.personalInfoForm.announcerName,
  mobileNo: record.personalInfoForm.mobileNo,
  eventName: record.announceEventForm.eventName,
  occasionType: record.announceDetailsForm.occasionType,
  announceAmount: String(
    record.addedCauses.reduce(
      (total, cause) => total + parseAmountValue(cause.amount),
      0,
    ),
  ),
  source: 'cache',
});

const extractAnnouncementId = (
  payload: unknown,
  fallbackValue: string,
): string => {
  if (payload && typeof payload === 'object') {
    const resultItems = Array.isArray(
      (payload as { result?: unknown[] }).result,
    )
      ? ((payload as { result: unknown[] }).result ?? []).filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === 'object',
        )
      : [];

    for (const item of resultItems) {
      const resolvedCode = getFirstValue(item, [
        'code',
        'Code',
        'announce_id',
        'AnnounceID',
        'id',
        'ID',
      ]).trim();

      if (/^\d+$/.test(resolvedCode) && resolvedCode !== '0') {
        return resolvedCode;
      }
    }
  }

  const record = extractDonorRecord(payload);
  if (!record) {
    return fallbackValue;
  }

  const resolvedId = getFirstValue(record, [
    'announce_id',
    'AnnounceID',
    'id',
    'ID',
    'code',
    'Code',
  ]).trim();

  return /^\d+$/.test(resolvedId) && resolvedId !== '0'
    ? resolvedId
    : fallbackValue;
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

const inferCurrencyIdFromCode = (currencyCode: string): string => {
  const normalizedCurrencyCode = currencyCode.trim().toUpperCase();

  if (normalizedCurrencyCode === 'INR') {
    return '4';
  }

  return '';
};

const getCurrentTimeValue = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const mapEventDetailRecord = (record: Record<string, unknown>) => ({
  id: getFirstValue(record, ['EVENT_ID', 'EventId', 'EventID', 'Id', 'ID']),
  eventName: getFirstValue(record, [
    'EName',
    'EVENT_NAME',
    'EventName',
    'Name',
  ]),
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
  eventChannel: getFirstValue(record, [
    'CHANNEL_NAME',
    'ChannelName',
    'CHANNEL',
  ]),
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
    `${index}`,
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

export {
  buildQuantityOptions,
  createEmptyCauseFields,
  createEventOptions,
  createUniqueFieldOptions,
  donorSearchTypeCandidates,
  extractAnnounceCauseOptions,
  extractAnnouncementId,
  extractArrayPayload,
  extractCauseHeadOptions,
  extractCurrencyId,
  extractDistrictOptions,
  extractDonorRecords,
  extractHowToDonateOptions,
  extractOccasionOptions,
  extractOperationAmount,
  extractPincodeLocation,
  extractSalutationOptions,
  extractStateOptions,
  extractYojnaOptions,
  formatDateForApi,
  getFirstValue,
  getCurrentTimeValue,
  getToday,
  inferCurrencyIdFromCode,
  isValidDateValue,
  mapBankRecord,
  mapCacheToListingItem,
  mapDonorSearchResult,
  mapDonorToPersonalInfo,
  mapEventDetailRecord,
  normalizeApiDate,
  normalizeApiTime,
  parseAmountValue,
  parseStoredUser,
  readAnnouncementCache,
  resolveStateOption,
  toDigitsNumber,
  toNullableText,
  writeAnnouncementCache,
};
