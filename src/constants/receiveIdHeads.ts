export interface ReceiveIdHeadConfig {
  key: string;
  value: string;
  label: string;
  menuLabel: string;
}

export const RECEIVE_ID_HEADS: ReceiveIdHeadConfig[] = [
  {
    key: 'welcome',
    value: 'WELCOME',
    label: 'WELCOME',
    menuLabel: 'Welcome Donation Receive',
  },
  {
    key: 'callcenter',
    value: 'CALLCENTER',
    label: 'CALLCENTER',
    menuLabel: 'Call Center Donation Receive',
  },
  {
    key: 'sachivalaya',
    value: 'SACHIVALAYA',
    label: 'SACHIVALAYA',
    menuLabel: 'Sachivalaya Donation Receive',
  },
  {
    key: 'online',
    value: 'ONLINE',
    label: 'ONLINE',
    menuLabel: 'Online Donation Receive',
  },
  {
    key: 'other',
    value: 'OTHER',
    label: 'OTHER',
    menuLabel: 'Other Donation Receive',
  },
  {
    key: 'branch',
    value: 'BRANCH',
    label: 'BRANCH',
    menuLabel: 'Branch Donation Receive',
  },
  {
    key: 'katha',
    value: 'KATHA',
    label: 'KATHA',
    menuLabel: 'Katha Donation Receive',
  },
  {
    key: 'daanpatra',
    value: 'DAANPATRA',
    label: 'DAANPATRA',
    menuLabel: 'Daan Patra Donation Receive',
  },
];

export const DEFAULT_RECEIVE_ID_HEAD = 'CALLCENTER';
