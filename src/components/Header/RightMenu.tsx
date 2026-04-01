import React from 'react';
import { Menu, Grid } from 'antd';
import { NavLink } from 'react-router-dom';
import { LoginOutlined } from '@ant-design/icons';
import { logout } from 'src/components/Auth/Auth.thunks';
import { connect, ConnectedProps } from 'react-redux';
import { PATH } from 'src/constants/paths';

const { useBreakpoint } = Grid;

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user as IUser,
});
const mapDispatchToProps = {
  logout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {}

const _RightMenu = (props: Props) => {
  const { isAuthenticated, logout, user } = props;
  const { md } = useBreakpoint();
  const authLinks = (
    
        <a
          className="navbar-item primary"
          href={PATH.LOGIN}
          onClick={() => logout()}
        >
            <LoginOutlined />
        </a>
     
  );
  return <>{isAuthenticated ? authLinks : ''}</>;
};

const RightMenu = connector(_RightMenu);
export { RightMenu };
