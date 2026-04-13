import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import { AnnounceMasterNav } from './AnnounceMasterNav';
import {
  AnnouncementListing,
  AnnouncementListingItem,
} from './components/AnnouncementListing';
import {
  DeleteCauseModal,
  SaveResultModal,
} from './components/AnnounceMasterModals';
import {
  createInitialAnnounceDetailsForm,
  createInitialAnnounceEventForm,
  createInitialDonorIdentificationForm,
  createInitialFollowUpForm,
  createInitialPersonalInfoForm,
} from './data';
import { AnnouncerPersonalDetailsCard } from './components/AnnouncerPersonalDetailsCard';
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
} from './types';

import {
  AnnouncementCacheRecord,
  buildQuantityOptions,
  createEmptyCauseFields,
  getToday,
  inferCurrencyIdFromCode,
  mapCacheToListingItem,
  mapEventDetailRecord,
  parseAmountValue,
  parseStoredUser,
  readAnnouncementCache,
  writeAnnouncementCache,
} from './AnnounceMasterContent.helpers';
import {
  getErrorMessage,
  loadBanksData,
  loadCauseHeadMasterOptions,
  loadDistrictMasterOptions,
  loadEventCauseOptions,
  loadEventDetailsData,
  loadHowToDonateMasterOptions,
  loadOccasionTypeOptions,
  loadOperationAmountValue,
  loadPincodeLocationData,
  loadPurposeOptionsData,
  loadSalutationMasterOptions,
  loadStateMasterOptions,
} from './AnnounceMasterContent.loaders';
import {
  buildCurrentCauseForPayload,
  buildSavePayload,
  getPreferredValidationTab,
  getSaveErrorPayload,
  persistSavedAnnouncement,
  submitSaveRequest,
  validateBeforeSave,
} from './AnnounceMasterContent.save';
import { useAnnounceCauseManagement } from './useAnnounceCauseManagement';
import { useDonorSearchHandlers } from './useDonorSearchHandlers';

export const AnnounceMasterContent = () => {
  const history = useHistory();
  const queryParams = new URLSearchParams(window.location.search);
  const operation = (queryParams.get('Operation') || 'ADD').toUpperCase();
  const announceIdParam = queryParams.get('AnnounceID') || '0';
  const isViewMode = operation === 'VIEW';
  const eventOperation = operation === 'ADD' ? 'ADD' : 'EDIT';
  const isListingMode = !queryParams.get('Operation');
  const [
    donorIdentificationForm,
    setDonorIdentificationForm,
  ] = useState<DonorIdentificationForm>(() =>
    createInitialDonorIdentificationForm(getToday()),
  );
  const [announceEventForm, setAnnounceEventForm] = useState<AnnounceEventForm>(
    createInitialAnnounceEventForm,
  );
  const [personalInfoForm, setPersonalInfoForm] = useState<PersonalInfoForm>(
    createInitialPersonalInfoForm,
  );
  const [
    announceDetailsForm,
    setAnnounceDetailsForm,
  ] = useState<AnnounceDetailsForm>(createInitialAnnounceDetailsForm);
  const [followUpForm, setFollowUpForm] = useState<FollowUpForm>(
    createInitialFollowUpForm,
  );
  const [followUpItems, setFollowUpItems] = useState<FollowUpItem[]>([]);
  const [salutations, setSalutations] = useState<SalutationOption[]>([]);
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventDetails, setEventDetails] = useState<
    ReturnType<typeof mapEventDetailRecord>[]
  >([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState('');
  const [eventCauseOptions, setEventCauseOptions] = useState<EventOption[]>([]);
  const [occasionTypeOptions, setOccasionTypeOptions] = useState<EventOption[]>(
    [],
  );
  const [howToDonateOptions, setHowToDonateOptions] = useState<EventOption[]>(
    [],
  );
  const [stateOptions, setStateOptions] = useState<EventOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<EventOption[]>([]);
  const [causeHeadOptions, setCauseHeadOptions] = useState<EventOption[]>([]);
  const [purposeOptions, setPurposeOptions] = useState<EventOption[]>([]);
  const [eventCityOptions, setEventCityOptions] = useState<EventOption[]>([]);
  const [eventChannelOptions, setEventChannelOptions] = useState<EventOption[]>(
    [],
  );
  const [panditOptions, setPanditOptions] = useState<EventOption[]>([]);
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
  const [banks, setBanks] = useState<DepositBank[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState('');
  const [currencyId, setCurrencyId] = useState('');
  const [persistedCurrencyId, setPersistedCurrencyId] = useState('');
  const [autoAmount, setAutoAmount] = useState('');
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const [addedCauses, setAddedCauses] = useState<AddedAnnounceCause[]>([]);
  const [editingCauseId, setEditingCauseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<AnnouncerTabKey>('personal');
  const [isSearchingDonor, setIsSearchingDonor] = useState(false);
  const [donorSearchError, setDonorSearchError] = useState('');
  const [donorOptions, setDonorOptions] = useState<DonorSearchResult[]>([]);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [isPincodeLocationLocked, setIsPincodeLocationLocked] = useState(false);
  const [
    validationErrors,
    setValidationErrors,
  ] = useState<AnnounceValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveRequestPayload, setSaveRequestPayload] = useState<unknown>(null);
  const [saveResultPayload, setSaveResultPayload] = useState<unknown>(null);
  const [announcementItems, setAnnouncementItems] = useState<
    AnnouncementListingItem[]
  >([]);
  const [announcementListLoading, setAnnouncementListLoading] = useState(false);
  const [announcementListError, setAnnouncementListError] = useState('');
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<
    string | null
  >(null);
  const [
    shouldNavigateToListingOnModalClose,
    setShouldNavigateToListingOnModalClose,
  ] = useState(false);
  const [causeIdPendingDelete, setCauseIdPendingDelete] = useState<
    number | null
  >(null);
  const donorSearchValueRef = useRef('');
  const donorSearchTypeRef = useRef<DonorIdentificationForm['donorSearchType']>(
    'donorId',
  );
  const lastDonorSearchKeyRef = useRef('');
  const donorSearchRequestIdRef = useRef(0);
  const pincodeRequestIdRef = useRef(0);
  const purposeOptionsRequestIdRef = useRef(0);
  const amountRequestIdRef = useRef(0);

  const {
    handleAddCause,
    handleCloseDeleteCauseModal,
    handleConfirmDeleteCause,
    handleDeleteCause,
    handleEditCause,
  } = useAnnounceCauseManagement({
    addedCauses,
    announceDetailsForm,
    autoAmount,
    causeHeadOptions,
    causeIdPendingDelete,
    currencyId,
    editingCauseId,
    isViewMode,
    purposeOptions,
    amountRequestIdRef,
    purposeOptionsRequestIdRef,
    setAddedCauses,
    setAnnounceDetailsForm,
    setAutoAmount,
    setCauseIdPendingDelete,
    setCurrencyId,
    setEditingCauseId,
    setIsAmountEditable,
    setPersistedCurrencyId,
    setPurposeOptions,
    setValidationErrors,
  });

  const {
    handleCloseDonorModal,
    handleSelectDonor,
    resetPersonalInfo,
  } = useDonorSearchHandlers({
    donorIdentificationForm,
    donorSearchRequestIdRef,
    donorSearchTypeRef,
    lastDonorSearchKeyRef,
    setActiveTab,
    setDonorIdentificationForm,
    setDonorOptions,
    setDonorSearchError,
    setIsSearchingDonor,
    setPersonalInfoForm,
    setShowDonorModal,
  });

  const openAnnouncementListing = useCallback(() => {
    history.push(PATH.ANNOUNCE_MASTER);
  }, [history]);

  const openAnnouncementForm = useCallback(
    (nextAnnounceId: string, nextOperation: 'ADD' | 'Edit' | 'View') => {
      history.push(
        `${PATH.ANNOUNCE_MASTER}?AnnounceID=${nextAnnounceId}&Operation=${nextOperation}`,
      );
    },
    [history],
  );

  const loadAnnouncementListing = useCallback(() => {
    setAnnouncementListLoading(true);
    setAnnouncementListError('');

    try {
      const items = readAnnouncementCache()
        .sort((left, right) => right.savedAt.localeCompare(left.savedAt))
        .map(mapCacheToListingItem);

      setAnnouncementItems(items);
    } catch {
      setAnnouncementItems([]);
      setAnnouncementListError('Announcement listing load nahi hui.');
    } finally {
      setAnnouncementListLoading(false);
    }
  }, []);

  const hydrateAnnouncementFromCache = useCallback(
    (cachedRecord: AnnouncementCacheRecord) => {
      setDonorIdentificationForm(cachedRecord.donorIdentificationForm);
      setAnnounceEventForm(cachedRecord.announceEventForm);
      setPersonalInfoForm(cachedRecord.personalInfoForm);
      setAnnounceDetailsForm({
        ...cachedRecord.announceDetailsForm,
        ...createEmptyCauseFields(),
      });
      setFollowUpForm(cachedRecord.followUpForm);
      setFollowUpItems(cachedRecord.followUpItems);
      setAddedCauses(cachedRecord.addedCauses);
      setSelectedBankIds(cachedRecord.selectedBankIds);
      setPersistedCurrencyId(
        cachedRecord.currencyId?.trim() ||
          inferCurrencyIdFromCode(cachedRecord.announceEventForm.currency),
      );
      setEditingCauseId(null);
      setAutoAmount('');
      setIsAmountEditable(false);
      setActiveTab('personal');
    },
    [],
  );

  const handleDeleteAnnouncement = useCallback(
    (announcementId: string) => {
      setDeletingAnnouncementId(announcementId);

      try {
        const nextRecords = readAnnouncementCache().filter(
          record => record.announceId !== announcementId,
        );
        writeAnnouncementCache(nextRecords);
        loadAnnouncementListing();
      } finally {
        setDeletingAnnouncementId(null);
      }
    },
    [loadAnnouncementListing],
  );

  const handleDonorIdentificationChange = <
    K extends keyof DonorIdentificationForm
  >(
    field: K,
    value: DonorIdentificationForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    if (field === 'donorSearchType' || field === 'donorId') {
      setDonorSearchError('');
    }

    if (field === 'donorSearchType') {
      donorSearchTypeRef.current = value as DonorIdentificationForm['donorSearchType'];
      donorSearchValueRef.current = '';
      lastDonorSearchKeyRef.current = '';
      donorSearchRequestIdRef.current += 1;
      setIsSearchingDonor(false);
      setDonorOptions([]);
      setShowDonorModal(false);
      resetPersonalInfo();
      setDonorIdentificationForm(current => ({
        ...current,
        donorSearchType: value as DonorIdentificationForm['donorSearchType'],
        donorId: '',
      }));
      return;
    }

    if (field === 'donorId') {
      donorSearchValueRef.current = String(value);
      donorSearchTypeRef.current = donorIdentificationForm.donorSearchType;
    }

    setDonorIdentificationForm(current => ({ ...current, [field]: value }));
  };

  const handleAnnounceEventChange = <K extends keyof AnnounceEventForm>(
    field: K,
    value: AnnounceEventForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };

      if (field === 'eventName') {
        delete nextErrors.eventName;
      }

      return nextErrors;
    });

    setAnnounceEventForm(current => ({ ...current, [field]: value }));
  };

  const handlePersonalInfoChange = <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };
      const fieldKey = field as AnnounceValidationField;

      if (fieldKey in nextErrors) {
        delete nextErrors[fieldKey];
      }

      if (field === 'announceInOtherName' && !value) {
        delete nextErrors.announcedForName;
      }

      return nextErrors;
    });

    if (field === 'mobileNo' || field === 'whatsappNo') {
      const normalizedMobile = String(value).replace(/\D/g, '').slice(0, 10);

      setPersonalInfoForm(current => ({
        ...current,
        [field]: normalizedMobile,
      }));
      return;
    }

    if (field === 'pincode') {
      const normalizedPincode = String(value).replace(/\D/g, '').slice(0, 6);

      setPersonalInfoForm(current => ({
        ...current,
        pincode: normalizedPincode,
      }));
      return;
    }

    setPersonalInfoForm(current => ({ ...current, [field]: value }));
  };

  const handleAnnounceDetailsChange = <K extends keyof AnnounceDetailsForm>(
    field: K,
    value: AnnounceDetailsForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };

      if (field === 'occasionType') {
        delete nextErrors.occasionType;
      }

      if (field === 'paymentMode') {
        delete nextErrors.paymentMode;
        delete nextErrors.bankSelection;
      }

      if (field === 'howToDonate') {
        delete nextErrors.howToDonate;
      }

      if (field === 'occasionDate') {
        delete nextErrors.occasionDate;
      }

      if (field === 'occasionRemark') {
        delete nextErrors.occasionRemark;
      }

      if (field === 'causeHead') {
        delete nextErrors.causeHead;
        delete nextErrors.causeHeadDate;
        delete nextErrors.purpose;
        delete nextErrors.announceAmount;
      }

      if (field === 'causeHeadDate') {
        delete nextErrors.causeHeadDate;
      }

      if (field === 'purpose') {
        delete nextErrors.purpose;
        delete nextErrors.announceAmount;
      }

      if (field === 'motivatedAmount') {
        delete nextErrors.motivatedAmount;
      }

      if (field === 'isMotivated' && !value) {
        delete nextErrors.motivatedAmount;
      }

      return nextErrors;
    });

    if (field === 'causeHead') {
      const nextCauseHead = String(value).trim();

      purposeOptionsRequestIdRef.current += 1;
      amountRequestIdRef.current += 1;
      setCurrencyId('');
      setPurposeOptions([]);
      setAutoAmount('');
      setIsAmountEditable(false);
      setAnnounceDetailsForm(current => ({
        ...current,
        causeHead: nextCauseHead,
        causeHeadDate: nextCauseHead === '150' ? current.causeHeadDate : '',
        namePlateName: ['162', '167', '168'].includes(nextCauseHead)
          ? current.namePlateName
          : '',
        donorInstruction: ['162', '167', '168'].includes(nextCauseHead)
          ? current.donorInstruction
          : '',
        purpose: '',
        quantity: 1,
      }));
      return;
    }

    if (field === 'purpose') {
      amountRequestIdRef.current += 1;
      setAutoAmount('');
      setIsAmountEditable(false);
      setAnnounceDetailsForm(current => ({
        ...current,
        purpose: value as AnnounceDetailsForm['purpose'],
        quantity: 1,
      }));
      return;
    }

    if (field === 'paymentMode') {
      const nextPaymentMode = String(value);

      setAnnounceDetailsForm(current => ({
        ...current,
        paymentMode: nextPaymentMode,
      }));

      if (['Online', 'Pay-In-Slip'].includes(nextPaymentMode)) {
        setActiveTab('bankDetails');
      } else if (activeTab === 'bankDetails') {
        setActiveTab('followUp');
      }

      return;
    }

    setAnnounceDetailsForm(current => ({ ...current, [field]: value }));
  };

  const handleAmountChange = (value: string) => {
    if (isViewMode) {
      return;
    }

    const normalizedValue = value.replace(/[^\d.]/g, '');
    setValidationErrors(current => {
      const nextErrors = { ...current };
      delete nextErrors.announceAmount;
      return nextErrors;
    });
    setAutoAmount(normalizedValue);
  };

  const handleFollowUpChange = <K extends keyof FollowUpForm>(
    field: K,
    value: FollowUpForm[K],
  ) => {
    if (isViewMode) {
      return;
    }

    setFollowUpForm(current => ({ ...current, [field]: value }));
  };

  const handleQuantityChange = (nextQuantity: number) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };
      delete nextErrors.announceAmount;
      return nextErrors;
    });
    setAnnounceDetailsForm(current => ({
      ...current,
      quantity: Math.max(1, Number.isFinite(nextQuantity) ? nextQuantity : 1),
    }));
  };

  const handleToggleBank = (bankId: string) => {
    if (isViewMode) {
      return;
    }

    setValidationErrors(current => {
      const nextErrors = { ...current };
      delete nextErrors.bankSelection;
      return nextErrors;
    });
    setSelectedBankIds(current =>
      current.includes(bankId)
        ? current.filter(id => id !== bankId)
        : [...current, bankId],
    );
  };

  const handleAddFollowUp = () => {
    if (isViewMode) {
      return;
    }

    if (!followUpForm.date && !followUpForm.note && !followUpForm.assignTo) {
      return;
    }

    setFollowUpItems(current => [
      ...current,
      {
        id: Date.now(),
        ...followUpForm,
      },
    ]);
    setFollowUpForm(createInitialFollowUpForm());
  };

  const handleRemoveFollowUp = (id: number) => {
    if (isViewMode) {
      return;
    }

    setFollowUpItems(current => current.filter(item => item.id !== id));
  };

  const resetEventSelectionFields = (
    liveType: AnnounceEventForm['liveType'],
    eventName = '',
  ) => {
    setSelectedEventId(null);
    setAnnounceEventForm(current => ({
      ...current,
      liveType,
      eventName,
      eventCause: '',
      eventFromDate: '',
      eventToDate: '',
      eventFromTime: '',
      eventToTime: '',
      eventCity: '',
      eventChannel: '',
      panditJi: '',
      eventLocation: '',
      currency: eventName.trim() ? current.currency || 'INR' : '',
    }));
  };

  useEffect(() => {
    const loadEventCauses = async () => {
      try {
        setEventCauseOptions(await loadEventCauseOptions(eventOperation));
      } catch (error) {
        setEventCauseOptions([]);
      }
    };

    void loadEventCauses();
  }, [eventOperation]);

  useEffect(() => {
    const loadEventDetails = async () => {
      setEventLoading(true);
      setEventError('');

      try {
        const {
          eventChannelOptions: nextEventChannelOptions,
          eventCityOptions: nextEventCityOptions,
          eventOptions: nextEventOptions,
          panditOptions: nextPanditOptions,
          records,
        } = await loadEventDetailsData({
          eventOperation,
          isLive: announceEventForm.liveType === 'live',
        });

        setEventDetails(records);
        setEventOptions(nextEventOptions);
        setEventCityOptions(nextEventCityOptions);
        setEventChannelOptions(nextEventChannelOptions);
        setPanditOptions(nextPanditOptions);

        const matchedRecord = records.find(
          record => record.eventName === announceEventForm.eventName,
        );

        if (!matchedRecord && operation === 'ADD') {
          resetEventSelectionFields(announceEventForm.liveType);
        }
      } catch (error) {
        setEventDetails([]);
        setEventOptions([]);
        setEventCityOptions([]);
        setEventChannelOptions([]);
        setPanditOptions([]);
        if (operation === 'ADD' || !announceEventForm.eventName.trim()) {
          resetEventSelectionFields(announceEventForm.liveType);
        }
        setEventError(getErrorMessage(error, 'Failed to load event list.'));
      } finally {
        setEventLoading(false);
      }
    };

    void loadEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announceEventForm.liveType, eventOperation]);

  useEffect(() => {
    if (!announceEventForm.eventName) {
      setSelectedEventId(null);
      resetEventSelectionFields(announceEventForm.liveType);
      return;
    }

    const selectedEvent = eventDetails.find(
      record => record.eventName === announceEventForm.eventName,
    );

    if (!selectedEvent) {
      setSelectedEventId(null);
      return;
    }

    setSelectedEventId(selectedEvent.id || null);

    setAnnounceEventForm(current => ({
      ...current,
      liveType: announceEventForm.liveType,
      eventName: selectedEvent.eventName,
      eventCause: selectedEvent.eventCause || current.eventCause,
      eventFromDate: selectedEvent.eventFromDate,
      eventToDate: selectedEvent.eventToDate,
      eventFromTime: selectedEvent.eventFromTime,
      eventToTime: selectedEvent.eventToTime,
      eventCity: selectedEvent.eventCity,
      eventChannel: selectedEvent.eventChannel,
      panditJi: selectedEvent.panditJi,
      eventLocation: selectedEvent.eventLocation,
      currency: current.currency || 'INR',
    }));
  }, [announceEventForm.eventName, announceEventForm.liveType, eventDetails]);

  useEffect(() => {
    const loadOccasionTypes = async () => {
      try {
        setOccasionTypeOptions(await loadOccasionTypeOptions());
      } catch (error) {
        setOccasionTypeOptions([]);
      }
    };

    void loadOccasionTypes();
  }, []);

  useEffect(() => {
    const loadHowToDonateOptions = async () => {
      try {
        setHowToDonateOptions(await loadHowToDonateMasterOptions());
      } catch (error) {
        setHowToDonateOptions([]);
      }
    };

    void loadHowToDonateOptions();
  }, []);

  useEffect(() => {
    const loadStateOptions = async () => {
      try {
        setStateOptions(await loadStateMasterOptions());
      } catch (error) {
        setStateOptions([]);
      }
    };

    void loadStateOptions();
  }, []);

  useEffect(() => {
    const selectedState = stateOptions.find(
      option => option.value === personalInfoForm.state,
    );
    const stateCode = selectedState?.stateCode?.trim();

    if (!stateCode) {
      setDistrictOptions([]);
      return;
    }

    const loadDistrictOptions = async () => {
      try {
        setDistrictOptions(await loadDistrictMasterOptions(stateCode));
      } catch (error) {
        setDistrictOptions([]);
      }
    };

    void loadDistrictOptions();
  }, [personalInfoForm.state, stateOptions]);

  useEffect(() => {
    const normalizedPincode = personalInfoForm.pincode.replace(/\D/g, '');

    if (!/^\d{6}$/.test(normalizedPincode)) {
      pincodeRequestIdRef.current += 1;
      setIsPincodeLocationLocked(false);
      return;
    }

    const requestId = pincodeRequestIdRef.current + 1;
    pincodeRequestIdRef.current = requestId;

    const timeoutId = window.setTimeout(() => {
      const loadLocationByPincode = async () => {
        try {
          if (requestId !== pincodeRequestIdRef.current) {
            return;
          }

          const { location, matchedState } = await loadPincodeLocationData({
            normalizedPincode,
            stateOptions,
          });

          if (requestId !== pincodeRequestIdRef.current) {
            return;
          }

          if (!location) {
            setIsPincodeLocationLocked(false);
            return;
          }

          setPersonalInfoForm(current => ({
            ...current,
            country: location.country.trim() || 'India',
            state:
              matchedState?.value || location.state.trim() || current.state,
            district: location.district.trim() || current.district,
          }));
          setValidationErrors(current => {
            const nextErrors = { ...current };

            if (location.country.trim() || 'India') {
              delete nextErrors.country;
            }

            if (matchedState?.value || location.state.trim()) {
              delete nextErrors.state;
            }

            if (location.district.trim()) {
              delete nextErrors.district;
            }

            return nextErrors;
          });
          setIsPincodeLocationLocked(
            Boolean(
              matchedState?.value ||
                location.state.trim() ||
                location.district.trim(),
            ),
          );
        } catch (error) {
          if (requestId !== pincodeRequestIdRef.current) {
            return;
          }

          setIsPincodeLocationLocked(false);
        }
      };

      void loadLocationByPincode();
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [personalInfoForm.pincode, stateOptions]);

  useEffect(() => {
    const loadCauseHeadOptions = async () => {
      try {
        setCauseHeadOptions(await loadCauseHeadMasterOptions());
      } catch (error) {
        setCauseHeadOptions([]);
      }
    };

    void loadCauseHeadOptions();
  }, []);

  useEffect(() => {
    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === announceDetailsForm.causeHead,
    );
    const purposeId =
      selectedCauseHead?.purposeId || announceDetailsForm.causeHead.trim();

    if (!purposeId) {
      purposeOptionsRequestIdRef.current += 1;
      setCurrencyId('');
      setPurposeOptions([]);
      setAutoAmount('');
      setIsAmountEditable(false);
      setAnnounceDetailsForm(current =>
        current.purpose || current.quantity !== 1
          ? { ...current, purpose: '', quantity: 1 }
          : current,
      );
      return;
    }

    const requestId = purposeOptionsRequestIdRef.current + 1;
    purposeOptionsRequestIdRef.current = requestId;

    const loadPurposeOptions = async () => {
      try {
        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        const {
          currencyId: nextCurrencyId,
          purposeOptions: nextPurposeOptions,
        } = await loadPurposeOptionsData(purposeId);

        if (!nextCurrencyId) {
          setCurrencyId('');
          setPurposeOptions([]);
          setAutoAmount('');
          setIsAmountEditable(false);
          setAnnounceDetailsForm(current =>
            current.purpose || current.quantity !== 1
              ? { ...current, purpose: '', quantity: 1 }
              : current,
          );
          return;
        }

        setCurrencyId(nextCurrencyId);
        setPersistedCurrencyId(nextCurrencyId);

        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        setPurposeOptions(nextPurposeOptions);
        setIsAmountEditable(false);
        setAnnounceDetailsForm(current => {
          if (
            !current.purpose ||
            nextPurposeOptions.some(option => option.value === current.purpose)
          ) {
            return current;
          }

          return {
            ...current,
            purpose: '',
            quantity: 1,
          };
        });
      } catch (error) {
        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        setCurrencyId('');
        setPurposeOptions([]);
        setAutoAmount('');
        setIsAmountEditable(false);
        setAnnounceDetailsForm(current =>
          current.purpose || current.quantity !== 1
            ? { ...current, purpose: '', quantity: 1 }
            : current,
        );
      }
    };

    void loadPurposeOptions();
  }, [announceDetailsForm.causeHead, causeHeadOptions]);

  useEffect(() => {
    const quantity = Math.max(1, Number(announceDetailsForm.quantity) || 1);
    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === announceDetailsForm.causeHead,
    );
    const selectedCauseHeadPurposeId =
      selectedCauseHead?.purposeId?.trim() ||
      announceDetailsForm.causeHead.trim();
    const selectedPurpose = purposeOptions.find(
      option => option.value === announceDetailsForm.purpose,
    );
    const selectedPurposeId =
      selectedPurpose?.yojnaId?.trim() || announceDetailsForm.purpose.trim();
    const selectedPurposeQty = selectedPurpose?.qtyValue?.trim() || '';
    const selectedPurposeQtyNumber = Math.max(
      0,
      Number(selectedPurposeQty || 0),
    );
    const selectedPurposeAmount = parseAmountValue(
      selectedPurpose?.amountValue?.trim() || '',
    );

    amountRequestIdRef.current += 1;
    const requestId = amountRequestIdRef.current;

    if (!selectedPurposeId) {
      setAutoAmount('');
      setIsAmountEditable(false);
      return;
    }

    if (selectedPurposeQty === '0') {
      const shouldEnableAmountField = selectedPurposeAmount <= 1;

      setIsAmountEditable(shouldEnableAmountField);
      setAutoAmount(
        current =>
          current ||
          (selectedPurposeAmount > 0 ? String(selectedPurposeAmount) : ''),
      );
      return;
    }

    setIsAmountEditable(false);

    if (currencyId !== '4' || selectedCauseHeadPurposeId !== '2') {
      setAutoAmount(
        selectedPurposeAmount > 0
          ? (
              selectedPurposeAmount *
              (selectedPurposeQtyNumber > 1
                ? quantity / selectedPurposeQtyNumber
                : quantity)
            ).toLocaleString('en-IN')
          : '',
      );
      return;
    }

    const loadOperationAmount = async () => {
      try {
        const nextAmount = await loadOperationAmountValue({
          currencyId,
          quantity,
        });

        if (requestId !== amountRequestIdRef.current) {
          return;
        }

        setAutoAmount(nextAmount);
      } catch (error) {
        if (requestId !== amountRequestIdRef.current) {
          return;
        }

        setAutoAmount('');
      }
    };

    void loadOperationAmount();
  }, [
    announceDetailsForm.causeHead,
    announceDetailsForm.purpose,
    announceDetailsForm.quantity,
    causeHeadOptions,
    currencyId,
    purposeOptions,
  ]);

  useEffect(() => {
    const selectedPurpose = purposeOptions.find(
      option => option.value === announceDetailsForm.purpose,
    );
    const selectedPurposeQty = Math.max(
      0,
      Number(selectedPurpose?.qtyValue?.trim() || 0),
    );

    if (selectedPurposeQty <= 1) {
      return;
    }

    setAnnounceDetailsForm(current =>
      current.quantity === selectedPurposeQty
        ? current
        : { ...current, quantity: selectedPurposeQty },
    );
  }, [announceDetailsForm.purpose, purposeOptions]);

  useEffect(() => {
    const loadSalutations = async () => {
      try {
        setSalutations(await loadSalutationMasterOptions());
      } catch (error) {
        setSalutations([]);
      }
    };

    void loadSalutations();
  }, []);

  useEffect(() => {
    const loadBanks = async () => {
      setBankLoading(true);
      setBankError('');

      const { banks: nextBanks, errorMessage } = await loadBanksData();
      setBanks(nextBanks);
      setBankError(errorMessage);
      setBankLoading(false);
    };

    void loadBanks();
  }, []);

  const handleReset = () => {
    if (isViewMode) {
      return;
    }

    setDonorIdentificationForm(
      createInitialDonorIdentificationForm(getToday()),
    );
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
    setValidationErrors({});
    setShowSaveResultModal(false);
    setSaveRequestPayload(null);
    setSaveResultPayload(null);
    setIsSaving(false);
    setCauseIdPendingDelete(null);
    setAddedCauses([]);
    setEditingCauseId(null);
    setCurrencyId('');
    setPersistedCurrencyId('');
    setIsPincodeLocationLocked(false);
    lastDonorSearchKeyRef.current = '';
    donorSearchRequestIdRef.current += 1;
    pincodeRequestIdRef.current += 1;
  };

  const handleCancel = useCallback(() => {
    if (window.history.length > 1) {
      history.goBack();
      return;
    }

    openAnnouncementListing();
  }, [history, openAnnouncementListing]);

  useEffect(() => {
    if (isListingMode) {
      loadAnnouncementListing();
      return;
    }

    if (announceIdParam === '0') {
      if (operation === 'ADD') {
        setDonorIdentificationForm(
          createInitialDonorIdentificationForm(getToday()),
        );
        setAnnounceEventForm(createInitialAnnounceEventForm());
        setPersonalInfoForm(createInitialPersonalInfoForm());
        setAnnounceDetailsForm(createInitialAnnounceDetailsForm());
        setFollowUpForm(createInitialFollowUpForm());
        setFollowUpItems([]);
        setSelectedBankIds([]);
        setAddedCauses([]);
        setEditingCauseId(null);
        setCurrencyId('');
        setPersistedCurrencyId('');
        setAutoAmount('');
        setIsAmountEditable(false);
        setActiveTab('personal');
      }
      return;
    }

    const cachedRecord = readAnnouncementCache().find(
      record => record.announceId === announceIdParam,
    );

    if (cachedRecord) {
      hydrateAnnouncementFromCache(cachedRecord);
    }
  }, [
    announceIdParam,
    hydrateAnnouncementFromCache,
    isListingMode,
    loadAnnouncementListing,
    operation,
  ]);

  const selectedPurposeOption = purposeOptions.find(
    option => option.value === announceDetailsForm.purpose,
  );
  const selectedCauseHeadOption = causeHeadOptions.find(
    option => option.value === announceDetailsForm.causeHead,
  );
  const selectedHowToDonateOption = howToDonateOptions.find(
    option => option.value === announceDetailsForm.howToDonate,
  );
  const selectedStateOption = stateOptions.find(
    option =>
      option.value === personalInfoForm.state ||
      option.label === personalInfoForm.state,
  );
  const selectedDistrictOption = districtOptions.find(
    option =>
      option.value === personalInfoForm.district ||
      option.label === personalInfoForm.district,
  );
  const selectedEventDetail = eventDetails.find(
    option => option.eventName === announceEventForm.eventName,
  );
  const selectedEventCityDetail = eventDetails.find(
    option =>
      option.eventCity === announceEventForm.eventCity &&
      option.cityCode?.trim() !== '',
  );
  const selectedEventChannelDetail = eventDetails.find(
    option =>
      option.eventChannel === announceEventForm.eventChannel &&
      option.channelCode?.trim() !== '',
  );
  const selectedEventPanditDetail = eventDetails.find(
    option =>
      option.panditJi === announceEventForm.panditJi &&
      option.panditCode?.trim() !== '',
  );
  const selectedPurposeQty = Math.max(
    0,
    Number(selectedPurposeOption?.qtyValue?.trim() || 1),
  );
  const effectiveCauseAmount =
    autoAmount.trim() || selectedPurposeOption?.amountValue?.trim() || '';
  const currentPurposeKey =
    selectedPurposeOption?.yojnaId?.trim() ||
    announceDetailsForm.purpose.trim();
  const usedPurposeKeys = new Set(
    addedCauses
      .filter(cause => cause.id !== editingCauseId)
      .map(cause => cause.yojnaId),
  );
  const availablePurposeOptions = purposeOptions.filter(option => {
    const optionKey = option.yojnaId?.trim() || option.value.trim();

    return optionKey === '' || !usedPurposeKeys.has(optionKey);
  });
  const isCauseReadyToAdd =
    announceDetailsForm.causeHead.trim() !== '' &&
    announceDetailsForm.purpose.trim() !== '' &&
    currentPurposeKey !== '' &&
    !usedPurposeKeys.has(currentPurposeKey) &&
    Math.max(1, Number(announceDetailsForm.quantity) || 1) > 0 &&
    effectiveCauseAmount !== '' &&
    (announceDetailsForm.causeHead !== '150' ||
      announceDetailsForm.causeHeadDate.trim() !== '');
  const quantityControlMode: 'disabled' | 'stepper' | 'select' =
    selectedPurposeQty === 0
      ? 'disabled'
      : selectedPurposeQty === 1
      ? 'stepper'
      : 'select';
  const quantityOptions =
    quantityControlMode === 'select'
      ? buildQuantityOptions(selectedPurposeQty)
      : [];

  const handleCloseSaveResultModal = () => {
    setShowSaveResultModal(false);

    if (shouldNavigateToListingOnModalClose) {
      setShouldNavigateToListingOnModalClose(false);
      openAnnouncementListing();
    }
  };

  const handleSave = async () => {
    if (isViewMode) {
      return;
    }

    const currentUser = parseStoredUser();
    const announceThroughParam = queryParams.get('ATHROUGH');
    const queryStringBid = queryParams.get('BID');
    const queryStringCrtObjectId =
      queryParams.get('crtObjectId') || queryParams.get('crtobjectid');
    const queryStringDReason = queryParams.get('DReason');
    const queryStringThisCallId = queryParams.get('THISCALLID');
    const currentCauseForPayload = buildCurrentCauseForPayload({
      announceDetailsForm,
      autoAmount,
      isCauseReadyToAdd,
      selectedCauseHeadOption,
      selectedPurposeOption,
    });
    const causesForPayload = currentCauseForPayload
      ? [...addedCauses, currentCauseForPayload]
      : addedCauses;
    const announceAmount = causesForPayload.reduce(
      (total, cause) => total + parseAmountValue(cause.amount),
      0,
    );
    const nextErrors = validateBeforeSave({
      announceAmount,
      announceDetailsForm,
      announceEventForm,
      causesForPayload,
      donorIdentificationForm,
      isAmountEditable,
      operation: operation as 'ADD' | 'EDIT' | 'VIEW',
      personalInfoForm,
      selectedBankIds,
    });

    setValidationErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const preferredTab = getPreferredValidationTab({
        activeTab,
        errors: nextErrors,
      });

      if (preferredTab && preferredTab !== activeTab) {
        setActiveTab(preferredTab);
      }

      return;
    }

    const employeeCode = Number(currentUser.empNum || 0) || null;
    const donorSearchValue = donorSearchValueRef.current.trim();
    const donorSearchType = donorSearchTypeRef.current;
    const callingSadhakId = employeeCode;
    const callingSadhakName =
      (currentUser as Partial<IUser> & { empName?: string }).empName ||
      currentUser.username ||
      null;
    const resolvedCurrencyId =
      currencyId.trim() ||
      persistedCurrencyId.trim() ||
      inferCurrencyIdFromCode(announceEventForm.currency);
    const { payload, resolvedCurrencyId: nextCurrencyId } = buildSavePayload({
      addedCauses,
      announceDetailsForm,
      announceEventForm,
      announceIdParam,
      announceThroughParam,
      autoAmount,
      callingSadhakId,
      callingSadhakName,
      currentUser,
      donorIdentificationForm,
      donorSearchType,
      donorSearchValue,
      followUpForm,
      isCauseReadyToAdd,
      persistedCurrencyId,
      personalInfoForm,
      queryStringBid,
      queryStringCrtObjectId,
      queryStringDReason,
      queryStringThisCallId,
      resolvedCurrencyId,
      selectedBankIds,
      selectedCauseHeadOption,
      selectedDistrictOption,
      selectedEventChannelDetail,
      selectedEventCityDetail,
      selectedEventDetail,
      selectedEventId,
      selectedEventPanditDetail,
      selectedHowToDonateOption,
      selectedPurposeOption,
      selectedStateOption,
    });

    setIsSaving(true);
    setSaveRequestPayload(payload);

    try {
      const response = await submitSaveRequest({
        operation: operation as 'ADD' | 'EDIT' | 'VIEW',
        payload,
      });

      persistSavedAnnouncement({
        addedCauses: causesForPayload,
        announceDetailsForm,
        announceEventForm,
        announceIdParam,
        cachedRecords: readAnnouncementCache(),
        currencyId: nextCurrencyId,
        donorIdentificationForm,
        followUpForm,
        followUpItems,
        personalInfoForm,
        responseData: response.data,
        selectedBankIds,
      });

      setSaveResultPayload(response.data);
      setShouldNavigateToListingOnModalClose(true);
      setShowSaveResultModal(true);
    } catch (error) {
      setSaveResultPayload(getSaveErrorPayload(error));
      setShouldNavigateToListingOnModalClose(false);
      setShowSaveResultModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isListingMode) {
    return (
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <AnnounceMasterNav />

        <div className="post d-flex flex-column-fluid" id="kt_post">
          <div id="kt_content_container" className="container-fluid py-6">
            <AnnouncementListing
              items={announcementItems}
              loading={announcementListLoading}
              error={announcementListError}
              deletingId={deletingAnnouncementId}
              onAdd={() => openAnnouncementForm('0', 'ADD')}
              onEdit={announceId => openAnnouncementForm(announceId, 'Edit')}
              onView={announceId => openAnnouncementForm(announceId, 'View')}
              onDelete={handleDeleteAnnouncement}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      <AnnounceMasterNav />

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid py-6">
          <div className="row g-6 justify-content-center">
            <div className="col-12">
              <AnnouncerPersonalDetailsCard
                activeTab={activeTab}
                donorIdentificationForm={donorIdentificationForm}
                announceEventForm={announceEventForm}
                personalInfoForm={personalInfoForm}
                salutations={salutations}
                stateOptions={stateOptions}
                districtOptions={districtOptions}
                donorOptions={donorOptions}
                isSearchingDonor={isSearchingDonor}
                donorSearchError={donorSearchError}
                showDonorModal={showDonorModal}
                isPincodeLocationLocked={isPincodeLocationLocked}
                validationErrors={validationErrors}
                announceDetailsForm={announceDetailsForm}
                addedCauses={addedCauses}
                editingCauseId={editingCauseId}
                eventOptions={eventOptions}
                eventCauseOptions={eventCauseOptions}
                eventCityOptions={eventCityOptions}
                eventChannelOptions={eventChannelOptions}
                panditOptions={panditOptions}
                eventLoading={eventLoading}
                eventError={eventError}
                occasionTypeOptions={occasionTypeOptions}
                causeHeadOptions={causeHeadOptions}
                purposeOptions={availablePurposeOptions}
                howToDonateOptions={howToDonateOptions}
                banks={banks}
                bankLoading={bankLoading}
                bankError={bankError}
                selectedBankIds={selectedBankIds}
                amount={autoAmount}
                isAmountEditable={isAmountEditable}
                quantityControlMode={quantityControlMode}
                quantityOptions={quantityOptions}
                isAddCauseDisabled={!isCauseReadyToAdd}
                isSaving={isSaving}
                isViewMode={isViewMode}
                onAmountChange={handleAmountChange}
                onAddCause={handleAddCause}
                onEditCause={handleEditCause}
                onDeleteCause={handleDeleteCause}
                onSave={handleSave}
                onSelectDonor={handleSelectDonor}
                onCloseDonorModal={handleCloseDonorModal}
                followUpForm={followUpForm}
                followUpItems={followUpItems}
                onTabChange={setActiveTab}
                onDonorIdentificationChange={handleDonorIdentificationChange}
                onAnnounceEventChange={handleAnnounceEventChange}
                onPersonalInfoChange={handlePersonalInfoChange}
                onAnnounceDetailsChange={handleAnnounceDetailsChange}
                onFollowUpChange={handleFollowUpChange}
                onQuantityChange={handleQuantityChange}
                onToggleBank={handleToggleBank}
                onAddFollowUp={handleAddFollowUp}
                onRemoveFollowUp={handleRemoveFollowUp}
                onReset={handleReset}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </div>

      <SaveResultModal
        open={showSaveResultModal}
        requestPayload={saveRequestPayload}
        resultPayload={saveResultPayload}
        onClose={handleCloseSaveResultModal}
      />

      <DeleteCauseModal
        open={causeIdPendingDelete !== null}
        onClose={handleCloseDeleteCauseModal}
        onConfirm={handleConfirmDeleteCause}
      />
    </div>
  );
};
