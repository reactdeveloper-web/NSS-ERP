import React, { useEffect, useRef } from 'react';
import { Select } from 'antd';
import {
  AddedAnnounceCause,
  AnnouncerTabKey,
  AnnounceDetailsForm,
  AnnounceEventForm,
  AnnounceValidationErrors,
  DepositBank,
  DonorIdentificationForm,
  DonorSearchResult,
  EventOption,
  FollowUpForm,
  FollowUpItem,
  PersonalInfoForm,
  SalutationOption,
} from '../types';
import { AnnounceDetailsTab } from './AnnounceDetailsTab';
import { AnnounceEventCard } from './AnnounceEventCard';
import { BankDetailsTab } from './BankDetailsTab';
import { FollowUpTab } from './FollowUpTab';
import { PersonalInfoTab } from './PersonalInfoTab';

interface AnnouncerPersonalDetailsCardProps {
  activeTab: AnnouncerTabKey;
  donorIdentificationForm: DonorIdentificationForm;
  announceEventForm: AnnounceEventForm;
  personalInfoForm: PersonalInfoForm;
  salutations: SalutationOption[];
  stateOptions: EventOption[];
  districtOptions: EventOption[];
  donorOptions: DonorSearchResult[];
  isSearchingDonor: boolean;
  donorSearchError: string;
  showDonorModal: boolean;
  isPincodeLocationLocked: boolean;
  validationErrors: AnnounceValidationErrors;
  announceDetailsForm: AnnounceDetailsForm;
  addedCauses: AddedAnnounceCause[];
  editingCauseId: number | null;
  eventOptions: EventOption[];
  eventCauseOptions: EventOption[];
  eventCityOptions: EventOption[];
  eventChannelOptions: EventOption[];
  panditOptions: EventOption[];
  eventLoading: boolean;
  eventError: string;
  occasionTypeOptions: EventOption[];
  causeHeadOptions: EventOption[];
  purposeOptions: EventOption[];
  howToDonateOptions: EventOption[];
  banks: DepositBank[];
  bankLoading: boolean;
  bankError: string;
  selectedBankIds: string[];
  followUpForm: FollowUpForm;
  followUpItems: FollowUpItem[];
  amount: string;
  isAmountEditable: boolean;
  quantityControlMode: 'disabled' | 'stepper' | 'select';
  quantityOptions: { value: number; label: string }[];
  isAddCauseDisabled: boolean;
  isSaving: boolean;
  onAmountChange: (value: string) => void;
  onAddCause: () => void;
  onEditCause: (causeId: number) => void;
  onDeleteCause: (causeId: number) => void;
  onSave: () => void;
  onSelectDonor: (donor: DonorSearchResult) => void;
  onCloseDonorModal: () => void;
  onTabChange: (tab: AnnouncerTabKey) => void;
  onDonorIdentificationChange: <K extends keyof DonorIdentificationForm>(
    field: K,
    value: DonorIdentificationForm[K],
  ) => void;
  onAnnounceEventChange: <K extends keyof AnnounceEventForm>(
    field: K,
    value: AnnounceEventForm[K],
  ) => void;
  onPersonalInfoChange: <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => void;
  onAnnounceDetailsChange: <K extends keyof AnnounceDetailsForm>(
    field: K,
    value: AnnounceDetailsForm[K],
  ) => void;
  onFollowUpChange: <K extends keyof FollowUpForm>(
    field: K,
    value: FollowUpForm[K],
  ) => void;
  onQuantityChange: (nextQuantity: number) => void;
  onToggleBank: (bankId: string) => void;
  onAddFollowUp: () => void;
  onRemoveFollowUp: (id: number) => void;
  onReset: () => void;
}

export const AnnouncerPersonalDetailsCard = ({
  activeTab,
  donorIdentificationForm,
  announceEventForm,
  personalInfoForm,
  salutations,
  stateOptions,
  districtOptions,
  donorOptions,
  isSearchingDonor,
  donorSearchError,
  showDonorModal,
  isPincodeLocationLocked,
  validationErrors,
  announceDetailsForm,
  addedCauses,
  editingCauseId,
  eventOptions,
  eventCauseOptions,
  eventCityOptions,
  eventChannelOptions,
  panditOptions,
  eventLoading,
  eventError,
  occasionTypeOptions,
  causeHeadOptions,
  purposeOptions,
  howToDonateOptions,
  banks,
  bankLoading,
  bankError,
  selectedBankIds,
  followUpForm,
  followUpItems,
  amount,
  isAmountEditable,
  quantityControlMode,
  quantityOptions,
  isAddCauseDisabled,
  isSaving,
  onAmountChange,
  onAddCause,
  onEditCause,
  onDeleteCause,
  onSave,
  onSelectDonor,
  onCloseDonorModal,
  onTabChange,
  onDonorIdentificationChange,
  onAnnounceEventChange,
  onPersonalInfoChange,
  onAnnounceDetailsChange,
  onFollowUpChange,
  onQuantityChange,
  onToggleBank,
  onAddFollowUp,
  onRemoveFollowUp,
  onReset,
}: AnnouncerPersonalDetailsCardProps) => {
  const tabsRef = useRef<HTMLUListElement | null>(null);
  const showBankDetailsTab = ['Online', 'Pay-In-Slip'].includes(
    announceDetailsForm.paymentMode,
  );
  const donorSearchOptions = [
    { value: 'donorId', label: 'Donor ID' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'email', label: 'Email' },
    { value: 'aadhaar', label: 'Aadhaar' },
    { value: 'pan', label: 'PAN Number' },
  ];

  useEffect(() => {
    const bootstrap = (window as Window & {
      bootstrap?: {
        Tooltip?: new (element: Element, options?: Record<string, unknown>) => {
          dispose?: () => void;
        };
      };
    }).bootstrap;

    if (!bootstrap?.Tooltip || !tabsRef.current) {
      return;
    }

    const tooltipElements = Array.from(
      tabsRef.current.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    const tooltips = tooltipElements.map(
      element => new bootstrap.Tooltip!(element, { trigger: 'hover' }),
    );

    return () => {
      tooltips.forEach(tooltip => tooltip.dispose?.());
    };
  }, []);

  const tabs: { key: AnnouncerTabKey; label: string; title: string }[] = [
    {
      key: 'personal',
      label: '1. Personal Information',
      title: 'Please fill personal details',
    },
    {
      key: 'announceEvent',
      label: '2. Announce Event',
      title: 'Please fill announce event details',
    },
    {
      key: 'announceDetails',
      label: '3. Announce Details',
      title: 'Please fill announce details',
    },
    ...(showBankDetailsTab
      ? [
          {
            key: 'bankDetails' as AnnouncerTabKey,
            label: '4. Bank Details',
            title: 'Please select bank details',
          },
        ]
      : []),
    {
      key: 'followUp',
      label: showBankDetailsTab ? '5. Follow Up' : '4. Follow Up',
      title: 'Please fill follow up details',
    },
  ];

  return (
    <div className="card announce-master-card">
      <div className="card-header announce-master-card-header">
        <div className="card-title">
          <h3 className="fw-bold mb-0">Announcer Personal Details</h3>
        </div>
        <div className="announce-master-header-tools">
          <Select
            className="announce-master-header-select"
            value={donorIdentificationForm.donorSearchType || undefined}
            onChange={nextValue =>
              onDonorIdentificationChange(
                'donorSearchType',
                (nextValue as string) || 'donorId',
              )
            }
            options={donorSearchOptions}
          />
          <div className="announce-master-search-wrap">
            <input
              id="donorSearchValue"
              type="text"
              className="form-control announce-master-search-input"
              placeholder={
                donorSearchOptions.find(
                  option =>
                    option.value === donorIdentificationForm.donorSearchType,
                )?.label ?? 'Donor ID'
              }
              value={donorIdentificationForm.donorId}
              onChange={event =>
                onDonorIdentificationChange('donorId', event.target.value)
              }
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

      <div className="card-body p-6">
        <ul
          ref={tabsRef}
          className="nav announce-master-tabs fs-6 fw-semibold m-0 p-0 mb-4"
        >
          {tabs.map(tab => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-trigger="hover"
                data-bs-title={tab.title}
                title={tab.title}
                aria-pressed={activeTab === tab.key}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          <div
            className={`tab-pane fade ${
              activeTab === 'personal' ? 'active show' : ''
            }`}
          >
            <PersonalInfoTab
              form={personalInfoForm}
              salutations={salutations}
              stateOptions={stateOptions}
              districtOptions={districtOptions}
              isPincodeLocationLocked={isPincodeLocationLocked}
              errors={validationErrors}
              onChange={onPersonalInfoChange}
            />
          </div>

          <div
            className={`tab-pane fade ${
              activeTab === 'announceEvent' ? 'active show' : ''
            }`}
          >
            <AnnounceEventCard
              form={announceEventForm}
              eventOptions={eventOptions}
              eventCauseOptions={eventCauseOptions}
              eventCityOptions={eventCityOptions}
              eventChannelOptions={eventChannelOptions}
              panditOptions={panditOptions}
              eventLoading={eventLoading}
              eventError={eventError}
              errors={validationErrors}
              onChange={onAnnounceEventChange}
            />
          </div>

          <div
            className={`tab-pane fade ${
              activeTab === 'announceDetails' ? 'active show' : ''
            }`}
          >
            <AnnounceDetailsTab
              form={announceDetailsForm}
              addedCauses={addedCauses}
              editingCauseId={editingCauseId}
              occasionTypeOptions={occasionTypeOptions}
              causeHeadOptions={causeHeadOptions}
              purposeOptions={purposeOptions}
              howToDonateOptions={howToDonateOptions}
              amount={amount}
              isAmountEditable={isAmountEditable}
              quantityControlMode={quantityControlMode}
              quantityOptions={quantityOptions}
              isAddCauseDisabled={isAddCauseDisabled}
              errors={validationErrors}
              onAmountChange={onAmountChange}
              onAddCause={onAddCause}
              onChange={onAnnounceDetailsChange}
              onEditCause={onEditCause}
              onDeleteCause={onDeleteCause}
              onQuantityChange={onQuantityChange}
            />
          </div>

          {showBankDetailsTab ? (
            <div
              className={`tab-pane fade ${
                activeTab === 'bankDetails' ? 'active show' : ''
              }`}
            >
              <BankDetailsTab
                banks={banks}
                isLoading={bankLoading}
                error={bankError}
                validationError={validationErrors.bankSelection}
                selectedBankIds={selectedBankIds}
                onToggleBank={onToggleBank}
              />
            </div>
          ) : null}

          <div
            className={`tab-pane fade ${
              activeTab === 'followUp' ? 'active show' : ''
            }`}
          >
            <FollowUpTab
              form={followUpForm}
              items={followUpItems}
              onChange={onFollowUpChange}
              onAdd={onAddFollowUp}
              onRemove={onRemoveFollowUp}
            />
          </div>
        </div>

        {donorSearchError ? (
          <div className="text-danger fs-7 mt-4 px-7">{donorSearchError}</div>
        ) : null}
      </div>

      <div className="card-body pt-0">
        <div className="d-flex flex-wrap gap-3 announce-master-footer-actions">
          <button
            className="btn announce-master-btn announce-master-btn-save"
            type="button"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="btn announce-master-btn announce-master-btn-reset"
            type="button"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            className="btn announce-master-btn announce-master-btn-cancel"
            type="button"
            onClick={onReset}
          >
            Cancel
          </button>
        </div>
      </div>

      {showDonorModal ? (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header p-4">
                  <h4 className="modal-title">Multiple Donor IDs Found</h4>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onCloseDonorModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="text-muted fs-7 mb-4">
                    Select the donor ID you want to use for this mobile number.
                  </div>
                  <div
                    className="table-responsive"
                    style={{ maxHeight: '320px', overflowY: 'auto' }}
                  >
                    <table className="table table-row-bordered align-middle">
                      <thead>
                        <tr className="fw-bold text-gray-800">
                          <th>Donor ID</th>
                          <th>Name</th>
                          <th>Mobile</th>
                          <th>Email</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donorOptions.map(donor => (
                          <tr key={`${donor.donorId}-${donor.mobileNo}`}>
                            <td>{donor.donorId || '-'}</td>
                            <td>{donor.donorName || '-'}</td>
                            <td>{donor.mobileNo || '-'}</td>
                            <td>{donor.email || '-'}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => onSelectDonor(donor)}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={onCloseDonorModal}
          />
        </>
      ) : null}
    </div>
  );
};
