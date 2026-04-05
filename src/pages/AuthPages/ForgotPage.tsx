import React from 'react';
import { Forgot } from 'src/components/Auth/Forgot';
//import { PageLayout } from 'src/pages/layouts/PageLayout';

const _ForgotPage = () => {
  return (
    // <PageLayout>
      <Forgot />
    // </PageLayout>
  );
};

const ForgotPage = React.memo(_ForgotPage);
export default ForgotPage;
