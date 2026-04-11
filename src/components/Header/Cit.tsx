import React from 'react';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';
import { CitContent } from 'src/components/Cit/CitContent';

const Cit = () => {
  return (
    <AuthenticatedPageShell>
      <CitContent />
    </AuthenticatedPageShell>
  );
};

export { Cit };
