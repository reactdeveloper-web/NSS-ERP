import { PATH } from './paths';

export interface AppMenuItem {
  key: string;
  label: string;
  path: string;
  iconClass: string;
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
    label: 'Announce Master',
    path: PATH.ANNOUNCE_MASTER,
    iconClass: 'fas fa-bullhorn fs-4',
  },
   {
    key: 'announce-master-2',
    label: 'Announce Master 2',
    path: PATH.ANNOUNCE_MASTER,
    iconClass: 'fas fa-bullhorn fs-4',
  },
];
