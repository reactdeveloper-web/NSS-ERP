import {
  AnnounceDetailsForm,
  AnnounceEventForm,
  DonorIdentificationForm,
  FollowUpForm,
  PersonalInfoForm,
} from './types';

export const bankOptions = [
];

export const purposeOptions = [
  { value: '', label: 'Select' },
  { value: '15000', label: '1 Limb Sponsorship (Rs. 15,000)' },
  { value: '7500', label: '1 Caliper Sponsorship (Rs. 7,500)' },
  { value: '25000', label: '1 Surgery Support (Rs. 25,000)' },
  { value: '11000', label: 'Food Seva 1 Day (Rs. 11,000)' },
];

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
  eventCity: 'Udaipur',
  eventChannel: 'Aastha',
  panditJi: 'Pujya Prashant Agarwal Ji',
  eventLocation: 'Sevamahodaya Badi, Udaipur, Rajasthan',
  currency: 'INR',
});

export const createInitialPersonalInfoForm = (): PersonalInfoForm => ({
  salutation: '',
  salutationLocked: false,
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
