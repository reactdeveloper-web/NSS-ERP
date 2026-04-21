import React from 'react';
import { CallCenterTicketTab } from './components/CallCenterTicketTab';
import { CitListing } from './components/CitListing';
import { TicketFollowUpTab } from './components/TicketFollowUpTab';
import { PageToolbar } from '../Common/PageToolbar';
import { FloatingTextareaField } from '../Common/FloatingTextareaField';
import { useCitContentState } from './useCitContentState';

export const CitContent = () => {
  const {
    operation,
    isListingMode,
    isViewMode,
    activeTab,
    setActiveTab,
    completed,
    completionLocked,
    setCompleted,
    ticketForm,
    donorSearchValue,
    setDonorSearchValue,
    isSearchingDonor,
    donorSearchError,
    callCategoryOptions,
    countryApiDataFlag,
    selectTypeOptions,
    selectSadhakOptions,
    followUps,
    deletingId,
    statusMessage,
    validationErrors,
    openCitListing,
    openCitForm,
    handleTicketFormChange,
    handleCallCategoryChange,
    handleSelectTypeChange,
    handleSelectSadhakChange,
    handleAddFollowUp,
    handleFollowUpChange,
    handleRemoveFollowUp,
    handleReset,
    handleSave,
    handleDelete,
  } = useCitContentState();
  const shouldShowTicketIdBadge =
    !isListingMode &&
    ticketForm.ticketId.trim() !== '' &&
    ticketForm.ticketId !== 'AUTO/VIEW';
  const isCompletionEditable = operation === 'EDIT' && !completionLocked;

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
        <div id="kt_content_container" className="container-fluid py-0">
          {statusMessage ? (
            <div className="alert alert-success">{statusMessage}</div>
          ) : null}
          {isListingMode ? (
            <CitListing
              deletingId={deletingId}
              onAdd={() => openCitForm('0', 'ADD')}
              onEdit={informationCode => openCitForm(informationCode, 'EDIT')}
              onView={informationCode => openCitForm(informationCode, 'VIEW')}
              onDelete={handleDelete}
            />
          ) : (
            <div className="card announce-master-card mb-8">
              <div className="card-header announce-master-card-header">
                <div className="card-title">
                  <div className="d-flex align-items-center gap-4 flex-wrap">
                    <h3 className="fw-bold mb-0">
                      Call Information Trait
                      <span className="text-muted fs-6 px-2">
                        {shouldShowTicketIdBadge ? (
                          <span className="badge badge-light-primary fs-6 fw-semibold px-4 py-2 me-3">
                            <i className="fas fa-receipt text-primary me-2"></i>
                            Ticket ID: {ticketForm.ticketId}
                          </span>
                        ) : null}
                        <span className="badge badge-light-info fs-6 fw-semibold px-4 py-2">
                          <i className="fas fa-calendar-alt text-info me-2"></i>
                          {ticketForm.date
                            ? ticketForm.date.split('-').reverse().join('/')
                            : '-'}
                        </span>
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="announce-master-header-tools">
                  <div className="announce-master-search-wrap">
                    <input
                      id="citDonorSearchValue"
                      type="text"
                      className="form-control announce-master-search-input"
                      placeholder="Search by NG Code"
                      value={donorSearchValue}
                      disabled={isViewMode}
                      onChange={event => setDonorSearchValue(event.target.value)}
                    />
                    <span className="announce-master-search-icon">
                      {isSearchingDonor ? (
                        <span
                          className="spinner-border spinner-border-sm text-muted"
                          role="status"
                          aria-label="Searching donor"
                        />
                      ) : (
                        <i className="fa fa-search" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {donorSearchError ? (
                  <div className="text-danger fs-7 mb-4">{donorSearchError}</div>
                ) : null}
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
                      callCategoryOptions={callCategoryOptions}
                      countryApiDataFlag={countryApiDataFlag}
                      selectTypeOptions={selectTypeOptions}
                      selectSadhakOptions={selectSadhakOptions}
                      disabled={isViewMode}
                      requestByReadOnly={operation === 'EDIT' || isViewMode}
                      errors={validationErrors}
                      onChange={handleTicketFormChange}
                      onCallCategoryChange={handleCallCategoryChange}
                      onSelectTypeChange={handleSelectTypeChange}
                      onSelectSadhakChange={handleSelectSadhakChange}
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
                  <div className="d-flex gap-3" style={{ minWidth: '50%' }}>
                    <label className="form-check form-check-custom form-check-solid mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={completed}
                        disabled={!isCompletionEditable}
                        onChange={event =>
                          setCompleted(event.target.checked)
                        }
                      />
                      <span className="form-check-label fw-semibold">
                        Completed
                      </span>
                    </label>

                    {completed ? (
                      <div className="w-500px">
                        <FloatingTextareaField
                          id="completionReply"
                          label={
                            <>
                              Reply <span className="text-danger">*</span>
                            </>
                          }
                          value={ticketForm.completionReply}
                          disabled={!isCompletionEditable}
                          readOnly={!isCompletionEditable}
                          onChange={value =>
                            handleTicketFormChange('completionReply', value)
                          }
                          error={validationErrors.completionReply}
                        />
                      </div>
                    ) : null}
                  </div>

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
    </div>
  );
};
