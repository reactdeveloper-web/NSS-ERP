export interface ReceiveIdFormValues {
  donorId: string;
  announceId: string;
  salutation: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  occasion: string;
  occasionDetail: string;
  inMemoryText: string;
  address1: string;
  address2: string;
  address3: string;
  country: string;
  pincode: string;
  state: string;
  city: string;
  district: string;
  careOf: string;
  mobileType1: string;
  mobile1: string;
  whatsapp: string;
  email1: string;
  mobileType2: string;
  mobile2: string;
  email2: string;
  aadharNumber: string;
  panNumber: string;
  paymentMode: string;
  currency: string;
  amount: string;
  materialDepositId: string;
  material: string;
  bankName1: string;
  chequeDate: string;
  chequeNo: string;
  depositBank: string;
  depositDate: string;
  manualBankId: string;
  receiptCopy: string;
  proofType: string;
  receiveEvent: string;
  protocolSadhak: string;
  provisionalNo: string;
  provisionalDate: string;
  magazinePreference: string;
  dispatchAddressNote: string;
  receiverName: string;
  head: string;
  subHead: string;
  purposeDetails: string;
  quantity: string;
  criticalDisease: string;
  mainMemberDonorId: string;
  referenceNote: string;
  instruction: string;
  updateIn: string;
  details: string;
  remarks: string;
  fileType: string;
  totalDueAmount: string;
}

export type ReceiveIdFormField = keyof ReceiveIdFormValues;

export interface ReceiveIdFormTabProps {
  values: ReceiveIdFormValues;
  updateField: (field: ReceiveIdFormField, value: string) => void;
  isReadOnly: boolean;
}

export const createInitialReceiveIdFormValues = (): ReceiveIdFormValues => ({
  donorId: '',
  announceId: '',
  salutation: 'Mr.',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  occasion: '',
  occasionDetail: '',
  inMemoryText: '',
  address1: '',
  address2: '',
  address3: '',
  country: 'India',
  pincode: '',
  state: '',
  city: '',
  district: '',
  careOf: '',
  mobileType1: 'Mobile',
  mobile1: '',
  whatsapp: '',
  email1: '',
  mobileType2: 'Mobile',
  mobile2: '',
  email2: '',
  aadharNumber: '',
  panNumber: '',
  paymentMode: '',
  currency: 'Indian Rupee (INR)',
  amount: '',
  materialDepositId: '',
  material: '',
  bankName1: '',
  chequeDate: '',
  chequeNo: '',
  depositBank: 'All',
  depositDate: '',
  manualBankId: '',
  receiptCopy: 'Soft Copy',
  proofType: '',
  receiveEvent: '',
  protocolSadhak: '',
  provisionalNo: '',
  provisionalDate: '',
  magazinePreference: '',
  dispatchAddressNote: '',
  receiverName: '',
  head: '',
  subHead: '',
  purposeDetails: '',
  quantity: '1',
  criticalDisease: '',
  mainMemberDonorId: '',
  referenceNote: '',
  instruction: '',
  updateIn: '',
  details: '',
  remarks: '',
  fileType: '',
  totalDueAmount: '',
});
