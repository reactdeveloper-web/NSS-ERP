export interface DonorIdentificationForm {
  announceDate: string;
  donorSearchType: string;
  donorId: string;
  callingSadhak: string;
  urgentFollowup: boolean;
  followupNotRequired: boolean;
}

export interface AnnounceEventForm {
  liveType: 'live' | 'nonLive';
  eventName: string;
  eventCause: string;
  eventFromDate: string;
  eventToDate: string;
  eventFromTime: string;
  eventToTime: string;
  eventCity: string;
  eventChannel: string;
  panditJi: string;
  eventLocation: string;
  currency: string;
}

export interface PersonalInfoForm {
  salutation: string;
  salutationLocked: boolean;
<<<<<<< HEAD
  otherSalutation: string;
=======
>>>>>>> rahulsharma-dev
  mobileNo: string;
  whatsappNo: string;
  announcerName: string;
  announceInOtherName: boolean;
  announcedForName: string;
  relationName: string;
  pincode: string;
  country: string;
  state: string;
  stateLocked: boolean;
  district: string;
}

export interface AnnounceDetailsForm {
  occasionType: string;
  occasionDate: string;
  occasionRemark: string;
  causeHead: string;
  causeHeadDate: string;
  namePlateName: string;
  donorInstruction: string;
  purpose: string;
  quantity: number;
  paymentMode: string;
  howToDonate: string;
  expectedDate: string;
  expectedTime: string;
  isMotivated: boolean;
  motivatedAmount: string;
}

export interface AddedAnnounceCause {
  id: number;
  causeHead: string;
  causeHeadLabel: string;
  causeHeadPurposeId: string;
  purpose: string;
  purposeLabel: string;
  yojnaId: string;
  quantity: number;
  amount: string;
  causeHeadDate: string;
  namePlateName: string;
  donorInstruction: string;
}

export interface FollowUpForm {
  date: string;
  time: string;
  assignTo: string;
  status: string;
  note: string;
}

export interface FollowUpItem extends FollowUpForm {
  id: number;
}

export interface DepositBank {
  id: string;
  bankName: string;
  accountNo: string;
  accountType: string;
  ifsc: string;
  branch: string;
}

export interface DonorSearchResult {
  donorId: string;
  donorName: string;
  mobileNo: string;
  email: string;
  record: Record<string, unknown>;
}

export interface SalutationOption {
  value: string;
  label: string;
}

export interface EventOption {
  value: string;
  label: string;
  purposeId?: string;
  yojnaId?: string;
  qtyValue?: string;
  amountValue?: string;
  stateCode?: string;
  districtCode?: string;
}

export type AnnounceValidationField =
  | 'announceDate'
  | 'salutation'
  | 'announcerName'
  | 'announcedForName'
  | 'mobileNo'
  | 'pincode'
  | 'country'
  | 'state'
  | 'district'
  | 'eventName'
  | 'occasionType'
  | 'occasionDate'
  | 'occasionRemark'
  | 'causeHead'
  | 'causeHeadDate'
  | 'purpose'
  | 'paymentMode'
  | 'announceAmount'
  | 'howToDonate'
  | 'motivatedAmount'
  | 'bankSelection';

export type AnnounceValidationErrors = Partial<
  Record<AnnounceValidationField, string>
>;

export type AnnouncerTabKey =
  | 'personal'
  | 'announceEvent'
  | 'announceDetails'
  | 'bankDetails'
  | 'followUp';
