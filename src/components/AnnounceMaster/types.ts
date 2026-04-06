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
  purpose: string;
  quantity: number;
  paymentMode: string;
  howToDonate: string;
  expectedDate: string;
  expectedTime: string;
  isMotivated: boolean;
  motivatedAmount: string;
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
  amountValue?: string;
  stateCode?: string;
}

export type AnnouncerTabKey =
  | 'personal'
  | 'announceDetails'
  | 'bankDetails'
  | 'followUp';
