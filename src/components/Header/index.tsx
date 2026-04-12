import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LeftMenu } from './LeftMenu';
import { RightMenu } from './RightMenu';
import { Dashboard } from './Dashboard';
import { PATH } from 'src/constants/paths';

import { Drawer, Button } from 'antd';

export const AppHeader = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const drawerOnClose = () => {
    setVisible(false);
  };

  if (
    pathname === PATH.ANNOUNCE_MASTER ||
    pathname === PATH.CIT ||
    pathname === PATH.PROFILE ||
    pathname === PATH.DASHBOARD ||
    pathname === PATH.DUMMY
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
