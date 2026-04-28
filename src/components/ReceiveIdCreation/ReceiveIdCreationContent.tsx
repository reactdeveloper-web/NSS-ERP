import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ReceiveIdCreationNav } from './ReceiveIdCreationNav';
import { ReceiveIdForm } from './components/ReceiveIdForm';
import { ReceiveIdListing } from './components/ReceiveIdListing';
import './ReceiveIdCreationContent.scss';

export const ReceiveIdCreationContent: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  // Toggle ('LIST') and the 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const operation = searchParams.get('Operation');

    setViewMode(operation ? 'FORM' : 'LIST');
  }, [location.search]);

  const handleAdd = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('RID', '0');
    searchParams.set('Operation', 'ADD');

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
    setViewMode('FORM');
  };

  const openReceiveIdForm = (
    receiveId: string,
    operation: 'EDIT' | 'VIEW',
  ) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('RID', receiveId);
    searchParams.set('Operation', operation);

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
    setViewMode('FORM');
  };

  const handleExit = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('RID');
    searchParams.delete('Operation');

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
    setViewMode('LIST');
  };

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
              onAdd={handleAdd}
              onEdit={receiveId => openReceiveIdForm(receiveId, 'EDIT')}
              onView={receiveId => openReceiveIdForm(receiveId, 'VIEW')}
            />
          )}

          {/* Form View */}

          {viewMode === 'FORM' && <ReceiveIdForm onExit={handleExit} />}
        </div>
        </div>
        </div>
      </div>
    </>
  );
};
