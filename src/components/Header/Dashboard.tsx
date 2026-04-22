import React from 'react';
import { DashboardContent } from 'src/components/Dashboard/DashboardContent';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';

const Dashboard = () => {
  return (
    <AuthenticatedPageShell>
      <DashboardContent />
    </AuthenticatedPageShell>
  );
};

export { Dashboard };
