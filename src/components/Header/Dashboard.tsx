import React from 'react';
import { HeaderContent } from 'src/components/Header/HeaderContent';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';

const Dashboard = () => {
  return (
    <AuthenticatedPageShell>
      <HeaderContent />
    </AuthenticatedPageShell>
  );
};

export { Dashboard };
