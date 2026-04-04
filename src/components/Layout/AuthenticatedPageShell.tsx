import React, { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AuthFooter } from 'src/components/Footer/AuthFooter';
import { HeaderMenu } from 'src/components/Header/HeaderMenu';

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
    return null;
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
