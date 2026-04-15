import axios from 'axios';
import { ContentTypes } from 'src/constants/content';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import axiosInstance from 'src/redux/interceptor';
import {
  AnnouncementCacheRecord,
  createEmptyCauseFields,
  extractAnnouncementId,
  formatDateForApi,
  getCurrentTimeValue,
  inferCurrencyIdFromCode,
  isValidDateValue,
  normalizeApiTime,
  parseAmountValue,
  toDigitsNumber,
  toNullableText,
  writeAnnouncementCache,
} from './AnnounceMasterContent.helpers';
import {
  AddedAnnounceCause,
  AnnounceDetailsForm,
  AnnounceEventForm,
  AnnounceValidationErrors,
  AnnounceValidationField,
  AnnouncerTabKey,
  EventOption,
  FollowUpForm,
  FollowUpItem,
  PersonalInfoForm,
} from './types';

type SaveOperation = 'ADD' | 'EDIT' | 'VIEW';

const getTabForFieldError = (
  field: AnnounceValidationField,
): AnnouncerTabKey => {
  switch (field) {
    case 'salutation':
    case 'announcerName':
    case 'announcedForName':
    case 'mobileNo':
    case 'pincode':
    case 'country':
    case 'state':
    case 'district':
      return 'personal';
    case 'eventName':
      return 'announceEvent';
    case 'bankSelection':
      return 'bankDetails';
    default:
      return 'announceDetails';
  }
};

const getPreferredValidationTab = ({
  activeTab,
  errors,
}: {
  activeTab: AnnouncerTabKey;
  errors: AnnounceValidationErrors;
}): AnnouncerTabKey | null => {
  const errorFields = Object.keys(errors) as AnnounceValidationField[];

  if (errorFields.length === 0) {
    return null;
  }

  const currentTabHasError = errorFields.some(
    field =>
      field !== 'announceDate' && getTabForFieldError(field) === activeTab,
  );

  if (currentTabHasError) {
    return activeTab;
  }

  const firstTabErrorField = errorFields.find(
    field => field !== 'announceDate',
  );
  return firstTabErrorField ? getTabForFieldError(firstTabErrorField) : null;
};

const validateBeforeSave = ({
  announceAmount,
  announceDetailsForm,
  announceEventForm,
  causesForPayload,
  donorIdentificationForm,
  isAmountEditable,
  operation,
  personalInfoForm,
  selectedBankIds,
}: {
  announceAmount: number;
  announceDetailsForm: AnnounceDetailsForm;
  announceEventForm: AnnounceEventForm;
  causesForPayload: AddedAnnounceCause[];
  donorIdentificationForm: { announceDate: string };
  isAmountEditable: boolean;
  operation: SaveOperation;
  personalInfoForm: PersonalInfoForm;
  selectedBankIds: string[];
}) => {
  const nextErrors: AnnounceValidationErrors = {};

  if (!isValidDateValue(donorIdentificationForm.announceDate)) {
    nextErrors.announceDate = 'Announce Date Not Valid.';
  }

  if (!announceDetailsForm.paymentMode.trim()) {
    nextErrors.paymentMode = 'Please Fill Pay Mode.';
  }

  if (!personalInfoForm.announcerName.trim()) {
    nextErrors.announcerName = 'Please Fill Announcer Name';
  }

  if (
    personalInfoForm.announceInOtherName &&
    !personalInfoForm.announcedForName.trim()
  ) {
    nextErrors.announcedForName = 'Please Fill Announcer In The Name Of';
  }

  if (!personalInfoForm.salutation.trim()) {
    nextErrors.salutation = 'Please Select Salutation.';
  }

  if (operation !== 'EDIT' && !announceEventForm.eventName.trim()) {
    nextErrors.eventName = 'Please Select Event Name.';
  }

  if (!personalInfoForm.country.trim()) {
    nextErrors.country = 'Please select country.';
  }

  if (!personalInfoForm.pincode.trim()) {
    nextErrors.pincode = 'Please enter pincode.';
  }

  if (!personalInfoForm.state.trim()) {
    nextErrors.state = 'Please select state.';
  }

  if (!personalInfoForm.district.trim()) {
    nextErrors.district = 'Please select district.';
  }

  if (!personalInfoForm.mobileNo.trim()) {
    nextErrors.mobileNo = 'Please Enter Mobile No.';
  } else if (personalInfoForm.mobileNo.trim().length !== 10) {
    nextErrors.mobileNo = 'Please Enter Mobile No. only 10 digit';
  }

  if (!announceDetailsForm.occasionType.trim()) {
    nextErrors.occasionType = 'Please Select In Memory / Occasion Type.';
  }

  if (!isValidDateValue(announceDetailsForm.occasionDate)) {
    nextErrors.occasionDate = 'In Memory / Occassion Date Not Valid.';
  }

  if (!announceDetailsForm.occasionRemark.trim()) {
    nextErrors.occasionRemark = 'Please Fill Remark.';
  }

  if (operation !== 'EDIT' && !announceDetailsForm.causeHead.trim()) {
    nextErrors.causeHead = 'Please Select Cause Head.';
  }

  if (
    announceDetailsForm.causeHead === '150' &&
    !announceDetailsForm.causeHeadDate.trim()
  ) {
    nextErrors.causeHeadDate = 'Please Select Cause Head Date.';
  }

  if (operation !== 'EDIT' && !announceDetailsForm.purpose.trim()) {
    nextErrors.purpose = 'Please Select Purpose.';
  }

  if (
    announceDetailsForm.purpose.trim() &&
    isAmountEditable &&
    announceAmount <= 0
  ) {
    nextErrors.announceAmount = 'Please Fill Announce Amount';
  }

  if (!announceDetailsForm.howToDonate.trim()) {
    nextErrors.howToDonate = 'Please Select How to donate.';
  }

  if (
    announceDetailsForm.isMotivated &&
    !announceDetailsForm.motivatedAmount.trim()
  ) {
    nextErrors.motivatedAmount = 'Please enter motivated amount.';
  }

  if (
    ['Online', 'Pay-In-Slip'].includes(announceDetailsForm.paymentMode) &&
    selectedBankIds.length === 0
  ) {
    nextErrors.bankSelection = 'Please select any one bank to message.';
  }

  return nextErrors;
};

const buildCurrentCauseForPayload = ({
  announceDetailsForm,
  autoAmount,
  isCauseReadyToAdd,
  selectedCauseHeadOption,
  selectedPurposeOption,
}: {
  announceDetailsForm: AnnounceDetailsForm;
  autoAmount: string;
  isCauseReadyToAdd: boolean;
  selectedCauseHeadOption?: EventOption;
  selectedPurposeOption?: EventOption;
}): AddedAnnounceCause | null => {
  if (!isCauseReadyToAdd || !selectedPurposeOption) {
    return null;
  }

  return {
    id: Date.now(),
    causeHead: announceDetailsForm.causeHead,
    causeHeadLabel: selectedCauseHeadOption?.label || '',
    causeHeadPurposeId:
      selectedCauseHeadOption?.purposeId?.trim() ||
      announceDetailsForm.causeHead.trim(),
    purpose: announceDetailsForm.purpose,
    purposeLabel: selectedPurposeOption.label || announceDetailsForm.purpose,
    yojnaId:
      selectedPurposeOption.yojnaId?.trim() ||
      announceDetailsForm.purpose.trim(),
    quantity: Math.max(1, Number(announceDetailsForm.quantity) || 1),
    amount: autoAmount.trim(),
    causeHeadDate: announceDetailsForm.causeHeadDate,
    namePlateName: announceDetailsForm.namePlateName.trim(),
    donorInstruction: announceDetailsForm.donorInstruction.trim(),
  };
};

const buildSavePayload = ({
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
}: {
  addedCauses: AddedAnnounceCause[];
  announceDetailsForm: AnnounceDetailsForm;
  announceEventForm: AnnounceEventForm;
  announceIdParam: string;
  announceThroughParam: string | null;
  autoAmount: string;
  callingSadhakId: number | null;
  callingSadhakName: string | null;
  currentUser: any;
  donorIdentificationForm: {
    announceDate: string;
    donorId: string;
    followupNotRequired: boolean;
    urgentFollowup: boolean;
  };
  donorSearchType: string;
  donorSearchValue: string;
  followUpForm: FollowUpForm;
  isCauseReadyToAdd: boolean;
  persistedCurrencyId: string;
  personalInfoForm: PersonalInfoForm;
  queryStringBid: string | null;
  queryStringCrtObjectId: string | null;
  queryStringDReason: string | null;
  queryStringThisCallId: string | null;
  resolvedCurrencyId: string;
  selectedBankIds: string[];
  selectedCauseHeadOption?: EventOption;
  selectedDistrictOption?: EventOption;
  selectedEventChannelDetail?: {
    channelCode?: string;
  };
  selectedEventCityDetail?: {
    cityCode?: string;
  };
  selectedEventDetail?: {
    channelCode?: string;
    cityCode?: string;
    panditCode?: string;
  };
  selectedEventId: string | null;
  selectedEventPanditDetail?: {
    panditCode?: string;
  };
  selectedHowToDonateOption?: EventOption;
  selectedPurposeOption?: EventOption;
  selectedStateOption?: EventOption;
}) => {
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
  const donorInstruction = toNullableText(
    causesForPayload
      .map(cause => cause.donorInstruction)
      .filter(Boolean)
      .join(', '),
  );
  const namePlate = toNullableText(
    causesForPayload
      .map(cause => cause.namePlateName)
      .filter(Boolean)
      .join(', '),
  );
  const dueDate =
    formatDateForApi(announceDetailsForm.expectedDate) ||
    formatDateForApi(followUpForm.date);
  const dueTime =
    normalizeApiTime(announceDetailsForm.expectedTime) ||
    normalizeApiTime(followUpForm.time);
  const selectedHowToDonateId = Number(
    selectedHowToDonateOption?.value?.trim() ||
      announceDetailsForm.howToDonate.trim() ||
      0,
  );
  const selectedBankIdsValue = selectedBankIds.length
    ? selectedBankIds.join(',')
    : null;
  const selectedDistrictCode = Number(
    selectedDistrictOption?.districtCode?.trim() || 0,
  );
  const selectedStateCode = Number(selectedStateOption?.stateCode?.trim() || 0);
  const channelCode = Number(
    selectedEventDetail?.channelCode?.trim() ||
      selectedEventChannelDetail?.channelCode?.trim() ||
      0,
  );
  const panditCode = Number(
    selectedEventDetail?.panditCode?.trim() ||
      selectedEventPanditDetail?.panditCode?.trim() ||
      0,
  );
  const bhagCityCode = Number(
    selectedEventDetail?.cityCode?.trim() ||
      selectedEventCityDetail?.cityCode?.trim() ||
      0,
  );
  const ngCode = donorIdentificationForm.donorId.trim() || null;
  const searchedEmailId =
    donorSearchType === 'email' && donorSearchValue ? donorSearchValue : null;
  const searchedAadharNumber =
    donorSearchType === 'aadhaar' && donorSearchValue ? donorSearchValue : null;
  const searchedPanNumber =
    donorSearchType === 'pan' && donorSearchValue ? donorSearchValue : null;
  const currencyId =
    resolvedCurrencyId.trim() ||
    persistedCurrencyId.trim() ||
    inferCurrencyIdFromCode(announceEventForm.currency);

  return {
    announceAmount,
    causesForPayload,
    payload: {
      annoucePurposeList: causesForPayload.map(cause => ({
        yojna_id: cause.yojnaId || '0',
        qty: String(Math.max(1, Number(cause.quantity) || 1)),
        amount: String(parseAmountValue(cause.amount) || 0),
        bhojan_date: formatDateForApi(cause.causeHeadDate) || '',
      })),
      announce_id: Number(announceIdParam || 0),
      ashri: personalInfoForm.salutation || '',
      ashri_oth: personalInfoForm.announceInOtherName
        ? personalInfoForm.otherSalutation ||
          personalInfoForm.salutation ||
          null
        : null,
      announcer_name: personalInfoForm.announcerName.trim(),
      announce_amount: announceAmount,
      address1: null,
      address2: null,
      address3: null,
      ph_no: null,
      mob_no: personalInfoForm.mobileNo.trim(),
      announce_through: announceThroughParam || 'CALLCENTER',
      announce_date: formatDateForApi(donorIdentificationForm.announceDate),
      announce_time: getCurrentTimeValue(),
      std_code: null,
      email_id: searchedEmailId,
      purpose: Number(announceDetailsForm.causeHead.trim() || 0),
      due_date: dueDate,
      due_time: dueTime,
      completed: '0',
      first_date: '',
      second_date: '',
      third_date: '',
      remark1: selectedHowToDonateId,
      first_remark: null,
      second_remark: donorInstruction,
      third_remark: namePlate,
      city_code: 0,
      district_code: selectedDistrictCode,
      state_code: selectedStateCode,
      remark2: toNullableText(announceDetailsForm.occasionRemark),
      channel_code: channelCode,
      pandit_code: panditCode,
      bhag_city_code: bhagCityCode || null,
      oth_name: personalInfoForm.announceInOtherName
        ? toNullableText(personalInfoForm.announcedForName)
        : null,
      mob_no_second: null,
      mob_no_third: null,
      user_name: currentUser.username || '',
      ash_code: toDigitsNumber(donorIdentificationForm.donorId.trim()),
      emp_code: Number(currentUser.empNum || 0) || 0,
      live: announceEventForm.liveType === 'live' ? 'Y' : 'N',
      provisional_no: null,
      chk_prov: null,
      rec_amount: 0,
      rec_date: null,
      allocate_date: null,
      ash_event_id: selectedEventId,
      event_ash_id: selectedEventId,
      event_name: announceEventForm.eventName.trim() || null,
      audit_confirm: 'N',
      user_id: Number(currentUser.id || 0),
      audit_remark: null,
      allocated_to: null,
      followup_priority: donorIdentificationForm.urgentFollowup ? 1 : 0,
      bank_code: null,
      future_donor: null,
      search_remark: null,
      search_empname: null,
      search_complete: null,
      complete_userid: null,
      complete_date: null,
      landmark: null,
      cash_pickup: 'N',
      other_type: personalInfoForm.announceInOtherName ? 1 : null,
      currency_id: currencyId ? Number(currencyId) : null,
      cause_id: Number(causesForPayload[0]?.causeHeadPurposeId || 0),
      ngcode: ngCode,
      msg_banks: selectedBankIdsValue,
      data_flag: ContentTypes.DataFlag,
      fy_id: 21,
      crtobjectid: null,
      last_call_no: null,
      last_fp_remark: null,
      last_call_date: null,
      last_call_back_date: null,
      last_remark: null,
      fp_received: null,
      fp_org_rec_no: null,
      receive_id_by: null,
      receive_head_by: null,
      dmobile5: null,
      dmobilewhatsapp1: personalInfoForm.whatsappNo.trim() || null,
      dmobilewhatsapp2: null,
      phoffice: null,
      aadhar_number: searchedAadharNumber,
      pan_number: searchedPanNumber,
      in_memory_occasion: toNullableText(announceDetailsForm.occasionType),
      in_memocc_date:
        formatDateForApi(announceDetailsForm.occasionDate) || null,
      donor_instruction: donorInstruction,
      name_plate: namePlate,
      edit_user_id: null,
      edit_user_name: null,
      edit_datetime: null,
      pincode_code: Number(personalInfoForm.pincode.trim() || 0),
      country_code: 91,
      pincode: personalInfoForm.pincode.trim(),
      calling_sadhak_id: callingSadhakId,
      calling_sadhak_name: callingSadhakName,
      daan_patra_no: null,
      orderno: null,
      pay_mode: announceDetailsForm.paymentMode || null,
      docket_no: null,
      route_code: null,
      token_no: null,
      no_followup_require: donorIdentificationForm.followupNotRequired
        ? 'Y'
        : 'N',
      last_call_id: null,
      faked: 'N',
      discarded: 'N',
      self_deposit: 'N',
      send_sadhak: 'Y',
      online_bank_id: selectedBankIds[0] || null,
      motivated: announceDetailsForm.isMotivated,
      motivated_amount: Number(announceDetailsForm.motivatedAmount || 0),
      wfh_auto_id: null,
      PostType: 'WebReact',
      QueryString_BID: queryStringBid,
      QueryString_crtObjectId: queryStringCrtObjectId,
      QueryString_DReason: queryStringDReason,
      QueryString_THISCALLID: queryStringThisCallId,
    },
    resolvedCurrencyId: currencyId,
  };
};

const submitSaveRequest = async ({
  operation,
  payload,
}: {
  operation: SaveOperation;
  payload: Record<string, unknown>;
}) =>
  axiosInstance.post(
    operation === 'EDIT'
      ? masterApiPaths.updateAnnounce
      : masterApiPaths.createAnnounce,
    payload,
    {
      headers: masterApiHeaders(),
    },
  );

const persistSavedAnnouncement = ({
  addedCauses,
  announceDetailsForm,
  announceEventForm,
  announceIdParam,
  currencyId,
  donorIdentificationForm,
  followUpForm,
  followUpItems,
  personalInfoForm,
  responseData,
  selectedBankIds,
  cachedRecords,
}: {
  addedCauses: AddedAnnounceCause[];
  announceDetailsForm: AnnounceDetailsForm;
  announceEventForm: AnnounceEventForm;
  announceIdParam: string;
  cachedRecords: AnnouncementCacheRecord[];
  currencyId: string;
  donorIdentificationForm: any;
  followUpForm: FollowUpForm;
  followUpItems: FollowUpItem[];
  personalInfoForm: PersonalInfoForm;
  responseData: unknown;
  selectedBankIds: string[];
}) => {
  const resolvedAnnouncementId = extractAnnouncementId(
    responseData,
    announceIdParam !== '0' ? announceIdParam : String(Date.now()),
  );
  const nextCacheRecord: AnnouncementCacheRecord = {
    announceId: resolvedAnnouncementId,
    donorIdentificationForm,
    announceEventForm,
    personalInfoForm,
    announceDetailsForm: {
      ...announceDetailsForm,
      ...createEmptyCauseFields(),
    },
    followUpForm,
    followUpItems,
    addedCauses,
    selectedBankIds,
    currencyId,
    savedAt: new Date().toISOString(),
  };

  writeAnnouncementCache([
    nextCacheRecord,
    ...cachedRecords.filter(
      record => record.announceId !== resolvedAnnouncementId,
    ),
  ]);
};

const getSaveErrorPayload = (error: unknown) =>
  axios.isAxiosError(error)
    ? error.response?.data || { message: error.message }
    : { message: 'Failed to save announce.' };

export {
  buildCurrentCauseForPayload,
  buildSavePayload,
  getPreferredValidationTab,
  getSaveErrorPayload,
  persistSavedAnnouncement,
  submitSaveRequest,
  validateBeforeSave,
};
