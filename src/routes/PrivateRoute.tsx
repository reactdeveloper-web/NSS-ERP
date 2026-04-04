import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { MainLayout } from 'src/pages/layouts/MainLayout';
import { PATH } from 'src/constants/paths';

export const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const isAuth = true; // replace later with real auth

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? (
          <MainLayout>
            <Component {...props} />
          </MainLayout>
        ) : (
          <Redirect to={PATH.LOGIN} />
        )
      }
    />
  );
};