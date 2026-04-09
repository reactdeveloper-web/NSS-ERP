import React, { useEffect, useRef } from 'react';
import {
  AddedAnnounceCause,
  AnnouncerTabKey,
  AnnounceDetailsForm,
  DepositBank,
  EventOption,
  FollowUpForm,
  FollowUpItem,
  PersonalInfoForm,
  SalutationOption,
} from '../types';
import { AnnounceDetailsTab } from './AnnounceDetailsTab';
import { BankDetailsTab } from './BankDetailsTab';
import { FollowUpTab } from './FollowUpTab';
import { PersonalInfoTab } from './PersonalInfoTab';

interface AnnouncerPersonalDetailsCardProps {
  activeTab: AnnouncerTabKey;
  personalInfoForm: PersonalInfoForm;
  salutations: SalutationOption[];
  stateOptions: EventOption[];
  districtOptions: EventOption[];
  isPincodeLocationLocked: boolean;
  announceDetailsForm: AnnounceDetailsForm;
  addedCauses: AddedAnnounceCause[];
  editingCauseId: number | null;
  occasionTypeOptions: EventOption[];
  causeHeadOptions: EventOption[];
  purposeOptions: EventOption[];
  howToDonateOptions: EventOption[];
  followUpForm: FollowUpForm;
  followUpItems: FollowUpItem[];
  banks: DepositBank[];
  bankLoading: boolean;
  bankError: string;
  selectedBankIds: string[];
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
  onTabChange: (tab: AnnouncerTabKey) => void;
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

const tabs: { key: AnnouncerTabKey; label: string; title: string }[] = [
  {
    key: 'personal',
    label: '1. Personal Information',
    title: 'Please fill personal details',
  },
  {
    key: 'announceDetails',
    label: '2. Announce Details',
    title: 'Please fill announce details',
  },
  {
    key: 'bankDetails',
    label: '3. Bank Details',
    title: 'Please select bank details',
  },
  {
    key: 'followUp',
    label: '4. Follow Up',
    title: 'Please fill follow up details',
  },
];

export const AnnouncerPersonalDetailsCard = ({
  activeTab,
  personalInfoForm,
  salutations,
  stateOptions,
  districtOptions,
  isPincodeLocationLocked,
  announceDetailsForm,
  addedCauses,
  editingCauseId,
  occasionTypeOptions,
  causeHeadOptions,
  purposeOptions,
  howToDonateOptions,
  followUpForm,
  followUpItems,
  banks,
  bankLoading,
  bankError,
  selectedBankIds,
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
  onTabChange,
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

  return (
    <div className="card card-flush">
      <div className="card-header border-bottom mb-4">
        <div className="card-title">
          <h3 className="fw-bold mb-0">Announcer Personal Details</h3>
        </div>
      </div>

      <div className="card-body pt-2">
        <ul
          ref={tabsRef}
          className="nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mb-6"
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
              onChange={onPersonalInfoChange}
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
              onAmountChange={onAmountChange}
              onAddCause={onAddCause}
              onChange={onAnnounceDetailsChange}
              onEditCause={onEditCause}
              onDeleteCause={onDeleteCause}
              onQuantityChange={onQuantityChange}
            />
          </div>

          <div
            className={`tab-pane fade ${
              activeTab === 'bankDetails' ? 'active show' : ''
            }`}
          >
            <BankDetailsTab
              banks={banks}
              isLoading={bankLoading}
              error={bankError}
              selectedBankIds={selectedBankIds}
              onToggleBank={onToggleBank}
            />
          </div>

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
      </div>

      <div className="card-body pt-2">
        <div className="d-flex flex-wrap gap-3">
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button className="btn btn-light" type="button" onClick={onReset}>
            Reset
          </button>
          <button className="btn btn-danger" type="button" onClick={onReset}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
