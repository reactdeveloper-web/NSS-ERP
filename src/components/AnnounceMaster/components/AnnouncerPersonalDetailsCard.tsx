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
  operation?: 'ADD' | 'EDIT' | 'VIEW';
  announceId?: string;
  saveResultItems?: Array<Record<string, unknown>>;
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
  isTabContentLoading?: boolean;
  isViewMode?: boolean;
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
  onCancel?: () => void;
}

export const AnnouncerPersonalDetailsCard = ({
  activeTab,
  operation = 'ADD',
  announceId = '0',
  saveResultItems,
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
  isTabContentLoading = false,
  isViewMode = false,
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
  onCancel,
}: AnnouncerPersonalDetailsCardProps) => {
  const tabsRef = useRef<HTMLUListElement | null>(null);
  const previousActiveTabRef = useRef<AnnouncerTabKey>(activeTab);
  const showBankDetailsTab = ['Online', 'Pay-In-Slip'].includes(
    announceDetailsForm.paymentMode,
  );
  const formattedAnnounceDate = donorIdentificationForm.announceDate
    ? donorIdentificationForm.announceDate.split('-').reverse().join('/')
    : '-';
  const donorSearchOptions = [
    { value: 'donorId', label: 'Donor ID' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'email', label: 'Email' },
    { value: 'aadhaar', label: 'Aadhaar' },
    { value: 'pan', label: 'PAN Number' },
  ];
  const shouldShowAnnounceIdBadge =
    ['EDIT', 'VIEW'].includes(operation) && announceId !== '0';

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

  const previousActiveTab = previousActiveTabRef.current;
  const currentTabIndex = tabs.findIndex(tab => tab.key === activeTab);
  const previousTabIndex = tabs.findIndex(tab => tab.key === previousActiveTab);
  const tabAnimationClass =
    previousTabIndex === -1 || currentTabIndex === previousTabIndex
      ? ''
      : currentTabIndex > previousTabIndex
      ? 'fade-right'
      : 'fade-left';

  useEffect(() => {
    previousActiveTabRef.current = activeTab;
  }, [activeTab]);

  const getTabPaneClassName = (tabKey: AnnouncerTabKey) =>
    `tab-pane fade ${
      activeTab === tabKey ? `active show ${tabAnimationClass}`.trim() : ''
    }`.trim();

  return (
    <>
      {saveResultItems?.length ? (
        <div className="mb-4 w-100">
          {saveResultItems.map((item, index) => (
            <div
              key={`${String(item.code ?? index)}-${index}`}
              className={`alert ${
                String(item.status || '').toLowerCase() === 'success'
                  ? 'alert-success'
                  : 'alert-danger'
              } py-3 mb-3`}
            >
              <div className="fw-semibold">
                {String(item.msg || 'No message returned.')}
              </div>
              <div className="fs-8 mt-1 text-muted">
                Code: {String(item.code ?? '-')} | Status:{' '}
                {String(item.status ?? '-')}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="card announce-master-card">
        <div className="card-header announce-master-card-header">
          <div className="card-title">
            <div className="d-flex align-items-center gap-4 flex-wrap">
              <h3 className="fw-bold mb-0">
                Announcer Personal Details
                <span className="text-muted fs-6 px-2">
                  {shouldShowAnnounceIdBadge ? (
                    <span className="badge badge-light-primary fs-6 fw-semibold px-4 py-2 me-3">
                      <i className="fas fa-receipt text-primary me-2"></i>
                      Announce ID: {announceId}
                    </span>
                  ) : null}
                  <span className="badge badge-light-info fs-6 fw-semibold px-4 py-2">
                    <i className="fas fa-calendar-alt text-info me-2"></i>
                    {formattedAnnounceDate}
                  </span>
                </span>
              </h3>
            </div>
          </div>
          <div className="announce-master-header-tools">
            <Select
              className="announce-master-header-select"
              value={donorIdentificationForm.donorSearchType || undefined}
              disabled={isViewMode}
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
                disabled={isViewMode}
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
          <div className="tabs-mobile-scroll">
            <ul
              ref={tabsRef}
              className="nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mb-6"
            >
              {tabs.map(tab => (
                <li className="nav-item" key={tab.key}>
                  <button
                    className={`nav-link ${
                      activeTab === tab.key ? 'active' : ''
                    }`}
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
          </div>

          <div className="tab-content">
            {isTabContentLoading ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-20">
                <span
                  className="spinner-border text-primary mb-4"
                  role="status"
                  aria-label="Loading announcement details"
                />
                <div className="text-muted fs-6">
                  Loading announcement details...
                </div>
              </div>
            ) : (
              <>
                <div className={getTabPaneClassName('personal')}>
                  <PersonalInfoTab
                    form={personalInfoForm}
                    salutations={salutations}
                    stateOptions={stateOptions}
                    districtOptions={districtOptions}
                    isPincodeLocationLocked={isPincodeLocationLocked}
                    errors={validationErrors}
                    isViewMode={isViewMode}
                    onChange={onPersonalInfoChange}
                  />
                </div>

                <div className={getTabPaneClassName('announceEvent')}>
                  <AnnounceEventCard
                    form={announceEventForm}
                    eventOptions={eventOptions}
                    eventCauseOptions={eventCauseOptions}
                    eventCityOptions={eventCityOptions}
                    eventChannelOptions={eventChannelOptions}
                    panditOptions={panditOptions}
                    eventLoading={eventLoading}
                    eventError={eventError}
                    isViewMode={isViewMode}
                    errors={validationErrors}
                    onChange={onAnnounceEventChange}
                  />
                </div>

                <div className={getTabPaneClassName('announceDetails')}>
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
                    isViewMode={isViewMode}
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
                  <div className={getTabPaneClassName('bankDetails')}>
                    <BankDetailsTab
                      banks={banks}
                      isLoading={bankLoading}
                      error={bankError}
                      validationError={validationErrors.bankSelection}
                      selectedBankIds={selectedBankIds}
                      isViewMode={isViewMode}
                      onToggleBank={onToggleBank}
                    />
                  </div>
                ) : null}

                <div className={getTabPaneClassName('followUp')}>
                  <FollowUpTab
                    form={followUpForm}
                    items={followUpItems}
                    isViewMode={isViewMode}
                    onChange={onFollowUpChange}
                    onAdd={onAddFollowUp}
                    onRemove={onRemoveFollowUp}
                  />
                </div>
              </>
            )}
          </div>

          {donorSearchError ? (
            <div className="text-danger fs-7 mt-4 px-7">{donorSearchError}</div>
          ) : null}
        </div>

        <div className="card-body pt-0">
          <div className="separator separator-dashed mb-6"></div>
          <div className="d-flex flex-wrap gap-5 mb-6">
            <label className="form-check form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={donorIdentificationForm.urgentFollowup}
                disabled={isViewMode}
                onChange={event =>
                  onDonorIdentificationChange(
                    'urgentFollowup',
                    event.target.checked,
                  )
                }
              />
              <span className="form-check-label fw-semibold">
                Urgent Follow-up Needed
              </span>
            </label>

            <label className="form-check form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={donorIdentificationForm.followupNotRequired}
                disabled={isViewMode}
                onChange={event =>
                  onDonorIdentificationChange(
                    'followupNotRequired',
                    event.target.checked,
                  )
                }
              />
              <span className="form-check-label fw-semibold">
                Follow-up Not Required
              </span>
            </label>
          </div>
          <div className="d-flex flex-wrap gap-3 announce-master-footer-actions">
            {!isViewMode ? (
              <button
                className="btn announce-master-btn announce-master-btn-save"
                type="button"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            ) : null}
            <button
              className="btn announce-master-btn announce-master-btn-reset"
              type="button"
              onClick={onReset}
              disabled={isViewMode}
            >
              Reset
            </button>
            <button
              className="btn announce-master-btn announce-master-btn-cancel"
              type="button"
              onClick={onCancel ?? onReset}
            >
              Cancel
            </button>
          </div>
        </div>

        {showDonorModal ? (
          <>
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
            >
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
                      Select the donor ID you want to use for this mobile
                      number.
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
                                  disabled={isViewMode}
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
    </>
  );
};
