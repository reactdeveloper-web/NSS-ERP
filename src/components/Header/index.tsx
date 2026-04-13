import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LeftMenu } from './LeftMenu';
import { RightMenu } from './RightMenu';
import { Dashboard } from './Dashboard';
import { PATH } from 'src/constants/paths';

import { Drawer, Button } from 'antd';

export const AppHeader = () => {
  const { pathname } = useLocation();
<<<<<<< HEAD
  const normalizedPathname = pathname.toLowerCase();
=======
>>>>>>> rahulsharma-dev
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const drawerOnClose = () => {
    setVisible(false);
  };

  if (
<<<<<<< HEAD
    normalizedPathname === PATH.ANNOUNCE_MASTER.toLowerCase() ||
    normalizedPathname === PATH.CIT.toLowerCase() ||
    normalizedPathname === PATH.PROFILE.toLowerCase() ||
    normalizedPathname === PATH.DASHBOARD.toLowerCase()
=======
    pathname === PATH.ANNOUNCE_MASTER ||
    pathname === PATH.PROFILE ||
    pathname === PATH.DASHBOARD ||
    pathname === PATH.DUMMY
>>>>>>> rahulsharma-dev
  ) {
    return null;
  }

  return (
    <>
      <Dashboard />
      <RightMenu />
    </>
  );
};
