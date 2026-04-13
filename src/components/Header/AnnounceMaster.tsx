import React from 'react';
import { AnnounceMasterContent } from 'src/components/AnnounceMaster/AnnounceMasterContent';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';

const AnnounceMaster = () => {
  return (
    <AuthenticatedPageShell>
      <AnnounceMasterContent />
    </AuthenticatedPageShell>
  );
};

export { AnnounceMaster };
