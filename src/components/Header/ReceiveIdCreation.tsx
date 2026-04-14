import React from 'react';
import { AuthenticatedPageShell } from '../Layout/AuthenticatedPageShell';
import ReceiveIdCreationContent from '../ReceiveIdCreation/ReceiveIdCreationContent';

function ReceiveIdCreation() {
  return (
    <>
      <AuthenticatedPageShell>
        <ReceiveIdCreationContent />
      </AuthenticatedPageShell>
    </>
  );
}

export default ReceiveIdCreation;
