import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import { Loading } from 'src/components/Loading';
import { Redirect, Route, Switch } from 'react-router-dom';
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

const ReceiveIdCreationPage = lazy(
  () => import('src/pages/MasterPages/ReceiveIdCreationPage'),
);

const CitPage = lazy(() => import('src/pages/cit/CitPage'));

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
              {/* <Route
                exact
                sensitive
                path="/Announcement"
                render={() => <Redirect to={PATH.ANNOUNCE_MASTER} />}
              /> */}
              <Route
                exact
                path={PATH.ANNOUNCE_MASTER}
                component={AnnounceMasterPage}
              />

              <Route
                exact
                path={PATH.RECEIVE_ID_CREATION}
                component={ReceiveIdCreationPage}
              />
              <Route exact path={PATH.CIT} component={CitPage} />

              {/* Error routes */}
              <Route component={NotFoundPage} />
            </Switch>
          </Suspense>
        </MainLayout>
      </HelmetProvider>
    </BrowserRouter>
  );
};
