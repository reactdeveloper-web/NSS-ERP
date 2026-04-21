import React, { useState } from 'react';
import { ReceiveIdCreationNav } from './ReceiveIdCreationNav';
import { ReceiveIdForm } from './components/ReceiveIdForm';
import { ReceiveIdListing } from './components/ReceiveIdListing';
import './ReceiveIdCreationContent.scss';

export const ReceiveIdCreationContent: React.FC = () => {

  // Toggle ('LIST') and the 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');

  return (
    <>
     
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
         <ReceiveIdCreationNav />
         <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-0">
<div className="card announce-master-card">
          {/* LISTING / TABLE VIEW */}

          {viewMode === 'LIST' && (
            <ReceiveIdListing
              onAdd={() => setViewMode('FORM')}
              onEdit={() => setViewMode('FORM')}
              onView={() => setViewMode('FORM')}
            />
          )}

          {/* Form View */}

          {viewMode === 'FORM' && <ReceiveIdForm onExit={() => setViewMode('LIST')} />}
        </div>
        </div>
        </div>
      </div>
    </>
  );
};
