import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LeftMenu } from './LeftMenu';
import { RightMenu } from './RightMenu';
import { Dashboard } from './Dashboard';
import { PATH } from 'src/constants/paths';
import { Drawer, Button } from 'antd';
import "flatpickr/dist/flatpickr.min.css";

export const AppHeader = () => {
  const { pathname } = useLocation();
  const normalizedPathname = pathname.toLowerCase();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const drawerOnClose = () => {
    setVisible(false);
  };

  if (
    normalizedPathname === PATH.ANNOUNCE_MASTER.toLowerCase() ||
    normalizedPathname === PATH.RECEIVE_ID_CREATION.toLowerCase() ||
    normalizedPathname === PATH.CIT.toLowerCase() ||
    normalizedPathname === PATH.PROFILE.toLowerCase() ||
    normalizedPathname === PATH.DASHBOARD.toLowerCase() ||
    normalizedPathname === PATH.CALL_DETAIL.toLowerCase()

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
