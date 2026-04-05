import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ContentTypes } from 'src/constants/content';
import axiosInstance from 'src/redux/interceptor';
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
  DepositBank,
  DonorIdentificationForm,
  DonorSearchResult,
  FollowUpForm,
  FollowUpItem,
  PersonalInfoForm,
} from './types';

const getToday = () => new Date().toISOString().split('T')[0];

const donorSearchTypeCandidates: Record<string, string[]> = {
  donorId: ["NGCode", "donorId", "DonorId"],
  mobile: ["mobile", "DMobile"],
  email: ["email", "DEmail"],
  pan: ["pan", "PAN_Number", "panNo"],
  aadhaar: ["aadhaar", "aadhar", "AadharNo"],
};

const getFirstValue = (
  record: Record<string, unknown>,
  keys: string[],
): string => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }

  return '';
};

const getMappedValue = (
  record: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];
      return value === undefined || value === null ? '' : String(value).trim();
    }
  }

  return undefined;
};

const normalizeStateValue = (value: string): string => {
  const normalizedValue = value.trim().toLowerCase();
  const stateMap: Record<string, string> = {
    rajasthan: 'Rajasthan',
    delhi: 'Delhi',
    gujarat: 'Gujarat',
  };

  return stateMap[normalizedValue] ?? value.trim();
};

const extractDonorRecord = (payload: unknown): Record<string, unknown> | null => {
  if (Array.isArray(payload)) {
    const [first] = payload;
    return first && typeof first === 'object'
      ? (first as Record<string, unknown>)
      : null;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const nestedKeys = ['data', 'Data', 'result', 'Result', 'donorData', 'DonorData'];

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    if (Array.isArray(nestedValue)) {
      const [first] = nestedValue;
      if (first && typeof first === 'object') {
        return first as Record<string, unknown>;
      }
    }

    if (nestedValue && typeof nestedValue === 'object') {
      return nestedValue as Record<string, unknown>;
    }
  }

  return record;
};

const extractDonorRecords = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object',
    );
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const nestedKeys = ['data', 'Data', 'result', 'Result', 'donorData', 'DonorData'];

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    if (Array.isArray(nestedValue)) {
      return nestedValue.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object',
      );
    }
  }

  return extractDonorRecord(payload) ? [extractDonorRecord(payload)!] : [];
};

const mapDonorToPersonalInfo = (
  donorRecord: Record<string, unknown>,
): Partial<PersonalInfoForm> => {
  const rawState = getMappedValue(donorRecord, ['StateName', 'State']);
  const state =
    rawState === undefined ? undefined : normalizeStateValue(rawState);

  return {
    mobileNo: getMappedValue(donorRecord, ['DMobile', 'MobileNo', 'Mobile', 'mobile']),
    whatsappNo: getMappedValue(donorRecord, [
      'WhatsappNo',
      'WhatsAppNo',
      'WMobile',
      'AltMobile',
      'DMobile',
    ]),
    announcerName: getMappedValue(donorRecord, [
      'DonorName',
      'DName',
      'Name',
      'AnnouncerName',
    ]),
    pincode: getMappedValue(donorRecord, ['PinCode', 'Pincode', 'ZipCode']),
    country: getMappedValue(donorRecord, ['CountryName', 'Country']),
    state,
    stateLocked: state === undefined ? undefined : state !== '',
    district: getMappedValue(donorRecord, ['DistrictName', 'District', 'CityName']),
  };
};

const mapDonorSearchResult = (
  donorRecord: Record<string, unknown>,
): DonorSearchResult => ({
  donorId: getFirstValue(donorRecord, ['NGCode', 'DonorID', 'DonorId']),
  donorName: getFirstValue(donorRecord, ['DonorName', 'DName', 'Name']),
  mobileNo: getFirstValue(donorRecord, ['DMobile', 'MobileNo', 'Mobile', 'mobile']),
  email: getFirstValue(donorRecord, ['DEmail', 'Email', 'email']),
  record: donorRecord,
});

const extractArrayPayload = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    );
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const nestedKeys = ["data", "Data", "result", "Result", "banks", "Banks"];

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    if (Array.isArray(nestedValue)) {
      return nestedValue.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      );
    }
  }

  return [];
};

const mapBankRecord = (bankRecord: Record<string, unknown>, index: number): DepositBank => ({
  id:
    getFirstValue(bankRecord, ["ID", "Id", "BankId", "DepositBankId"]) ||
    `bank-${index}`,
  bankName: getFirstValue(bankRecord, [
    "FullName",
    "BankName",
    "bankName",
    "BANKNAME",
  ]),
  accountNo: getFirstValue(bankRecord, [
    "Acc_No",
    "AccountNo",
    "AccountNumber",
    "AccNo",
    "BANKACCOUNTNO",
  ]),
  accountType: getFirstValue(bankRecord, [
    "Account_Type",
    "AccountType",
    "AcType",
    "BankAccountType",
  ]),
  ifsc: getFirstValue(bankRecord, ["IFSC", "IFSCCode", "IfscCode"]),
  branch:
    getFirstValue(bankRecord, ["Branch", "BranchName", "BANKBRANCH"]) ||
    "Udaipur",
});

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
  const [banks, setBanks] = useState<DepositBank[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState('');
  const [activeTab, setActiveTab] = useState<AnnouncerTabKey>('personal');
  const [isSearchingDonor, setIsSearchingDonor] = useState(false);
  const [donorSearchError, setDonorSearchError] = useState('');
  const [donorOptions, setDonorOptions] = useState<DonorSearchResult[]>([]);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const lastDonorSearchKeyRef = useRef('');
  const donorSearchRequestIdRef = useRef(0);

  const amount = useMemo(() => {
    const purposeAmount = Number(announceDetailsForm.purpose || 0);

    return purposeAmount * announceDetailsForm.quantity;
  }, [announceDetailsForm.purpose, announceDetailsForm.quantity]);

  const handleDonorIdentificationChange = <K extends keyof DonorIdentificationForm>(
    field: K,
    value: DonorIdentificationForm[K],
  ) => {
    if (field === 'donorSearchType' || field === 'donorId') {
      setDonorSearchError('');
    }

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

  const applyDonorRecord = (
    donorRecord: Record<string, unknown>,
    fallbackSearchData: string,
    nextSearchType?: DonorIdentificationForm['donorSearchType'],
  ) => {
    const resolvedDonorId =
      getFirstValue(donorRecord, ['NGCode', 'DonorID', 'DonorId']) ||
      fallbackSearchData;
    const resolvedSearchType = nextSearchType ?? donorIdentificationForm.donorSearchType;

    setDonorSearchError('');
    lastDonorSearchKeyRef.current = `${resolvedSearchType}:${resolvedDonorId}`;
    setDonorIdentificationForm((current) => ({
      ...current,
      donorSearchType: resolvedSearchType,
      donorId: resolvedDonorId,
    }));

    const donorPersonalInfo = mapDonorToPersonalInfo(donorRecord);

    setPersonalInfoForm((current) => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(donorPersonalInfo).filter(([, value]) => value !== undefined),
      ),
    }));
    setActiveTab('personal');
  };

  const resetPersonalInfo = () => {
    setPersonalInfoForm(createInitialPersonalInfoForm());
  };

  const handleSelectDonor = (donor: DonorSearchResult) => {
    applyDonorRecord(
      donor.record,
      donorIdentificationForm.donorId.trim(),
      'donorId',
    );
    setShowDonorModal(false);
    setDonorOptions([]);
  };

  const handleCloseDonorModal = () => {
    setShowDonorModal(false);
  };

  const handleSearchDonor = async () => {
    const searchData = donorIdentificationForm.donorId.trim();
    const requestId = donorSearchRequestIdRef.current + 1;
    donorSearchRequestIdRef.current = requestId;

    if (!searchData) {
      setDonorSearchError('Please enter a value to search.');
      resetPersonalInfo();
      return;
    }

    setIsSearchingDonor(true);
    setDonorSearchError('');

    try {
      const searchTypeOptions =
        donorSearchTypeCandidates[donorIdentificationForm.donorSearchType] ??
        donorSearchTypeCandidates.donorId;
      let response = null;
      let lastError: unknown = null;

      for (const searchType of searchTypeOptions) {
        try {
          response = await axiosInstance.get('/master/searchDonorData', {
            params: {
              searchType,
              searchData,
              dataFlag: ContentTypes.DataFlag,
            },
          });
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!response) {
        throw lastError;
      }

      const donorRecords = extractDonorRecords(response.data);
      const uniqueDonorOptions = donorRecords
        .map(mapDonorSearchResult)
        .filter(
          (donor, index, currentDonors) =>
            donor.donorId &&
            currentDonors.findIndex((item) => item.donorId === donor.donorId) === index,
        );

      if (requestId !== donorSearchRequestIdRef.current) {
        return;
      }

      if (donorRecords.length === 0) {
        setDonorSearchError('No donor data found.');
        setDonorOptions([]);
        setShowDonorModal(false);
        resetPersonalInfo();
        return;
      }

      if (
        donorIdentificationForm.donorSearchType === 'mobile' &&
        uniqueDonorOptions.length > 1
      ) {
        setDonorOptions(uniqueDonorOptions);
        setShowDonorModal(true);
        return;
      }

      setDonorOptions([]);
      setShowDonorModal(false);
      applyDonorRecord(donorRecords[0], searchData);
    } catch (error: any) {
      if (requestId !== donorSearchRequestIdRef.current) {
        return;
      }

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.message ||
        'Failed to search donor data.';
      setDonorSearchError(message);
      resetPersonalInfo();
    } finally {
      if (requestId === donorSearchRequestIdRef.current) {
        setIsSearchingDonor(false);
      }
    }
  };

  useEffect(() => {
    const searchData = donorIdentificationForm.donorId.trim();

    if (!searchData) {
      lastDonorSearchKeyRef.current = '';
      donorSearchRequestIdRef.current += 1;
      setIsSearchingDonor(false);
      setDonorSearchError('');
      setDonorOptions([]);
      setShowDonorModal(false);
      resetPersonalInfo();
      return;
    }

    const searchKey = `${donorIdentificationForm.donorSearchType}:${searchData}`;
    if (lastDonorSearchKeyRef.current === searchKey) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      lastDonorSearchKeyRef.current = searchKey;
      void handleSearchDonor();
    }, 600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [donorIdentificationForm.donorId, donorIdentificationForm.donorSearchType]);

  useEffect(() => {
    const loadBanks = async () => {
      setBankLoading(true);
      setBankError('');

      try {
        const response = await axiosInstance.get('/master/GetDepositBanks', {
          params: {
            dataflag: ContentTypes.DataFlag,
          },
        });

        const bankRecords = extractArrayPayload(response.data);
        setBanks(
          bankRecords
            .map(mapBankRecord)
            .filter(
              (bank, index, currentBanks) =>
                (bank.bankName || bank.accountNo || bank.ifsc || bank.branch) &&
                currentBanks.findIndex((item) => item.id === bank.id) === index,
            ),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.Message ||
          error?.message ||
          'Failed to load bank list.';
        setBankError(message);
      } finally {
        setBankLoading(false);
      }
    };

    void loadBanks();
  }, []);

  const handleReset = () => {
    setDonorIdentificationForm(createInitialDonorIdentificationForm(getToday()));
    setAnnounceEventForm(createInitialAnnounceEventForm());
    setPersonalInfoForm(createInitialPersonalInfoForm());
    setAnnounceDetailsForm(createInitialAnnounceDetailsForm());
    setFollowUpForm(createInitialFollowUpForm());
    setFollowUpItems([]);
    setSelectedBankIds([]);
    setActiveTab('personal');
    setIsSearchingDonor(false);
    setDonorSearchError('');
    setDonorOptions([]);
    setShowDonorModal(false);
    lastDonorSearchKeyRef.current = '';
    donorSearchRequestIdRef.current += 1;
  };

  return (
    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
      <AnnounceMasterNav />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-6">
          <div className="row g-6">
            <div className="col-xl-4">
              <DonorIdentificationCard
                form={donorIdentificationForm}
                isSearching={isSearchingDonor}
                searchError={donorSearchError}
                donorOptions={donorOptions}
                showDonorModal={showDonorModal}
                onChange={handleDonorIdentificationChange}
                onSelectDonor={handleSelectDonor}
                onCloseDonorModal={handleCloseDonorModal}
              />
            </div>

            <div className="col-xl-8">
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
                banks={banks}
                bankLoading={bankLoading}
                bankError={bankError}
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
