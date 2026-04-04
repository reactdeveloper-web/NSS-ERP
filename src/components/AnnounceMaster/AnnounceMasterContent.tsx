import React, { useMemo, useState } from 'react';
import { AnnounceMasterNav } from './AnnounceMasterNav';
import {
  createInitialAnnounceDetailsForm,
  createInitialAnnounceEventForm,
  createInitialDonorIdentificationForm,
  createInitialFollowUpForm,
  createInitialPersonalInfoForm,
} from './data';
import { AnnounceEventCard } from './components/AnnounceEventCard';
import { AnnouncerPersonalDetailsCard } from './components/AnnouncerPersonalDetailsCard';
import { DonorIdentificationCard } from './components/DonorIdentificationCard';
import {
  AnnouncerTabKey,
  AnnounceDetailsForm,
  AnnounceEventForm,
  DonorIdentificationForm,
  FollowUpForm,
  FollowUpItem,
  PersonalInfoForm,
} from './types';

const getToday = () => new Date().toISOString().split('T')[0];

export const AnnounceMasterContent = () => {
  const [donorIdentificationForm, setDonorIdentificationForm] =
    useState<DonorIdentificationForm>(() =>
      createInitialDonorIdentificationForm(getToday()),
    );
  const [announceEventForm, setAnnounceEventForm] = useState<AnnounceEventForm>(
    createInitialAnnounceEventForm,
  );
  const [personalInfoForm, setPersonalInfoForm] = useState<PersonalInfoForm>(
    createInitialPersonalInfoForm,
  );
  const [announceDetailsForm, setAnnounceDetailsForm] =
    useState<AnnounceDetailsForm>(createInitialAnnounceDetailsForm);
  const [followUpForm, setFollowUpForm] = useState<FollowUpForm>(
    createInitialFollowUpForm,
  );
  const [followUpItems, setFollowUpItems] = useState<FollowUpItem[]>([]);
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<AnnouncerTabKey>('personal');

  const amount = useMemo(() => {
    const purposeAmount = Number(announceDetailsForm.purpose || 0);

    return purposeAmount * announceDetailsForm.quantity;
  }, [announceDetailsForm.purpose, announceDetailsForm.quantity]);

  const handleDonorIdentificationChange = <K extends keyof DonorIdentificationForm>(
    field: K,
    value: DonorIdentificationForm[K],
  ) => {
    setDonorIdentificationForm((current) => ({ ...current, [field]: value }));
  };

  const handleAnnounceEventChange = <K extends keyof AnnounceEventForm>(
    field: K,
    value: AnnounceEventForm[K],
  ) => {
    setAnnounceEventForm((current) => ({ ...current, [field]: value }));
  };

  const handlePersonalInfoChange = <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => {
    setPersonalInfoForm((current) => ({ ...current, [field]: value }));
  };

  const handleAnnounceDetailsChange = <K extends keyof AnnounceDetailsForm>(
    field: K,
    value: AnnounceDetailsForm[K],
  ) => {
    setAnnounceDetailsForm((current) => ({ ...current, [field]: value }));
  };

  const handleFollowUpChange = <K extends keyof FollowUpForm>(
    field: K,
    value: FollowUpForm[K],
  ) => {
    setFollowUpForm((current) => ({ ...current, [field]: value }));
  };

  const handleQuantityChange = (nextQuantity: number) => {
    setAnnounceDetailsForm((current) => ({
      ...current,
      quantity: Math.max(1, Number.isFinite(nextQuantity) ? nextQuantity : 1),
    }));
  };

  const handleToggleBank = (bankId: string) => {
    setSelectedBankIds((current) =>
      current.includes(bankId)
        ? current.filter((id) => id !== bankId)
        : [...current, bankId],
    );
  };

  const handleAddFollowUp = () => {
    if (!followUpForm.date && !followUpForm.note && !followUpForm.assignTo) {
      return;
    }

    setFollowUpItems((current) => [
      ...current,
      {
        id: Date.now(),
        ...followUpForm,
      },
    ]);
    setFollowUpForm(createInitialFollowUpForm());
  };

  const handleRemoveFollowUp = (id: number) => {
    setFollowUpItems((current) => current.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setDonorIdentificationForm(createInitialDonorIdentificationForm(getToday()));
    setAnnounceEventForm(createInitialAnnounceEventForm());
    setPersonalInfoForm(createInitialPersonalInfoForm());
    setAnnounceDetailsForm(createInitialAnnounceDetailsForm());
    setFollowUpForm(createInitialFollowUpForm());
    setFollowUpItems([]);
    setSelectedBankIds([]);
    setActiveTab('personal');
  };

  return (
    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
      <AnnounceMasterNav />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-6">
          <div className="row g-6">
            <div className="col-xl-3">
              <DonorIdentificationCard
                form={donorIdentificationForm}
                onChange={handleDonorIdentificationChange}
              />
            </div>

            <div className="col-xl-9">
              <AnnounceEventCard
                form={announceEventForm}
                onChange={handleAnnounceEventChange}
              />
            </div>

            <div className="col-12">
              <AnnouncerPersonalDetailsCard
                activeTab={activeTab}
                personalInfoForm={personalInfoForm}
                announceDetailsForm={announceDetailsForm}
                followUpForm={followUpForm}
                followUpItems={followUpItems}
                selectedBankIds={selectedBankIds}
                amount={amount}
                onTabChange={setActiveTab}
                onPersonalInfoChange={handlePersonalInfoChange}
                onAnnounceDetailsChange={handleAnnounceDetailsChange}
                onFollowUpChange={handleFollowUpChange}
                onQuantityChange={handleQuantityChange}
                onToggleBank={handleToggleBank}
                onAddFollowUp={handleAddFollowUp}
                onRemoveFollowUp={handleRemoveFollowUp}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
