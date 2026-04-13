import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { loadUser, logout } from 'src/components/Auth/Auth.thunks';
import { Routes } from 'src/routes';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  loadUser,
  logout,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> { }

const _App = (props: Props) => {
  useEffect(() => {
    const { loadUser, logout } = props;

    // ----- BACKGROUND AUTO-LOGOUT TIMER -----
    const timer = setInterval(() => {
      const loginTimestamp = localStorage.getItem('loginTimestamp');

      // If the user is logged in (timestamp exists)
      if (loginTimestamp) {
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        // const ONE_WEEK_MS = 10000; //Testing

        // Check 7 days have passed
        if (Date.now() - Number(loginTimestamp) > ONE_WEEK_MS) {
          clearInterval(timer); // Stop the timer
          logout(); // Clear storage and state
          window.location.href = '/';
        }
      }
    }, 1000); // This checks the clock every 1 second

    // check for token in LS on initial load
    if (localStorage.user) {
      loadUser();
    }

    // log user out from all tabs if they log out in one tab
    const storageHandler = () => {
      if (!localStorage.user) logout();
    };
    window.addEventListener('storage', storageHandler);

    // Cleanup timers and events when unmounting
    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', storageHandler);
    };
  }, [props]);

  return <Routes />;
};

export const App = connector(_App);
