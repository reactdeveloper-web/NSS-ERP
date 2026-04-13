import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import { Loading } from 'src/components/Loading';
<<<<<<< HEAD
import { Redirect, Route, Switch } from 'react-router-dom';
=======
import { Route, Switch } from 'react-router-dom';
>>>>>>> rahulsharma-dev
import { MainLayout } from 'src/pages/layouts/MainLayout';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// ---> Static pages
const DashboardPage = lazy(
  () => import('src/pages/DashboardPages/DashboardPage'),
);

// ---> Auth pages
const LoginPage = lazy(() => import('src/pages/AuthPages/LoginPage'));
const ForgotPage = lazy(() => import('src/pages/AuthPages/ForgotPage'));
const ResetPassword = lazy(
  () => import('src/pages/AuthPages/SetupNewPassword'),
);
const AnnounceMasterPage = lazy(
  () => import('src/pages/MasterPages/AnnounceMasterPage'),
);
<<<<<<< HEAD
const CitPage = lazy(() => import('src/pages/cit/CitPage'));
=======
>>>>>>> rahulsharma-dev

const ProfileMasterPage = lazy(
  () => import('src/pages/MyProfilePage/ProfileMasterPage'),
);

// ---> Error pages
const NotFoundPage = lazy(() => import('src/pages/ErrorPages/404Pages'));

const helmetContext = {};

export const Routes = () => {
  return (
    <BrowserRouter>
      <HelmetProvider context={helmetContext}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>React TS </title>
          <link
            rel="canonical"
            href="https://reactts-boilerplate.netlify.app/"
          />
        </Helmet>

        <MainLayout>
          <Suspense fallback={<Loading />}>
            <Switch>
              {/* Static pages routes */}
              <Route exact path={PATH.HOME} component={LoginPage} />
              <Route exact path={PATH.DASHBOARD} component={DashboardPage} />
              {/* Auth routes */}
              <Route exact path={PATH.LOGIN} component={LoginPage} />
              <Route exact path={PATH.PROFILE} component={ProfileMasterPage} />
              <Route exact path={PATH.FORGOT} component={ForgotPage} />
              <Route path={PATH.RESET_PASSWORD} component={ResetPassword} />
<<<<<<< HEAD
              {/* <Route
                exact
                sensitive
                path="/Announcement"
                render={() => <Redirect to={PATH.ANNOUNCE_MASTER} />}
              /> */}
=======
>>>>>>> rahulsharma-dev
              <Route
                exact
                path={PATH.ANNOUNCE_MASTER}
                component={AnnounceMasterPage}
              />
<<<<<<< HEAD
              <Route exact path={PATH.CIT} component={CitPage} />
=======
>>>>>>> rahulsharma-dev

              {/* Error routes */}
              <Route component={NotFoundPage} />
            </Switch>
          </Suspense>
        </MainLayout>
      </HelmetProvider>
    </BrowserRouter>
  );
};
