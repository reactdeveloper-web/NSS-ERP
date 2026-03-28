import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Grid } from 'antd';

const { SubMenu, ItemGroup: MenuItemGroup } = Menu;
const { useBreakpoint } = Grid;

export const LeftMenu = () => {
  const { md } = useBreakpoint();
  return (
    <Menu mode={md ? 'horizontal' : 'inline'}>
      <Menu.Item key="key-about">
        <NavLink className="navbar-item" to="/about">
          About
        </NavLink>
      </Menu.Item>
      <Menu.Item key="key-contact">
        <NavLink className="navbar-item" to="/contact">
          Contact
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};
