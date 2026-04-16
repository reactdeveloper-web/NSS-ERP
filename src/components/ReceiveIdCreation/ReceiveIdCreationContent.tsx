import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import { ReceiveIdCreationNav } from './ReceiveIdCreationNav';

export const ReceiveIdCreationContent: React.FC = () => {
  const history = useHistory();

  // Read query params — same pattern as AnnounceMasterContent
  const queryParams = new URLSearchParams(window.location.search);
  const operation = (queryParams.get('Operation') || '').toUpperCase();
  const receiveIdParam = queryParams.get('ReceiveID') || '0';
  const isListingMode = !queryParams.get('Operation');
  const isAddMode = operation === 'ADD';
  const isEditMode = operation === 'EDIT';
  const isViewMode = operation === 'VIEW';

  // Navigate to listing
  const openListing = useCallback(() => {
    history.push(PATH.RECEIVE_ID_CREATION);
  }, [history]);

  // Navigate to add form — same URL pattern as Announce Master
  const openForm = useCallback(
    (receiveId: string, nextOperation: 'ADD' | 'EDIT' | 'VIEW') => {
      history.push(
        `${PATH.RECEIVE_ID_CREATION}?ReceiveID=${receiveId}&Operation=${nextOperation}`,
      );
    },
    [history],
  );

  return (
    <>
      <ReceiveIdCreationNav />

      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-xxl" id="kt_content_container">
          {/* ── LISTING VIEW ── */}
          {isListingMode && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="card-label fw-bolder fs-3 mb-1">
                    Receive ID Details
                  </h3>
                </div>
                <div className="card-toolbar">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary p-3 fs-6"
                    onClick={() => openForm('0', 'ADD')}
                  >
                    <span className="me-1">
                      <i className="fa fa-plus fs-7" aria-hidden="true" />
                    </span>
                    Add
                  </button>
                </div>
              </div>

              <div className="card-body p-5">
                {/* TODO: Replace with your actual listing table/component */}
                <p className="text-muted">
                  Receive ID listing will appear here.
                </p>
              </div>
            </div>
          )}

          {/* ── FORM VIEW (ADD / EDIT / VIEW) ── */}
          {(isAddMode || isEditMode || isViewMode) && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="card-label fw-bolder fs-3 mb-1">
                    {isAddMode
                      ? 'Add Receive ID'
                      : isEditMode
                      ? `Edit Receive ID — ${receiveIdParam}`
                      : `View Receive ID — ${receiveIdParam}`}
                  </h3>
                </div>
                <div className="card-toolbar">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={openListing}
                  >
                    <i className="fa fa-arrow-left me-2" />
                    Back to List
                  </button>
                </div>
              </div>

              <div className="card-body p-5">
                {/* TODO: Replace with your actual Receive ID form component */}
                <p className="text-muted">
                  Receive ID form (Operation: <strong>{operation}</strong>,
                  ReceiveID: <strong>{receiveIdParam}</strong>) will appear
                  here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
