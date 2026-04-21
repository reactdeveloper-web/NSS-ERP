import React from 'react';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';
import CallDetailContent from 'src/components/CallDetail/CallDetailContent';

const CallDetail = () => {
  return (
    <AuthenticatedPageShell>
      <CallDetailContent />
    </AuthenticatedPageShell>
  );
};

export { CallDetail };