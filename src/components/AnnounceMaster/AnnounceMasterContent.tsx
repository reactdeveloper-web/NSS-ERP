import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import axiosInstance from 'src/redux/interceptor';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import { AnnounceMasterNav } from './AnnounceMasterNav';
import { AnnouncementListing } from './components/AnnouncementListing';
import {
  DeleteCauseModal,
  SaveResultModal,
} from './components/AnnounceMasterModals';
import {
  createInitialAnnounceDetailsForm,
  createInitialAnnounceEventForm,
  createInitialDonorIdentificationForm,
  createInitialFollowUpForm,
  createInitialPersonalInfoForm,
} from './data';
import { AnnouncerPersonalDetailsCard } from './components/AnnouncerPersonalDetailsCard';
import {
  AddedAnnounceCause,
  AnnouncerTabKey,
  AnnounceDetailsForm,
  AnnounceEventForm,
  AnnounceValidationErrors,
  DepositBank,
  DonorIdentificationForm,
  DonorSearchResult,
  EventOption,
  FollowUpForm,
  FollowUpItem,
  PersonalInfoForm,
  SalutationOption,
} from './types';

import {
  AnnouncementCacheRecord,
  buildQuantityOptions,
  createEmptyCauseFields,
  extractArrayPayload,
  getFirstValue,
  getToday,
  inferCurrencyIdFromCode,
  mapEventDetailRecord,
  normalizeApiDate,
  normalizeApiTime,
  parseAmountValue,
  parseStoredUser,
  readAnnouncementCache,
  writeAnnouncementCache,
} from './AnnounceMasterContent.helpers';
import {
  getErrorMessage,
  loadBanksData,
  loadCauseHeadMasterOptions,
  loadDistrictMasterOptions,
  loadEventCauseOptions,
  loadEventDetailsData,
  loadHowToDonateMasterOptions,
  loadOccasionTypeOptions,
  loadOperationAmountValue,
  loadPincodeLocationData,
  loadPurposeOptionsData,
  loadSalutationMasterOptions,
  loadStateMasterOptions,
} from './AnnounceMasterContent.loaders';
import {
  buildCurrentCauseForPayload,
  buildSavePayload,
  getPreferredValidationTab,
  getSaveErrorPayload,
  persistSavedAnnouncement,
  submitSaveRequest,
  validateBeforeSave,
} from './AnnounceMasterContent.save';
import { useAnnounceCauseManagement } from './useAnnounceCauseManagement';
import { useDonorSearchHandlers } from './useDonorSearchHandlers';

const toBooleanFlag = (value: unknown) => {
  const normalizedValue = String(value ?? '')
    .trim()
    .toLowerCase();

  return ['y', 'yes', 'true', '1'].includes(normalizedValue);
};

const extractFirstApiRecord = (
  payload: unknown,
): Record<string, unknown> | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (Array.isArray(payload)) {
    const [first] = payload;
    return first && typeof first === 'object'
      ? (first as Record<string, unknown>)
      : null;
  }

  const record = payload as Record<string, unknown>;
  const nestedKeys = [
    'data',
    'Data',
    'result',
    'Result',
    'table',
    'Table',
    'table1',
    'Table1',
    'item',
    'Item',
  ];

  for (const key of nestedKeys) {
    const nestedValue = record[key];

    if (Array.isArray(nestedValue)) {
      const matchingRecord = nestedValue.find(
        (item): item is Record<string, unknown> =>
          Boolean(item) &&
          typeof item === 'object' &&
          [
            'announce_id',
            'AnnounceID',
            'announcer_name',
            'AnnouncerName',
            'ngcode',
            'NGCode',
          ].some(candidateKey =>
            Object.prototype.hasOwnProperty.call(item, candidateKey),
          ),
      );

      if (matchingRecord) {
        return matchingRecord;
      }

      const [first] = nestedValue;
      if (first && typeof first === 'object') {
        return first as Record<string, unknown>;
      }
    }

    if (nestedValue && typeof nestedValue === 'object') {
      const nestedRecord = nestedValue as Record<string, unknown>;
      if (
        [
          'announce_id',
          'AnnounceID',
          'announcer_name',
          'AnnouncerName',
          'ngcode',
          'NGCode',
        ].some(candidateKey =>
          Object.prototype.hasOwnProperty.call(nestedRecord, candidateKey),
        )
      ) {
        return nestedRecord;
      }
    }
  }

  return record;
};

const extractNestedRecords = (
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown>[] => {
  for (const key of keys) {
    const nestedValue = record[key];

    if (Array.isArray(nestedValue)) {
      return nestedValue.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object',
      );
    }
  }

  return [];
};

const mapApiCauseRecords = (
  responseData: unknown,
  record: Record<string, unknown>,
): AddedAnnounceCause[] => {
  const causeRecords = [
    ...extractNestedRecords(record, [
      'annoucePurposeList',
      'announcePurposeList',
      'purposeList',
      'causeList',
      'addedCauses',
    ]),
    ...extractNestedRecords(
      (responseData && typeof responseData === 'object'
        ? (responseData as Record<string, unknown>)
        : {}) as Record<string, unknown>,
      ['annoucePurposeList', 'announcePurposeList', 'purposeList', 'causeList'],
    ),
  ];

  return causeRecords.map((causeRecord, index) => {
    const causeHeadValue =
      getFirstValue(causeRecord, [
        'Purpose_id',
        'PurposeId',
        'purpose_id',
        'cause_id',
        'CauseId',
        'Purpose',
        'purpose',
        'cause_head',
        'CauseHead',
      ]) ||
      getFirstValue(record, [
        'Purpose_id',
        'PurposeId',
        'purpose_id',
        'cause_id',
        'CauseId',
        'Purpose',
        'purpose',
      ]);
    const yojnaValue =
      getFirstValue(causeRecord, [
        'Yojna_ID',
        'YojnaId',
        'yojna_id',
        'YOJNA_ID',
        'purpose_id',
        'Purpose_id',
        'PurposeId',
      ]) ||
      getFirstValue(record, [
        'Yojna_ID',
        'YojnaId',
        'yojna_id',
        'purpose_id',
        'Purpose_id',
        'PurposeId',
      ]);

    return {
      id: Date.now() + index,
      causeHead: causeHeadValue,
      causeHeadLabel:
        getFirstValue(causeRecord, [
          'Purpose',
          'purpose',
          'purpose_name',
          'PurposeName',
          'cause_head_name',
          'CauseHeadName',
          'cause_name',
          'CauseName',
        ]) ||
        getFirstValue(record, [
          'Purpose',
          'purpose',
          'purpose_name',
          'PurposeName',
          'cause_head_name',
          'CauseHeadName',
          'cause_name',
          'CauseName',
        ]),
      causeHeadPurposeId: causeHeadValue,
      purpose: yojnaValue,
      purposeLabel:
        getFirstValue(causeRecord, [
          'yojna_name',
          'YojnaName',
          'Yojna',
          'purpose_name',
          'PurposeName',
          'cause_name',
          'CauseName',
        ]) ||
        getFirstValue(causeRecord, [
          'Yojna_ID',
          'YojnaId',
          'yojna_id',
          'YOJNA_ID',
        ]) ||
        yojnaValue,
      yojnaId: yojnaValue,
    quantity: Math.max(
      1,
      Number(
        getFirstValue(causeRecord, ['qty', 'Qty', 'quantity', 'Quantity']) || 1,
      ),
    ),
    amount: getFirstValue(causeRecord, ['amount', 'Amount']),
    causeHeadDate: normalizeApiDate(
      getFirstValue(causeRecord, [
        'bhojan_date',
        'BhojanDate',
        'cause_head_date',
        'CauseHeadDate',
      ]),
    ),
    namePlateName:
      getFirstValue(causeRecord, [
        'name_plate',
        'NamePlate',
        'name_plate',
        'name_plate_name',
        'NamePlateName',
        'third_remark',
        'ThirdRemark',
      ]) || getFirstValue(record, ['third_remark', 'ThirdRemark']),
    donorInstruction:
      getFirstValue(causeRecord, [
        'donor_instruction',
        'DonorInstruction',
        'donor_instruction',
        'DonorInstruction',
        'second_remark',
        'SecondRemark',
      ]) || getFirstValue(record, ['second_remark', 'SecondRemark']),
    };
  });
};

const normalizeOptionValue = (value?: string) => value?.trim() || '';

export const AnnounceMasterContent = () => {
  const history = useHistory();
  const queryParams = new URLSearchParams(window.location.search);
  const operation = (queryParams.get('Operation') || 'ADD').toUpperCase();
  const announceIdParam = queryParams.get('AnnounceID') || '0';
  const isViewMode = operation === 'VIEW';
  const eventOperation = operation === 'ADD' ? 'ADD' : 'EDIT';
  const isListingMode = !queryParams.get('Operation');
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
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
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
  const [persistedCurrencyId, setPersistedCurrencyId] = useState('');
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
  const [
    validationErrors,
    setValidationErrors,
  ] = useState<AnnounceValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [isCauseDataHydrating, setIsCauseDataHydrating] = useState(false);
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveRequestPayload, setSaveRequestPayload] = useState<unknown>(null);
  const [saveResultPayload, setSaveResultPayload] = useState<unknown>(null);
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<
    string | null
  >(null);
  const [
    shouldNavigateToListingOnModalClose,
    setShouldNavigateToListingOnModalClose,
  ] = useState(false);
  const [causeIdPendingDelete, setCauseIdPendingDelete] = useState<
    number | null
  >(null);
  const donorSearchValueRef = useRef('');
  const donorSearchTypeRef = useRef<DonorIdentificationForm['donorSearchType']>(
    'donorId',
  );
  const lastDonorSearchKeyRef = useRef('');
  const preservePersonalInfoOnEmptyDonorIdRef = useRef(false);
  const donorSearchRequestIdRef = useRef(0);
  const pincodeRequestIdRef = useRef(0);
  const purposeOptionsRequestIdRef = useRef(0);
  const amountRequestIdRef = useRef(0);
  const purposeOptionsCacheRef = useRef<Record<string, EventOption[]>>({});
  const hydratedCauseSelectionRef = useRef<{
    causeId: string;
    yojnaId: string;
  }>({
    causeId: '',
    yojnaId: '',
  });
  const hydratedEventCodesRef = useRef<{
    eventId: string;
    cityCode: string;
    channelCode: string;
    panditCode: string;
  }>({
    eventId: '',
    cityCode: '',
    channelCode: '',
    panditCode: '',
  });

  const {
    handleAddCause,
    handleCloseDeleteCauseModal,
    handleConfirmDeleteCause,
    handleDeleteCause,
    handleEditCause,
  } = useAnnounceCauseManagement({
    addedCauses,
    announceDetailsForm,
    autoAmount,
    causeHeadOptions,
    causeIdPendingDelete,
    currencyId,
    editingCauseId,
    isViewMode,
    purposeOptions,
    amountRequestIdRef,
    purposeOptionsRequestIdRef,
    setAddedCauses,
    setAnnounceDetailsForm,
    setAutoAmount,
    setCauseIdPendingDelete,
    setCurrencyId,
    setEditingCauseId,
    setIsAmountEditable,
    setPersistedCurrencyId,
    setPurposeOptions,
    setValidationErrors,
  });

  const {
    handleCloseDonorModal,
    handleSelectDonor,
    resetPersonalInfo,
  } = useDonorSearchHandlers({
    donorIdentificationForm,
    donorSearchRequestIdRef,
    donorSearchTypeRef,
    lastDonorSearchKeyRef,
    preservePersonalInfoOnEmptyDonorIdRef,
    setActiveTab,
    setDonorIdentificationForm,
    setDonorOptions,
    setDonorSearchError,
    setIsSearchingDonor,
    setPersonalInfoForm,
    setShowDonorModal,
  });

  const openAnnouncementListing = useCallback(() => {
    history.push(PATH.ANNOUNCE_MASTER);
  }, [history]);

  const openAnnouncementForm = useCallback(
    (nextAnnounceId: string, nextOperation: 'ADD' | 'Edit' | 'View') => {
      history.push(
        `${PATH.ANNOUNCE_MASTER}?AnnounceID=${nextAnnounceId}&Operation=${nextOperation}`,
      );
    },
    [history],
  );

  const hydrateAnnouncementFromCache = useCallback(
    (cachedRecord: AnnouncementCacheRecord) => {
      hydratedCauseSelectionRef.current = {
        causeId: '',
        yojnaId: '',
      };
      hydratedEventCodesRef.current = {
        eventId: '',
        cityCode: '',
        channelCode: '',
        panditCode: '',
      };
      preservePersonalInfoOnEmptyDonorIdRef.current = !cachedRecord.donorIdentificationForm.donorId.trim();
      setDonorIdentificationForm(cachedRecord.donorIdentificationForm);
      setAnnounceEventForm(cachedRecord.announceEventForm);
      setPersonalInfoForm(cachedRecord.personalInfoForm);
      setAnnounceDetailsForm({
        ...cachedRecord.announceDetailsForm,
        ...createEmptyCauseFields(),
      });
      setFollowUpForm(cachedRecord.followUpForm);
      setFollowUpItems(cachedRecord.followUpItems);
      setAddedCauses(cachedRecord.addedCauses);
      setSelectedBankIds(cachedRecord.selectedBankIds);
      setPersistedCurrencyId(
        cachedRecord.currencyId?.trim() ||
          inferCurrencyIdFromCode(cachedRecord.announceEventForm.currency),
      );
      setEditingCauseId(null);
      setAutoAmount('');
      setIsAmountEditable(false);
      setActiveTab('personal');
    },
    [],
  );

  const hydrateAnnouncementFromApi = useCallback(
    (responseData: unknown) => {
      const record = extractFirstApiRecord(responseData);

      if (!record) {
        return false;
      }

      const currentUser = parseStoredUser() as Partial<IUser> & {
        empName?: string;
      };
      const currentCauseRecords = mapApiCauseRecords(responseData, record);
      const primaryCauseRecord = currentCauseRecords[0];
      const nextDonorIdentificationForm: DonorIdentificationForm = {
        ...createInitialDonorIdentificationForm(getToday()),
        announceDate:
          normalizeApiDate(
            getFirstValue(record, [
              'announce_date',
              'AnnounceDate',
              'date',
              'Date',
            ]),
          ) || getToday(),
        donorSearchType: getFirstValue(record, ['ngcode', 'NGCode']).trim()
          ? 'donorId'
          : 'mobileNo',
        donorId: getFirstValue(record, ['ngcode', 'NGCode', 'donor_id']),
        callingSadhak:
          getFirstValue(record, [
            'calling_sadhak_name',
            'CallingSadhakName',
            'receive_id_by',
            'ReceiveIdBy',
          ]) ||
          currentUser.empName ||
          currentUser.username ||
          'Logged-in User (Auto)',
        urgentFollowup: toBooleanFlag(
          getFirstValue(record, [
            'urgent_followup',
            'UrgentFollowup',
            'followup_priority',
            'FollowupPriority',
          ]),
        ),
        followupNotRequired: toBooleanFlag(
          getFirstValue(record, [
            'no_followup_require',
            'NoFollowupRequire',
            'followup_not_required',
          ]),
        ),
      };

      const nextAnnounceEventForm: AnnounceEventForm = {
        ...createInitialAnnounceEventForm(),
        liveType:
          ['L', 'Y'].includes(
            getFirstValue(record, ['live', 'Live']).trim().toUpperCase(),
          ) || toBooleanFlag(getFirstValue(record, ['is_live', 'IsLive']))
            ? 'live'
            : 'nonLive',
        eventName: getFirstValue(record, [
          'event_name',
          'EventName',
          'ename',
          'EName',
        ]),
        eventCause: getFirstValue(record, [
          'event_cause',
          'EventCause',
          'cause_name',
          'CauseName',
        ]),
        eventFromDate: normalizeApiDate(
          getFirstValue(record, [
            'event_from_date',
            'EventFromDate',
            'event_start_date',
            'EVENT_START_DATE',
          ]),
        ),
        eventToDate: normalizeApiDate(
          getFirstValue(record, [
            'event_to_date',
            'EventToDate',
            'event_end_date',
            'EVENT_END_DATE',
          ]),
        ),
        eventFromTime: normalizeApiTime(
          getFirstValue(record, [
            'event_from_time',
            'EventFromTime',
            'event_start_time',
            'EVENT_START_TIME',
          ]),
        ),
        eventToTime: normalizeApiTime(
          getFirstValue(record, [
            'event_to_time',
            'EventToTime',
            'event_end_time',
            'EVENT_END_TIME',
          ]),
        ),
        eventCity: getFirstValue(record, ['event_city', 'EventCity']),
        eventChannel: getFirstValue(record, [
          'event_channel',
          'EventChannel',
          'channel_name',
          'ChannelName',
        ]),
        panditJi: getFirstValue(record, [
          'pandit_ji',
          'PanditJi',
          'pandit_name',
          'PanditName',
        ]),
        eventLocation: getFirstValue(record, [
          'event_location',
          'EventLocation',
          'location',
          'Location',
        ]),
        currency: getFirstValue(record, [
          'currency_id',
          'CurrencyId',
          'currency',
          'Currency',
          'currency_code',
          'CurrencyCode',
        ]),
      };

      const nextPersonalInfoForm: PersonalInfoForm = {
        ...createInitialPersonalInfoForm(),
        salutation: getFirstValue(record, [
          'ashri',
          'Ashri',
          'salutation',
          'Salutation',
          'dshri',
          'DShri',
        ]),
        salutationLocked: Boolean(
          getFirstValue(record, [
            'ashri',
            'Ashri',
            'salutation',
            'Salutation',
            'dshri',
            'DShri',
          ]).trim(),
        ),
        otherSalutation: getFirstValue(record, [
          'ashri_oth',
          'AshriOth',
          'other_salutation',
          'OtherSalutation',
        ]),
        mobileNo: getFirstValue(record, ['mob_no', 'MobileNo']),
        whatsappNo: getFirstValue(record, [
          'dmobilewhatsapp1',
          'DMobileWhatsapp1',
          'whatsapp_no',
          'WhatsappNo',
          'WhatsAppNo',
          'mob_no',
        ]),
        announcerName: getFirstValue(record, [
          'announcer_name',
          'AnnouncerName',
          'donor_name',
          'DonorName',
        ]),
        announceInOtherName:
          toBooleanFlag(
            getFirstValue(record, [
              'announce_in_other_name',
              'AnnounceInOtherName',
              'other_type',
              'OtherType',
            ]),
          ) ||
          Boolean(
            getFirstValue(record, [
              'ashri_oth',
              'AshriOth',
              'other_salutation',
              'OtherSalutation',
              'oth_name',
              'OthName',
              'announced_for_name',
              'AnnouncedForName',
            ]).trim(),
          ),
        announcedForName: getFirstValue(record, [
          'oth_name',
          'OthName',
          'announced_for_name',
          'AnnouncedForName',
        ]),
        relationName: getFirstValue(record, ['relation_name', 'RelationName']),
        pincode: getFirstValue(record, ['pincode', 'PinCode']),
        country:
          getFirstValue(record, [
            'country_name',
            'CountryName',
            'country',
            'country_code',
            'CountryCode',
          ]) || 'India',
        state: getFirstValue(record, [
          'state_code',
          'StateCode',
          'state_name',
          'StateName',
          'state',
        ]),
        stateLocked: Boolean(
          getFirstValue(record, [
            'state_code',
            'StateCode',
            'state_name',
            'StateName',
            'state',
          ]).trim(),
        ),
        district: getFirstValue(record, [
          'district_code',
          'DistrictCode',
          'district_name',
          'DistrictName',
          'district',
          'city_name',
          'CityName',
        ]),
      };

      const nextAnnounceDetailsForm: AnnounceDetailsForm = {
        ...createInitialAnnounceDetailsForm(),
        occasionType: getFirstValue(record, [
          'in_memory_occasion',
          'InMemoryOccasion',
          'occasion_type',
          'OccasionType',
        ]),
        occasionDate: normalizeApiDate(
          getFirstValue(record, [
            'in_memocc_date',
            'InMemoccDate',
            'occasion_date',
            'OccasionDate',
            'bday_date',
          ]),
        ),
        occasionRemark: getFirstValue(record, [
          'remark2',
          'Remark2',
          'occasion_remark',
          'OccasionRemark',
        ]),
        causeHead: getFirstValue(record, [
          'Purpose_id',
          'PurposeId',
          'purpose_id',
          'cause_id',
          'CauseId',
          'purpose',
          'Purpose',
          'cause_head',
          'CauseHead',
        ]),
        causeHeadDate: normalizeApiDate(
          getFirstValue(record, [
            'cause_head_date',
            'CauseHeadDate',
            'bhojan_date',
            'BhojanDate',
            'third_date',
            'ThirdDate',
          ]),
        ),
        namePlateName: getFirstValue(record, [
          'name_plate',
          'NamePlate',
          'third_remark',
          'ThirdRemark',
          'name_plate_name',
          'NamePlateName',
        ]),
        donorInstruction: getFirstValue(record, [
          'donor_instruction',
          'DonorInstruction',
          'second_remark',
          'SecondRemark',
        ]),
        purpose:
          primaryCauseRecord?.purpose ||
          getFirstValue(record, [
            'Yojna_ID',
            'YojnaId',
            'yojna_id',
            'Purpose_id',
            'cause_id',
            'CauseId',
            'purpose_id',
            'PurposeId',
          ]),
        quantity: primaryCauseRecord?.quantity || 1,
        paymentMode: getFirstValue(record, [
          'pay_mode',
          'PayMode',
          'payment_mode',
          'PaymentMode',
        ]),
        howToDonate: getFirstValue(record, [
          'remark1',
          'Remark1',
          'how_to_donate',
          'HowToDonate',
        ]),
        expectedDate: normalizeApiDate(
          getFirstValue(record, [
            'due_date',
            'DueDate',
            'expected_date',
            'ExpectedDate',
            'third_date',
            'ThirdDate',
          ]),
        ),
        expectedTime: normalizeApiTime(
          getFirstValue(record, [
            'due_time',
            'DueTime',
            'expected_time',
            'ExpectedTime',
          ]),
        ),
        isMotivated: toBooleanFlag(
          getFirstValue(record, ['motivated', 'Motivated']),
        ) ||
          Boolean(
            getFirstValue(record, [
              'motivated_amount',
              'MotivatedAmount',
            ]).trim(),
          ),
        motivatedAmount: getFirstValue(record, [
          'motivated_amount',
          'MotivatedAmount',
        ]),
      };

      preservePersonalInfoOnEmptyDonorIdRef.current = !nextDonorIdentificationForm.donorId.trim();
      hydratedEventCodesRef.current = {
        eventId: getFirstValue(record, [
          'ash_event_id',
          'AshEventId',
          'event_ash_id',
        ]),
        cityCode: getFirstValue(record, [
          'bhag_city_code',
          'BhagCityCode',
          'city_code',
          'CityCode',
        ]),
        channelCode: getFirstValue(record, ['channel_code', 'ChannelCode']),
        panditCode: getFirstValue(record, ['pandit_code', 'PanditCode']),
      };
      hydratedCauseSelectionRef.current = {
        causeId: getFirstValue(record, [
          'Purpose_id',
          'PurposeId',
          'purpose_id',
          'cause_id',
          'CauseId',
          'Purpose',
          'purpose',
        ]),
        yojnaId:
          primaryCauseRecord?.yojnaId ||
          primaryCauseRecord?.purpose ||
          getFirstValue(record, [
            'Yojna_ID',
            'yojna_id',
            'YojnaId',
            'Purpose_id',
            'purpose_id',
            'PurposeId',
          ]),
      };
      setDonorIdentificationForm(nextDonorIdentificationForm);
      setAnnounceEventForm(nextAnnounceEventForm);
      setPersonalInfoForm(nextPersonalInfoForm);
      setAnnounceDetailsForm(
        operation === 'ADD'
          ? nextAnnounceDetailsForm
          : {
              ...nextAnnounceDetailsForm,
              ...createEmptyCauseFields(),
            },
      );
      setFollowUpForm({
        ...createInitialFollowUpForm(),
        date: normalizeApiDate(
          getFirstValue(record, ['followup_date', 'FollowupDate']),
        ),
        time: normalizeApiTime(
          getFirstValue(record, [
            'followup_time',
            'FollowupTime',
            'announce_time',
          ]),
        ),
        assignTo: getFirstValue(record, [
          'calling_sadhak_name',
          'CallingSadhakName',
          'assign_to',
          'AssignTo',
        ]),
        status:
          getFirstValue(record, ['followup_status', 'FollowupStatus']) ||
          'Open',
        note: getFirstValue(record, ['last_remark', 'LastRemark', 'note']),
      });
      setFollowUpItems([]);
      setAddedCauses(currentCauseRecords);
      setSelectedBankIds(
        getFirstValue(record, [
          'msg_banks',
          'MsgBanks',
          'online_bank_id',
          'OnlineBankId',
        ]).trim()
          ? getFirstValue(record, [
              'msg_banks',
              'MsgBanks',
              'online_bank_id',
              'OnlineBankId',
            ])
              .split(',')
              .map(value => value.trim())
              .filter(Boolean)
          : [],
      );
      setPersistedCurrencyId(
        getFirstValue(record, ['currency_id', 'CurrencyId']) ||
          inferCurrencyIdFromCode(nextAnnounceEventForm.currency),
      );
      setCurrencyId(
        getFirstValue(record, ['currency_id', 'CurrencyId']) ||
          inferCurrencyIdFromCode(nextAnnounceEventForm.currency),
      );
      setEditingCauseId(null);
      setAutoAmount('');
      setIsAmountEditable(false);
      setActiveTab('personal');

      return true;
    },
    [operation],
  );

  const handleDeleteAnnouncement = useCallback((announcementId: string) => {
    setDeletingAnnouncementId(announcementId);

    try {
      const nextRecords = readAnnouncementCache().filter(
        record => record.announceId !== announcementId,
      );
      writeAnnouncementCache(nextRecords);
    } finally {
      setDeletingAnnouncementId(null);
    }
  }, []);

  const handleDonorIdentificationChange = <
    K extends keyof DonorIdentificationForm
  >(
    field: K,
    value: DonorIdentificationForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    if (field === 'donorSearchType' || field === 'donorId') {
      setDonorSearchError('');
    }

    if (field === 'donorSearchType') {
      donorSearchTypeRef.current = value as DonorIdentificationForm['donorSearchType'];
      donorSearchValueRef.current = '';
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

    if (field === 'donorId') {
      donorSearchValueRef.current = String(value);
      donorSearchTypeRef.current = donorIdentificationForm.donorSearchType;
    }

    setDonorIdentificationForm(current => ({ ...current, [field]: value }));
  };

  const handleAnnounceEventChange = <K extends keyof AnnounceEventForm>(
    field: K,
    value: AnnounceEventForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };

      if (field === 'eventName') {
        delete nextErrors.eventName;
      }

      return nextErrors;
    });

    setAnnounceEventForm(current => ({ ...current, [field]: value }));
  };

  const handlePersonalInfoChange = <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };
      const fieldKey = field as AnnounceValidationField;

      if (fieldKey in nextErrors) {
        delete nextErrors[fieldKey];
      }

      if (field === 'announceInOtherName' && !value) {
        delete nextErrors.announcedForName;
      }

      return nextErrors;
    });

    if (field === 'mobileNo' || field === 'whatsappNo') {
      const normalizedMobile = String(value).replace(/\D/g, '').slice(0, 10);

      setPersonalInfoForm(current => ({
        ...current,
        [field]: normalizedMobile,
      }));
      return;
    }

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
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };

      if (field === 'occasionType') {
        delete nextErrors.occasionType;
      }

      if (field === 'paymentMode') {
        delete nextErrors.paymentMode;
        delete nextErrors.bankSelection;
      }

      if (field === 'howToDonate') {
        delete nextErrors.howToDonate;
      }

      if (field === 'occasionDate') {
        delete nextErrors.occasionDate;
      }

      if (field === 'occasionRemark') {
        delete nextErrors.occasionRemark;
      }

      if (field === 'causeHead') {
        delete nextErrors.causeHead;
        delete nextErrors.causeHeadDate;
        delete nextErrors.purpose;
        delete nextErrors.announceAmount;
      }

      if (field === 'causeHeadDate') {
        delete nextErrors.causeHeadDate;
      }

      if (field === 'purpose') {
        delete nextErrors.purpose;
        delete nextErrors.announceAmount;
      }

    if (field === 'motivatedAmount') {
      delete nextErrors.motivatedAmount;
    }

      if (field === 'isMotivated' && !value) {
        delete nextErrors.motivatedAmount;
      }

      return nextErrors;
    });

    if (field === 'motivatedAmount') {
      const nextMotivatedAmount = String(value);

      setAnnounceDetailsForm(current => ({
        ...current,
        motivatedAmount: nextMotivatedAmount,
        isMotivated: nextMotivatedAmount.trim() ? true : current.isMotivated,
      }));
      return;
    }

    if (field === 'isMotivated') {
      setAnnounceDetailsForm(current => ({
        ...current,
        isMotivated: Boolean(value),
        motivatedAmount: value ? current.motivatedAmount : '',
      }));
      return;
    }

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

    if (field === 'paymentMode') {
      const nextPaymentMode = String(value);

      setAnnounceDetailsForm(current => ({
        ...current,
        paymentMode: nextPaymentMode,
      }));

      if (['Online', 'Pay-In-Slip'].includes(nextPaymentMode)) {
        setActiveTab('bankDetails');
      } else if (activeTab === 'bankDetails') {
        setActiveTab('followUp');
      }

      return;
    }

    setAnnounceDetailsForm(current => ({ ...current, [field]: value }));
  };

  const handleAmountChange = (value: string) => {
    if (isViewMode) {
      return;
    }

    const normalizedValue = value.replace(/[^\d.]/g, '');
    setValidationErrors(current => {
      const nextErrors = { ...current };
      delete nextErrors.announceAmount;
      return nextErrors;
    });
    setAutoAmount(normalizedValue);
  };

  const handleFollowUpChange = <K extends keyof FollowUpForm>(
    field: K,
    value: FollowUpForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    setFollowUpForm(current => ({ ...current, [field]: value }));
  };

  const handleQuantityChange = (nextQuantity: number) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };
      delete nextErrors.announceAmount;
      return nextErrors;
    });
    setAnnounceDetailsForm(current => ({
      ...current,
      quantity: Math.max(1, Number.isFinite(nextQuantity) ? nextQuantity : 1),
    }));
  };

  const handleToggleBank = (bankId: string) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };
      delete nextErrors.bankSelection;
      return nextErrors;
    });
    setSelectedBankIds(current =>
      current.includes(bankId)
        ? current.filter(id => id !== bankId)
        : [...current, bankId],
    );
  };

  const handleAddFollowUp = () => {
    if (isViewMode) {
      return;
    }

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
    if (isViewMode) {
      return;
    }

    setFollowUpItems(current => current.filter(item => item.id !== id));
  };

  const resetEventSelectionFields = (
    liveType: AnnounceEventForm['liveType'],
    eventName = '',
  ) => {
    setSelectedEventId(null);
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
      currency: eventName.trim() ? current.currency || 'INR' : '',
    }));
  };

  useEffect(() => {
    const loadEventCauses = async () => {
      try {
        setEventCauseOptions(await loadEventCauseOptions(eventOperation));
      } catch (error) {
        setEventCauseOptions([]);
      }
    };

    void loadEventCauses();
  }, [eventOperation]);

  useEffect(() => {
    const loadEventDetails = async () => {
      setEventLoading(true);
      setEventError('');

      try {
        const {
          eventChannelOptions: nextEventChannelOptions,
          eventCityOptions: nextEventCityOptions,
          eventOptions: nextEventOptions,
          panditOptions: nextPanditOptions,
          records,
        } = await loadEventDetailsData({
          eventOperation,
          isLive: announceEventForm.liveType === 'live',
        });

        setEventDetails(records);
        setEventOptions(nextEventOptions);
        setEventCityOptions(nextEventCityOptions);
        setEventChannelOptions(nextEventChannelOptions);
        setPanditOptions(nextPanditOptions);

        const matchedRecord = records.find(
          record => record.eventName === announceEventForm.eventName,
        );

        if (!matchedRecord && operation === 'ADD') {
          resetEventSelectionFields(announceEventForm.liveType);
        }
      } catch (error) {
        setEventDetails([]);
        setEventOptions([]);
        setEventCityOptions([]);
        setEventChannelOptions([]);
        setPanditOptions([]);
        if (operation === 'ADD' || !announceEventForm.eventName.trim()) {
          resetEventSelectionFields(announceEventForm.liveType);
        }
        setEventError(getErrorMessage(error, 'Failed to load event list.'));
      } finally {
        setEventLoading(false);
      }
    };

    void loadEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announceEventForm.liveType, eventOperation]);

  useEffect(() => {
    if (!announceEventForm.eventName) {
      setSelectedEventId(null);
      resetEventSelectionFields(announceEventForm.liveType);
      return;
    }

    const selectedEvent = eventDetails.find(
      record => record.eventName === announceEventForm.eventName,
    );

    if (!selectedEvent) {
      setSelectedEventId(null);
      return;
    }

    setSelectedEventId(selectedEvent.id || null);

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
    if (eventDetails.length === 0) {
      return;
    }

    const hydratedCodes = hydratedEventCodesRef.current;
    const matchedEvent =
      eventDetails.find(record => record.id === hydratedCodes.eventId) ||
      eventDetails.find(
        record =>
          record.channelCode === hydratedCodes.channelCode ||
          record.cityCode === hydratedCodes.cityCode ||
          record.panditCode === hydratedCodes.panditCode,
      );

    if (!matchedEvent) {
      return;
    }

    setSelectedEventId(current => current || matchedEvent.id || null);
    setAnnounceEventForm(current => ({
      ...current,
      eventName: current.eventName || matchedEvent.eventName,
      eventCause: current.eventCause || matchedEvent.eventCause,
      eventFromDate: current.eventFromDate || matchedEvent.eventFromDate,
      eventToDate: current.eventToDate || matchedEvent.eventToDate,
      eventFromTime: current.eventFromTime || matchedEvent.eventFromTime,
      eventToTime: current.eventToTime || matchedEvent.eventToTime,
      eventCity:
        current.eventCity === hydratedCodes.cityCode || !current.eventCity
          ? matchedEvent.eventCity
          : current.eventCity,
      eventChannel:
        current.eventChannel === hydratedCodes.channelCode ||
        !current.eventChannel
          ? matchedEvent.eventChannel
          : current.eventChannel,
      panditJi:
        current.panditJi === hydratedCodes.panditCode || !current.panditJi
          ? matchedEvent.panditJi
          : current.panditJi,
      eventLocation: current.eventLocation || matchedEvent.eventLocation,
      currency: current.currency || 'INR',
    }));
  }, [eventDetails]);

  useEffect(() => {
    const loadOccasionTypes = async () => {
      try {
        setOccasionTypeOptions(await loadOccasionTypeOptions());
      } catch (error) {
        setOccasionTypeOptions([]);
      }
    };

    void loadOccasionTypes();
  }, []);

  useEffect(() => {
    const loadHowToDonateOptions = async () => {
      try {
        setHowToDonateOptions(await loadHowToDonateMasterOptions());
      } catch (error) {
        setHowToDonateOptions([]);
      }
    };

    void loadHowToDonateOptions();
  }, []);

  useEffect(() => {
    const loadStateOptions = async () => {
      try {
        setStateOptions(await loadStateMasterOptions());
      } catch (error) {
        setStateOptions([]);
      }
    };

    void loadStateOptions();
  }, []);

  useEffect(() => {
    if (!personalInfoForm.state.trim() || stateOptions.length === 0) {
      return;
    }

    const matchedState = stateOptions.find(
      option =>
        option.value === personalInfoForm.state ||
        option.label === personalInfoForm.state ||
        option.stateCode?.trim() === personalInfoForm.state.trim(),
    );

    if (!matchedState || matchedState.value === personalInfoForm.state) {
      return;
    }

    setPersonalInfoForm(current => ({
      ...current,
      state: matchedState.value,
    }));
  }, [personalInfoForm.state, stateOptions]);

  useEffect(() => {
    const selectedState = stateOptions.find(
      option =>
        option.value === personalInfoForm.state ||
        option.label === personalInfoForm.state ||
        option.stateCode?.trim() === personalInfoForm.state.trim(),
    );
    const stateCode = selectedState?.stateCode?.trim();

    if (!stateCode) {
      setDistrictOptions([]);
      return;
    }

    const loadDistrictOptions = async () => {
      try {
        setDistrictOptions(await loadDistrictMasterOptions(stateCode));
      } catch (error) {
        setDistrictOptions([]);
      }
    };

    void loadDistrictOptions();
  }, [personalInfoForm.state, stateOptions]);

  useEffect(() => {
    if (!personalInfoForm.district.trim() || districtOptions.length === 0) {
      return;
    }

    const matchedDistrict = districtOptions.find(
      option =>
        option.value === personalInfoForm.district ||
        option.label === personalInfoForm.district ||
        option.districtCode?.trim() === personalInfoForm.district.trim(),
    );

    if (
      !matchedDistrict ||
      matchedDistrict.value === personalInfoForm.district
    ) {
      return;
    }

    setPersonalInfoForm(current => ({
      ...current,
      district: matchedDistrict.value,
    }));
  }, [districtOptions, personalInfoForm.district]);

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
          if (requestId !== pincodeRequestIdRef.current) {
            return;
          }

          const { location, matchedState } = await loadPincodeLocationData({
            normalizedPincode,
            stateOptions,
          });

          if (requestId !== pincodeRequestIdRef.current) {
            return;
          }

          if (!location) {
            setIsPincodeLocationLocked(false);
            return;
          }

          setPersonalInfoForm(current => ({
            ...current,
            country: location.country.trim() || 'India',
            state:
              matchedState?.value || location.state.trim() || current.state,
            district: location.district.trim() || current.district,
          }));
          setValidationErrors(current => {
            const nextErrors = { ...current };

            if (location.country.trim() || 'India') {
              delete nextErrors.country;
            }

            if (matchedState?.value || location.state.trim()) {
              delete nextErrors.state;
            }

            if (location.district.trim()) {
              delete nextErrors.district;
            }

            return nextErrors;
          });
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
        setCauseHeadOptions(await loadCauseHeadMasterOptions());
      } catch (error) {
        setCauseHeadOptions([]);
      }
    };

    void loadCauseHeadOptions();
  }, []);

  useEffect(() => {
    if (
      operation !== 'ADD' ||
      causeHeadOptions.length === 0 ||
      announceDetailsForm.causeHead.trim()
    ) {
      return;
    }

    const hydratedCauseId = hydratedCauseSelectionRef.current.causeId.trim();

    if (!hydratedCauseId) {
      return;
    }

    const matchedCauseHead = causeHeadOptions.find(
      option =>
        option.value === hydratedCauseId ||
        option.purposeId?.trim() === hydratedCauseId,
    );

    if (!matchedCauseHead) {
      return;
    }

    setAnnounceDetailsForm(current => ({
      ...current,
      causeHead: matchedCauseHead.value,
    }));
  }, [announceDetailsForm.causeHead, causeHeadOptions, operation]);

  useEffect(() => {
    if (
      !announceDetailsForm.causeHead.trim() ||
      causeHeadOptions.length === 0
    ) {
      return;
    }

    const matchedCauseHead = causeHeadOptions.find(
      option =>
        option.value === announceDetailsForm.causeHead ||
        option.purposeId?.trim() === announceDetailsForm.causeHead.trim(),
    );

    if (
      !matchedCauseHead ||
      matchedCauseHead.value === announceDetailsForm.causeHead
    ) {
      return;
    }

    setAnnounceDetailsForm(current => ({
      ...current,
      causeHead: matchedCauseHead.value,
    }));
  }, [announceDetailsForm.causeHead, causeHeadOptions]);

  useEffect(() => {
    const selectedCauseHead = causeHeadOptions.find(
      option =>
        option.value === announceDetailsForm.causeHead ||
        option.purposeId?.trim() === announceDetailsForm.causeHead.trim(),
    );
    const purposeId =
      selectedCauseHead?.value || announceDetailsForm.causeHead.trim();

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
        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        const {
          currencyId: nextCurrencyId,
          purposeOptions: nextPurposeOptions,
        } = await loadPurposeOptionsData(purposeId);

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
        setPersistedCurrencyId(nextCurrencyId);

        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        setPurposeOptions(nextPurposeOptions);
        setIsAmountEditable(false);
        setAnnounceDetailsForm(current => {
          const hydratedYojnaId = hydratedCauseSelectionRef.current.yojnaId.trim();
          const matchedPurpose = hydratedYojnaId
            ? nextPurposeOptions.find(
                option =>
                  option.value === hydratedYojnaId ||
                  option.yojnaId?.trim() === hydratedYojnaId,
              )
            : null;

          if (matchedPurpose && current.purpose !== matchedPurpose.value) {
            return {
              ...current,
              purpose: matchedPurpose.value,
              quantity: Math.max(
                1,
                Number(
                  matchedPurpose.qtyValue?.trim() || current.quantity || 1,
                ),
              ),
            };
          }

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
    if (addedCauses.length === 0 || causeHeadOptions.length === 0) {
      setIsCauseDataHydrating(false);
      return;
    }

    let isCancelled = false;
    setIsCauseDataHydrating(true);

    const hydrateAddedCauseLabels = async () => {
      const loadPurposeOptionsForCauseHead = async (purposeId: string) => {
        const normalizedPurposeId = normalizeOptionValue(purposeId);

        if (!normalizedPurposeId) {
          return [] as EventOption[];
        }

        const cachedOptions = purposeOptionsCacheRef.current[normalizedPurposeId];

        if (cachedOptions) {
          return cachedOptions;
        }

        const { purposeOptions: nextPurposeOptions } =
          await loadPurposeOptionsData(normalizedPurposeId);

        purposeOptionsCacheRef.current[normalizedPurposeId] = nextPurposeOptions;

        return nextPurposeOptions;
      };

      const nextCauses = await Promise.all(
        addedCauses.map(async cause => {
          const normalizedCauseHead = normalizeOptionValue(
            cause.causeHeadPurposeId || cause.causeHead,
          );
          const normalizedYojnaId = normalizeOptionValue(
            cause.yojnaId || cause.purpose,
          );
          const matchedCauseHead = causeHeadOptions.find(
            option =>
              normalizeOptionValue(option.value) === normalizedCauseHead ||
              normalizeOptionValue(option.purposeId) === normalizedCauseHead ||
              normalizeOptionValue(option.value) ===
                normalizeOptionValue(cause.causeHead) ||
              normalizeOptionValue(option.purposeId) ===
                normalizeOptionValue(cause.causeHead),
          );
          const purposeIdForLookup =
            normalizeOptionValue(matchedCauseHead?.purposeId) ||
            normalizeOptionValue(matchedCauseHead?.value) ||
            normalizedCauseHead;

          let resolvedCauseHeadOption = matchedCauseHead;
          let purposeLabel = cause.purposeLabel;
          let purposeValue = normalizedYojnaId;
          let yojnaId = normalizedYojnaId;

          try {
            let nextPurposeOptions = await loadPurposeOptionsForCauseHead(
              purposeIdForLookup,
            );
            let matchedPurpose = nextPurposeOptions.find(
              option =>
                normalizeOptionValue(option.value) === normalizedYojnaId ||
                normalizeOptionValue(option.yojnaId) === normalizedYojnaId ||
                normalizeOptionValue(option.value) ===
                  normalizeOptionValue(cause.purpose) ||
                normalizeOptionValue(option.yojnaId) ===
                  normalizeOptionValue(cause.purpose),
            );

            if (!matchedPurpose && normalizedYojnaId) {
              for (const causeHeadOption of causeHeadOptions) {
                const candidatePurposeId =
                  normalizeOptionValue(causeHeadOption.purposeId) ||
                  normalizeOptionValue(causeHeadOption.value);

                if (
                  !candidatePurposeId ||
                  candidatePurposeId === purposeIdForLookup
                ) {
                  continue;
                }

                const candidatePurposeOptions =
                  await loadPurposeOptionsForCauseHead(candidatePurposeId);
                const candidateMatchedPurpose = candidatePurposeOptions.find(
                  option =>
                    normalizeOptionValue(option.value) === normalizedYojnaId ||
                    normalizeOptionValue(option.yojnaId) === normalizedYojnaId,
                );

                if (candidateMatchedPurpose) {
                  resolvedCauseHeadOption = causeHeadOption;
                  nextPurposeOptions = candidatePurposeOptions;
                  matchedPurpose = candidateMatchedPurpose;
                  break;
                }
              }
            }

            if (matchedPurpose) {
              purposeLabel = matchedPurpose.label;
              purposeValue =
                normalizeOptionValue(matchedPurpose.value) || normalizedYojnaId;
              yojnaId =
                normalizeOptionValue(matchedPurpose.yojnaId) || purposeValue;
            }
          } catch {
            // Keep existing cause values if purpose label hydration fails.
          }

          return {
            ...cause,
            causeHead:
              normalizeOptionValue(resolvedCauseHeadOption?.value) ||
              normalizedCauseHead,
            causeHeadLabel:
              resolvedCauseHeadOption?.label ||
              cause.causeHeadLabel ||
              normalizedCauseHead,
            causeHeadPurposeId:
              normalizeOptionValue(resolvedCauseHeadOption?.purposeId) ||
              normalizeOptionValue(resolvedCauseHeadOption?.value) ||
              normalizedCauseHead,
            purpose: purposeValue,
            purposeLabel,
            yojnaId,
          };
        }),
      );

      if (isCancelled) {
        return;
      }

      const hasChanged = nextCauses.some((cause, index) => {
        const currentCause = addedCauses[index];
        return (
          cause.causeHead !== currentCause.causeHead ||
          cause.causeHeadLabel !== currentCause.causeHeadLabel ||
          cause.causeHeadPurposeId !== currentCause.causeHeadPurposeId ||
          cause.purpose !== currentCause.purpose ||
          cause.purposeLabel !== currentCause.purposeLabel ||
          cause.yojnaId !== currentCause.yojnaId
        );
      });

      if (hasChanged) {
        setAddedCauses(nextCauses);
      }

      setIsCauseDataHydrating(false);
    };

    void hydrateAddedCauseLabels();

    return () => {
      isCancelled = true;
    };
  }, [addedCauses, causeHeadOptions, setAddedCauses]);

  useEffect(() => {
    const quantity = Math.max(1, Number(announceDetailsForm.quantity) || 1);
    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === announceDetailsForm.causeHead,
    );
    const selectedCauseHeadPurposeId =
      selectedCauseHead?.purposeId?.trim() ||
      announceDetailsForm.causeHead.trim();
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
      setAutoAmount(
        current =>
          current ||
          (selectedPurposeAmount > 0 ? String(selectedPurposeAmount) : ''),
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
        const nextAmount = await loadOperationAmountValue({
          currencyId,
          quantity,
        });

        if (requestId !== amountRequestIdRef.current) {
          return;
        }

        setAutoAmount(nextAmount);
      } catch (error) {
        if (requestId !== amountRequestIdRef.current) {
          return;
        }

        setAutoAmount('');
      }
    };

    void loadOperationAmount();
  }, [
    announceDetailsForm.causeHead,
    announceDetailsForm.purpose,
    announceDetailsForm.quantity,
    causeHeadOptions,
    currencyId,
    purposeOptions,
  ]);

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
      try {
        setSalutations(await loadSalutationMasterOptions());
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

      const { banks: nextBanks, errorMessage } = await loadBanksData();
      setBanks(nextBanks);
      setBankError(errorMessage);
      setBankLoading(false);
    };

    void loadBanks();
  }, []);

  const handleReset = () => {
    if (isViewMode) {
      return;
    }

    hydratedCauseSelectionRef.current = {
      causeId: '',
      yojnaId: '',
    };
    hydratedEventCodesRef.current = {
      eventId: '',
      cityCode: '',
      channelCode: '',
      panditCode: '',
    };
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
    setValidationErrors({});
    setShowSaveResultModal(false);
    setSaveRequestPayload(null);
    setSaveResultPayload(null);
    setIsSaving(false);
    setCauseIdPendingDelete(null);
    setAddedCauses([]);
    setEditingCauseId(null);
    setCurrencyId('');
    setPersistedCurrencyId('');
    setIsPincodeLocationLocked(false);
    lastDonorSearchKeyRef.current = '';
    donorSearchRequestIdRef.current += 1;
    pincodeRequestIdRef.current += 1;
  };

  const handleCancel = useCallback(() => {
    if (window.history.length > 1) {
      history.goBack();
      return;
    }

    openAnnouncementListing();
  }, [history, openAnnouncementListing]);

  useEffect(() => {
    if (isListingMode) {
      setIsEditDataLoading(false);
      return;
    }

    if (announceIdParam === '0') {
      setIsEditDataLoading(false);
      if (operation === 'ADD') {
        hydratedCauseSelectionRef.current = {
          causeId: '',
          yojnaId: '',
        };
        hydratedEventCodesRef.current = {
          eventId: '',
          cityCode: '',
          channelCode: '',
          panditCode: '',
        };
        setDonorIdentificationForm(
          createInitialDonorIdentificationForm(getToday()),
        );
        setAnnounceEventForm(createInitialAnnounceEventForm());
        setPersonalInfoForm(createInitialPersonalInfoForm());
        setAnnounceDetailsForm(createInitialAnnounceDetailsForm());
        setFollowUpForm(createInitialFollowUpForm());
        setFollowUpItems([]);
        setSelectedBankIds([]);
        setAddedCauses([]);
        setEditingCauseId(null);
        setCurrencyId('');
        setPersistedCurrencyId('');
        setAutoAmount('');
        setIsAmountEditable(false);
        setActiveTab('personal');
      }
      return;
    }

    let isMounted = true;
    setIsEditDataLoading(true);

    const loadAnnouncementDetails = async () => {
      const currentUser = parseStoredUser() as Partial<IUser> & {
        DataFlag?: string;
        dataFlag?: string;
        Data_Flag?: string;
      };
      const dataFlag =
        currentUser.DataFlag ||
        currentUser.dataFlag ||
        currentUser.Data_Flag ||
        'GANGOTRI';

      try {
        const response = await axiosInstance.get(
          masterApiPaths.getAnnounceDetailsById,
          {
            params: {
              announceId: Number(announceIdParam || 0) || null,
              dataFlag,
            },
            headers: masterApiHeaders(),
          },
        );

        if (!isMounted) {
          return;
        }

        const hydrated = hydrateAnnouncementFromApi(response.data);

        if (hydrated) {
          setIsEditDataLoading(false);
          return;
        }
      } catch (error) {
        // Cache fallback below keeps edit/view usable when API hydration fails.
      }

      if (!isMounted) {
        return;
      }

      const cachedRecord = readAnnouncementCache().find(
        record => record.announceId === announceIdParam,
      );

      if (cachedRecord) {
        hydrateAnnouncementFromCache(cachedRecord);
      }

      if (isMounted) {
        setIsEditDataLoading(false);
      }
    };

    void loadAnnouncementDetails();

    return () => {
      isMounted = false;
    };
  }, [
    announceIdParam,
    hydrateAnnouncementFromApi,
    hydrateAnnouncementFromCache,
    isListingMode,
    operation,
  ]);

  const selectedPurposeOption = purposeOptions.find(
    option => option.value === announceDetailsForm.purpose,
  );
  const selectedCauseHeadOption = causeHeadOptions.find(
    option =>
      option.value === announceDetailsForm.causeHead ||
      option.purposeId?.trim() === announceDetailsForm.causeHead.trim(),
  );
  const selectedHowToDonateOption = howToDonateOptions.find(
    option => option.value === announceDetailsForm.howToDonate,
  );
  const selectedStateOption = stateOptions.find(
    option =>
      option.value === personalInfoForm.state ||
      option.label === personalInfoForm.state ||
      option.stateCode?.trim() === personalInfoForm.state.trim(),
  );
  const selectedDistrictOption = districtOptions.find(
    option =>
      option.value === personalInfoForm.district ||
      option.label === personalInfoForm.district ||
      option.districtCode?.trim() === personalInfoForm.district.trim(),
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
    selectedPurposeOption?.yojnaId?.trim() ||
    announceDetailsForm.purpose.trim();
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

    if (shouldNavigateToListingOnModalClose) {
      setShouldNavigateToListingOnModalClose(false);
      openAnnouncementListing();
    }
  };

  const handleSave = async () => {
    if (isViewMode) {
      return;
    }

    const currentUser = parseStoredUser();
    const announceThroughParam = queryParams.get('ATHROUGH');
    const queryStringBid = queryParams.get('BID');
    const queryStringCrtObjectId =
      queryParams.get('crtObjectId') || queryParams.get('crtobjectid');
    const queryStringDReason = queryParams.get('DReason');
    const queryStringThisCallId = queryParams.get('THISCALLID');
    const currentCauseForPayload = buildCurrentCauseForPayload({
      announceDetailsForm,
      autoAmount,
      isCauseReadyToAdd,
      selectedCauseHeadOption,
      selectedPurposeOption,
    });
    const causesForPayload = currentCauseForPayload
      ? [...addedCauses, currentCauseForPayload]
      : addedCauses;
    const announceAmount = causesForPayload.reduce(
      (total, cause) => total + parseAmountValue(cause.amount),
      0,
    );
    const nextErrors = validateBeforeSave({
      announceAmount,
      announceDetailsForm,
      announceEventForm,
      causesForPayload,
      donorIdentificationForm,
      isAmountEditable,
      operation: operation as 'ADD' | 'EDIT' | 'VIEW',
      personalInfoForm,
      selectedBankIds,
    });

    setValidationErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const preferredTab = getPreferredValidationTab({
        activeTab,
        errors: nextErrors,
      });

      if (preferredTab && preferredTab !== activeTab) {
        setActiveTab(preferredTab);
      }

      return;
    }

    const employeeCode = Number(currentUser.empNum || 0) || null;
    const donorSearchValue = donorSearchValueRef.current.trim();
    const donorSearchType = donorSearchTypeRef.current;
    const callingSadhakId = employeeCode;
    const callingSadhakName =
      (currentUser as Partial<IUser> & { empName?: string }).empName ||
      currentUser.username ||
      null;
    const resolvedCurrencyId =
      currencyId.trim() ||
      persistedCurrencyId.trim() ||
      inferCurrencyIdFromCode(announceEventForm.currency);
    const { payload, resolvedCurrencyId: nextCurrencyId } = buildSavePayload({
      addedCauses,
      announceDetailsForm,
      announceEventForm,
      announceIdParam,
      announceThroughParam,
      autoAmount,
      callingSadhakId,
      callingSadhakName,
      currentUser,
      donorIdentificationForm,
      donorSearchType,
      donorSearchValue,
      followUpForm,
      isCauseReadyToAdd,
      persistedCurrencyId,
      personalInfoForm,
      queryStringBid,
      queryStringCrtObjectId,
      queryStringDReason,
      queryStringThisCallId,
      resolvedCurrencyId,
      selectedBankIds,
      selectedCauseHeadOption,
      selectedDistrictOption,
      selectedEventChannelDetail,
      selectedEventCityDetail,
      selectedEventDetail,
      selectedEventId,
      selectedEventPanditDetail,
      selectedHowToDonateOption,
      selectedPurposeOption,
      selectedStateOption,
    });

    setIsSaving(true);
    setSaveRequestPayload(payload);

    try {
      const response = await submitSaveRequest({
        operation: operation as 'ADD' | 'EDIT' | 'VIEW',
        payload,
      });

      persistSavedAnnouncement({
        addedCauses: causesForPayload,
        announceDetailsForm,
        announceEventForm,
        announceIdParam,
        cachedRecords: readAnnouncementCache(),
        currencyId: nextCurrencyId,
        donorIdentificationForm,
        followUpForm,
        followUpItems,
        personalInfoForm,
        responseData: response.data,
        selectedBankIds,
      });

      setSaveResultPayload(response.data);
      setShouldNavigateToListingOnModalClose(true);
      setShowSaveResultModal(true);
    } catch (error) {
      setSaveResultPayload(getSaveErrorPayload(error));
      setShouldNavigateToListingOnModalClose(false);
      setShowSaveResultModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isListingMode) {
    return (
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <AnnounceMasterNav />

        <div className="post d-flex flex-column-fluid" id="kt_post">
          <div id="kt_content_container" className="container-fluid py-6">
            <AnnouncementListing
              deletingId={deletingAnnouncementId}
              onAdd={() => openAnnouncementForm('0', 'ADD')}
              onEdit={announceId => openAnnouncementForm(announceId, 'Edit')}
              onView={announceId => openAnnouncementForm(announceId, 'View')}
              onDelete={handleDeleteAnnouncement}
            />
          </div>
        </div>
      </div>
    );
  }

  const shouldShowEditLoader =
    operation !== 'ADD' && (isEditDataLoading || isCauseDataHydrating);

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      <AnnounceMasterNav />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-6">
          <div className="row g-6 justify-content-center">
            <div className="col-12">
              <AnnouncerPersonalDetailsCard
                activeTab={activeTab}
                operation={operation as 'ADD' | 'EDIT' | 'VIEW'}
                announceId={announceIdParam}
                donorIdentificationForm={donorIdentificationForm}
                announceEventForm={announceEventForm}
                personalInfoForm={personalInfoForm}
                salutations={salutations}
                stateOptions={stateOptions}
                districtOptions={districtOptions}
                donorOptions={donorOptions}
                isSearchingDonor={isSearchingDonor}
                donorSearchError={donorSearchError}
                showDonorModal={showDonorModal}
                isPincodeLocationLocked={isPincodeLocationLocked}
                validationErrors={validationErrors}
                announceDetailsForm={announceDetailsForm}
                addedCauses={addedCauses}
                editingCauseId={editingCauseId}
                eventOptions={eventOptions}
                eventCauseOptions={eventCauseOptions}
                eventCityOptions={eventCityOptions}
                eventChannelOptions={eventChannelOptions}
                panditOptions={panditOptions}
                eventLoading={eventLoading}
                eventError={eventError}
                occasionTypeOptions={occasionTypeOptions}
                causeHeadOptions={causeHeadOptions}
                purposeOptions={availablePurposeOptions}
                howToDonateOptions={howToDonateOptions}
                banks={banks}
                bankLoading={bankLoading}
                bankError={bankError}
                selectedBankIds={selectedBankIds}
                amount={autoAmount}
                isAmountEditable={isAmountEditable}
                quantityControlMode={quantityControlMode}
                quantityOptions={quantityOptions}
                isAddCauseDisabled={!isCauseReadyToAdd}
                isSaving={isSaving}
                isTabContentLoading={shouldShowEditLoader}
                isViewMode={isViewMode}
                onAmountChange={handleAmountChange}
                onAddCause={handleAddCause}
                onEditCause={handleEditCause}
                onDeleteCause={handleDeleteCause}
                onSave={handleSave}
                onSelectDonor={handleSelectDonor}
                onCloseDonorModal={handleCloseDonorModal}
                followUpForm={followUpForm}
                followUpItems={followUpItems}
                onTabChange={setActiveTab}
                onDonorIdentificationChange={handleDonorIdentificationChange}
                onAnnounceEventChange={handleAnnounceEventChange}
                onPersonalInfoChange={handlePersonalInfoChange}
                onAnnounceDetailsChange={handleAnnounceDetailsChange}
                onFollowUpChange={handleFollowUpChange}
                onQuantityChange={handleQuantityChange}
                onToggleBank={handleToggleBank}
                onAddFollowUp={handleAddFollowUp}
                onRemoveFollowUp={handleRemoveFollowUp}
                onReset={handleReset}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </div>

      <SaveResultModal
        open={showSaveResultModal}
        requestPayload={saveRequestPayload}
        resultPayload={saveResultPayload}
        onClose={handleCloseSaveResultModal}
      />

      <DeleteCauseModal
        open={causeIdPendingDelete !== null}
        onClose={handleCloseDeleteCauseModal}
        onConfirm={handleConfirmDeleteCause}
      />
    </div>
  );
};
