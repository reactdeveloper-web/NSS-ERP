import React, { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { AuthFooter } from 'src/components/Footer/AuthFooter';
import { HeaderMenu } from 'src/components/Header/HeaderMenu';
import { PATH } from 'src/constants/paths';

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  children: ReactNode;
}

const _AuthenticatedPageShell = (props: Props) => {
  const { children, isAuthenticated } = props;

  if (!isAuthenticated) {
    return <Redirect to={PATH.LOGIN} />;
  }

  return (
    <div className="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
      <HeaderMenu />
      {children}
      <AuthFooter />
    </div>
  );
};

const AuthenticatedPageShell = connector(_AuthenticatedPageShell);

export { AuthenticatedPageShell };
