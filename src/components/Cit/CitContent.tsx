import React from 'react';
import { CallCenterTicketTab } from './components/CallCenterTicketTab';
import { CitListing } from './components/CitListing';
import { TicketFollowUpTab } from './components/TicketFollowUpTab';
import { CitSaveResultModal } from './components/CitModals';
import { PageToolbar } from '../Common/PageToolbar';
import { useCitContentState } from './useCitContentState';

export const CitContent = () => {
  const {
    operation,
    isListingMode,
    isViewMode,
    activeTab,
    setActiveTab,
    completed,
    setCompleted,
    ticketForm,
    followUps,
    deletingId,
    statusMessage,
    listingLoading,
    listingError,
    validationErrors,
    showSaveResultModal,
    saveResultPayload,
    listingItems,
    openCitListing,
    openCitForm,
    handleCloseSaveResultModal,
    handleTicketFormChange,
    handleAddFollowUp,
    handleFollowUpChange,
    handleRemoveFollowUp,
    handleReset,
    handleSave,
    handleDelete,
  } = useCitContentState();

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      <PageToolbar
        title="National Gangotri"
        description="Call Information Trait"
      />
      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-6">
          {statusMessage ? (
            <div className="alert alert-success">{statusMessage}</div>
          ) : null}
          {isListingMode ? (
            <CitListing
              deletingId={deletingId}
              items={listingItems}
              loading={listingLoading}
              error={listingError}
              onAdd={() => openCitForm('0', 'ADD')}
              onEdit={informationCode => openCitForm(informationCode, 'EDIT')}
              onView={informationCode => openCitForm(informationCode, 'VIEW')}
              onDelete={handleDelete}
            />
          ) : (
            <div className="card mb-8">
              <div className="card-header">
                <div className="card-title">
                  <div className="d-flex align-items-center gap-4 flex-wrap">
                    <h3 className="fw-bold mb-0">Call Information Trait</h3>
                    <span className="text-muted fs-6">
                      {operation === 'ADD'
                        ? 'Add'
                        : operation === 'EDIT'
                        ? 'Edit'
                        : 'View'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="tabs-mobile-scroll">
                  <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mb-6">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === 'cit' ? 'active' : ''
                        }`}
                        type="button"
                        onClick={() => setActiveTab('cit')}
                      >
                        1. Call Information Trait
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === 'followup' ? 'active' : ''
                        }`}
                        type="button"
                        onClick={() => setActiveTab('followup')}
                      >
                        2. Follow Up
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="tab-content">
                  <div
                    className={`tab-pane fade ${
                      activeTab === 'cit' ? 'show active' : ''
                    }`}
                  >
                    <CallCenterTicketTab
                      form={ticketForm}
                      disabled={isViewMode}
                      errors={validationErrors}
                      onChange={handleTicketFormChange}
                    />
                  </div>

                  <div
                    className={`tab-pane fade ${
                      activeTab === 'followup' ? 'show active' : ''
                    }`}
                  >
                    <TicketFollowUpTab
                      items={followUps}
                      disabled={isViewMode}
                      onAdd={handleAddFollowUp}
                      onRemove={handleRemoveFollowUp}
                      onChange={handleFollowUpChange}
                    />
                  </div>
                </div>

                <div className="separator separator-dashed my-6"></div>

                <div className="d-flex justify-content-between pt-1 px-0 flex-wrap gap-4">
                  <label className="form-check form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={completed}
                      disabled={isViewMode}
                      onChange={event => setCompleted(event.target.checked)}
                    />
                    <span className="form-check-label fw-semibold">
                      Completed
                    </span>
                  </label>

                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSave}
                    >
                      {isViewMode ? 'Back' : 'Save'}
                    </button>
                    <button
                      className="btn btn-light-danger"
                      type="button"
                      onClick={handleReset}
                      disabled={isViewMode}
                    >
                      Reset
                    </button>
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={openCitListing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CitSaveResultModal
        open={showSaveResultModal}
        resultPayload={saveResultPayload}
        onClose={handleCloseSaveResultModal}
      />
    </div>
  );
};
