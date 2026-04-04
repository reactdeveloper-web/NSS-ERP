import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import { Loading } from 'src/components/Loading';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { MainLayout } from 'src/pages/layouts/MainLayout';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// ---> Static pages
const DashboardPage = lazy(
  () => import('src/pages/DashboardPages/DashboardPage'),
);
const HomePage = lazy(() => import('src/pages/HomePages/HomePage'));
const ContactPage = lazy(() => import('src/pages/StaticPages/ContactPage'));
const AboutPage = lazy(() => import('src/pages/StaticPages/AboutPage'));
const Demo1Page = lazy(() => import('src/pages/StaticPages/Demo1Page'));
const Demo2Page = lazy(() => import('src/pages/StaticPages/Demo2Page'));
const Feature1Page = lazy(() => import('src/pages/StaticPages/Feature1Page'));
const Feature2Page = lazy(() => import('src/pages/StaticPages/Feature2Page'));

// ---> Auth pages
const LoginPage = lazy(() => import('src/pages/AuthPages/LoginPage'));
const AnnounceMasterPage = lazy(
  () => import('src/pages/MasterPages/AnnounceMasterPage'),
);
const RegisterPage = lazy(() => import('src/pages/AuthPages/RegisterPage'));
const ProfilePage = lazy(() => import('src/pages/MasterPages/ProfilePage'));

// ---> Products pages
// const ProductListPage = lazy(
//   () => import('src/pages/ProductPages/ProductListPage'),
// );
// const ProductItemPage = lazy(
//   () => import('src/pages/ProductPages/ProductItemPage'),
// );
// const ProductNewPage = lazy(
//   () => import('src/pages/ProductPages/ProductNewPage'),
// );
// const ProductEditPage = lazy(
//   () => import('src/pages/ProductPages/ProductEditPage'),
// );

// ---> Error pages
const NotFoundPage = lazy(() => import('src/pages/ErrorPages/404Pages'));

const helmetContext = {};

export const Routes = () => {
  return (
    <BrowserRouter>
      <HelmetProvider context={helmetContext}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>React TS</title>
        </Helmet>

        <Suspense fallback={<Loading />}>
          <Switch>

            {/* PUBLIC ROUTES */}
            <Route exact path={PATH.LOGIN} component={LoginPage} />
            <Route exact path={PATH.HOME} component={LoginPage} />

            {/* PRIVATE ROUTES (WITH DASHBOARD LAYOUT) */}
            <PrivateRoute exact path={PATH.DASHBOARD} component={DashboardPage} />
            <PrivateRoute exact path={PATH.PROFILE} component={ProfilePage} />
            <PrivateRoute exact path={PATH.ANNOUNCE_MASTER} component={AnnounceMasterPage} />

            {/* ERROR */}
            <Route component={NotFoundPage} />

          </Switch>
        </Suspense>

      </HelmetProvider>
    </BrowserRouter>
  );
};
