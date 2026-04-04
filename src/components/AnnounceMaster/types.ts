export interface DonorIdentificationForm {
  announceDate: string;
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
  mobileNo: string;
  whatsappNo: string;
  announcerName: string;
  announceInOtherName: boolean;
  announcedForName: string;
  relationName: string;
  pincode: string;
  country: string;
  state: string;
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

export type AnnouncerTabKey =
  | 'personal'
  | 'announceDetails'
  | 'bankDetails'
  | 'followUp';
