import React from 'react';
import { AuthenticatedPageShell } from 'src/components/Layout/AuthenticatedPageShell';

function ReceiveIdMasterPage() {
  return (
    <>
      <AuthenticatedPageShell>
        <div className="post d-flex flex-column-fluid my-5">
          <div className="container-fluid">
            <div className="card shadow-sm p-8">
              <h1 className="mb-5">Create New Receive ID</h1>
              <p>Your add form will go here...</p>
              {/* Start building your Form inside this card! */}
            </div>
          </div>
        </div>
      </AuthenticatedPageShell>
    </>
  );
}

export default ReceiveIdMasterPage;
