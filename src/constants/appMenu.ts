import { PATH } from './paths';
import { RECEIVE_ID_HEADS } from './receiveIdHeads';

export interface AppMenuItem {
  key: string;
  label: string;
  path?: string;
  iconClass: string;
  children?: AppMenuItem[];
}

export const APP_MENU_ITEMS: AppMenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: PATH.DASHBOARD,
    iconClass: 'fas fa-tachometer-alt fs-4',
  },
  {
    key: 'announce-master',
    label: 'Announcement',
    path: PATH.ANNOUNCE_MASTER,
    iconClass: 'fas fa-bullhorn fs-4',
  },
  {
    key: 'receive-id',
    label: 'Receive ID',
    iconClass: 'fas fa-clipboard-check fs-4',
    children: RECEIVE_ID_HEADS.map(head => ({
      key: `receive-id-${head.key}`,
      label: head.menuLabel,
      path: `${PATH.RECEIVE_ID_CREATION}?HEAD=${head.value}`,
      iconClass: 'fas fa-circle fs-8',
    })),
  },
  {
    key: 'cit',
    label: 'Call Information Trait',
    path: PATH.CIT,
    iconClass: 'fas fa-headset fs-4',
  },
  {
    key: 'my-profile',
    label: 'My Profile',
    path: PATH.PROFILE,
    iconClass: 'fas fa-user fs-4',
  },
];
