import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { loadUser, logout } from 'src/components/Auth/Auth.thunks';
import { AppAlert } from "src/components/Alert";
import { Routes } from 'src/routes';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  loadUser,
  logout,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {}

const _App = (props: Props) => {
  useEffect(() => {
    const { loadUser, logout } = props;

    if (localStorage.user) {
      loadUser();
    }

    window.addEventListener('storage', () => {
      if (!localStorage.user) logout();
    };
    window.addEventListener('storage', storageHandler);

    // Cleanup timers and events when unmounting
    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', storageHandler);
    };
  }, [props]);

  return (
    <>
      <AppAlert />   {/* ⭐ GLOBAL ALERT MOUNTED */}
      <Routes />
    </>
  );
};

export const App = connector(_App);