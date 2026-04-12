import {
  AnnounceDetailsForm,
  AnnounceEventForm,
  DonorIdentificationForm,
  FollowUpForm,
  PersonalInfoForm,
} from './types';

export const createInitialDonorIdentificationForm = (
  today: string,
): DonorIdentificationForm => ({
  announceDate: today,
  donorSearchType: 'donorId',
  donorId: '',
  callingSadhak: 'Logged-in User (Auto)',
  urgentFollowup: false,
  followupNotRequired: false,
});

export const createInitialAnnounceEventForm = (): AnnounceEventForm => ({
  liveType: 'live',
  eventName: '',
  eventCause: '',
  eventFromDate: '',
  eventToDate: '',
  eventFromTime: '',
  eventToTime: '',
  eventCity: '',
  eventChannel: '',
  panditJi: '',
  eventLocation: '',
  currency: '',
});

export const createInitialPersonalInfoForm = (): PersonalInfoForm => ({
  salutation: '',
  salutationLocked: false,
  otherSalutation: '',
  mobileNo: '',
  whatsappNo: '',
  announcerName: '',
  announceInOtherName: false,
  announcedForName: '',
  relationName: '',
  pincode: '',
  country: 'India',
  state: '',
  stateLocked: false,
  district: '',
});

export const createInitialAnnounceDetailsForm = (): AnnounceDetailsForm => ({
  occasionType: '',
  occasionDate: '',
  occasionRemark: '',
  causeHead: '',
  causeHeadDate: '',
  namePlateName: '',
  donorInstruction: '',
  purpose: '',
  quantity: 1,
  paymentMode: '',
  howToDonate: '',
  expectedDate: '',
  expectedTime: '',
  isMotivated: false,
  motivatedAmount: '',
});

export const createInitialFollowUpForm = (): FollowUpForm => ({
  date: '',
  time: '',
  assignTo: '',
  status: 'Open',
  note: '',
});
