import React from 'react';
import { AnnouncerTabKey, AnnounceDetailsForm, FollowUpForm, FollowUpItem, PersonalInfoForm } from '../types';
import { AnnounceDetailsTab } from './AnnounceDetailsTab';
import { BankDetailsTab } from './BankDetailsTab';
import { FollowUpTab } from './FollowUpTab';
import { PersonalInfoTab } from './PersonalInfoTab';

interface AnnouncerPersonalDetailsCardProps {
  activeTab: AnnouncerTabKey;
  personalInfoForm: PersonalInfoForm;
  announceDetailsForm: AnnounceDetailsForm;
  followUpForm: FollowUpForm;
  followUpItems: FollowUpItem[];
  selectedBankIds: string[];
  amount: number;
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
    label: 'Personal Information',
    title: 'Please fill personal details',
  },
  {
    key: 'announceDetails',
    label: 'Announce Details',
    title: 'Please fill announce details',
  },
  {
    key: 'bankDetails',
    label: 'Bank Details',
    title: 'Please select bank details',
  },
  {
    key: 'followUp',
    label: 'Follow Up',
    title: 'Please fill follow up details',
  },
];

export const AnnouncerPersonalDetailsCard = ({
  activeTab,
  personalInfoForm,
  announceDetailsForm,
  followUpForm,
  followUpItems,
  selectedBankIds,
  amount,
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
  return (
    <div className="card card-flush">
      <div className="card-header border-bottom mb-4">
        <div className="card-title">
          <h3 className="fw-bold mb-0">Announcer Personal Details</h3>
        </div>
      </div>

      <div className="card-body pt-2">
        <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mb-6">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                type="button"
                title={tab.title}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {activeTab === 'personal' ? (
            <PersonalInfoTab form={personalInfoForm} onChange={onPersonalInfoChange} />
          ) : null}

          {activeTab === 'announceDetails' ? (
            <AnnounceDetailsTab
              form={announceDetailsForm}
              amount={amount}
              onChange={onAnnounceDetailsChange}
              onQuantityChange={onQuantityChange}
            />
          ) : null}

          {activeTab === 'bankDetails' ? (
            <BankDetailsTab
              selectedBankIds={selectedBankIds}
              onToggleBank={onToggleBank}
            />
          ) : null}

          {activeTab === 'followUp' ? (
            <FollowUpTab
              form={followUpForm}
              items={followUpItems}
              onChange={onFollowUpChange}
              onAdd={onAddFollowUp}
              onRemove={onRemoveFollowUp}
            />
          ) : null}
        </div>
      </div>

      <div className="card-body pt-2">
        <div className="d-flex flex-wrap gap-3">
          <button className="btn btn-primary" type="button">
            Save
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
