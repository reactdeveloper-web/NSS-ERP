import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LeftMenu } from './LeftMenu';
import { RightMenu } from './RightMenu';
import { Dashboard } from './Dashboard';

import { Drawer, Button } from 'antd';

export const AppHeader = () => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const drawerOnClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Dashboard />
      <RightMenu />
    </>
  );
};
