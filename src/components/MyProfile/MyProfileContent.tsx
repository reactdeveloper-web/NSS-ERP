import React from 'react';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';
import { UserTimeSheet } from './UserTimeSheet';

const MyProfileContent = () => {
  return (
    <AuthenticatedPageShell>
      <UserTimeSheet />
    </AuthenticatedPageShell>
  );
};

export { MyProfileContent };
