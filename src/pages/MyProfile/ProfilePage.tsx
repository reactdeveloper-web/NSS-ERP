import React from 'react';
import { ProfileMasterContent } from 'src/components/ProfileMaster/ProfileMasterContent';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';

const ProfileMasterPage = () => {
  return (
    <>
    <AuthenticatedPageShell>
      <ProfileMasterContent />
    </AuthenticatedPageShell>
    </>
  );
};

export default ProfileMasterPage;
