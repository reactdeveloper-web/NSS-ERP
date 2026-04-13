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
<<<<<<< HEAD
    label: 'Announcement',
=======
    label: 'Announce Master',
>>>>>>> rahulsharma-dev
    path: PATH.ANNOUNCE_MASTER,
    iconClass: 'fas fa-bullhorn fs-4',
  },
  {
<<<<<<< HEAD
    key: 'cit',
    label: 'Call Center Ticket',
    path: PATH.CIT,
    iconClass: 'fas fa-headset fs-4',
  },
  {
=======
>>>>>>> rahulsharma-dev
    key: 'my-profile',
    label: 'My Profile',
    path: PATH.PROFILE,
    iconClass: 'fas fa-user fs-4',
  },
];
