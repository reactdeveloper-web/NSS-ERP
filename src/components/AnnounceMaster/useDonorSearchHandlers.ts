import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { searchDonorData } from 'src/api/masterApi';
import { ContentTypes } from 'src/constants/content';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { createInitialPersonalInfoForm } from './data';
import {
  donorSearchTypeCandidates,
  extractDonorRecords,
  getFirstValue,
  mapDonorSearchResult,
  mapDonorToPersonalInfo,
} from './AnnounceMasterContent.helpers';
import { getErrorMessage } from './AnnounceMasterContent.loaders';
import {
  AnnouncerTabKey,
  DonorIdentificationForm,
  DonorSearchResult,
  PersonalInfoForm,
} from './types';

type UseDonorSearchHandlersArgs = {
  donorIdentificationForm: DonorIdentificationForm;
  donorSearchRequestIdRef: MutableRefObject<number>;
  donorSearchTypeRef: MutableRefObject<
    DonorIdentificationForm['donorSearchType']
  >;
  lastDonorSearchKeyRef: MutableRefObject<string>;
  preservePersonalInfoOnEmptyDonorIdRef: MutableRefObject<boolean>;
  setActiveTab: Dispatch<SetStateAction<AnnouncerTabKey>>;
  setDonorIdentificationForm: Dispatch<SetStateAction<DonorIdentificationForm>>;
  setDonorOptions: Dispatch<SetStateAction<DonorSearchResult[]>>;
  setDonorSearchError: Dispatch<SetStateAction<string>>;
  setIsSearchingDonor: Dispatch<SetStateAction<boolean>>;
  setPersonalInfoForm: Dispatch<SetStateAction<PersonalInfoForm>>;
  setShowDonorModal: Dispatch<SetStateAction<boolean>>;
};

export const useDonorSearchHandlers = ({
  donorIdentificationForm,
  donorSearchRequestIdRef,
  donorSearchTypeRef,
  lastDonorSearchKeyRef,
  preservePersonalInfoOnEmptyDonorIdRef,
  setActiveTab,
  setDonorIdentificationForm,
  setDonorOptions,
  setDonorSearchError,
  setIsSearchingDonor,
  setPersonalInfoForm,
  setShowDonorModal,
}: UseDonorSearchHandlersArgs) => {
  const resetPersonalInfo = useCallback(
    (overrides?: Partial<PersonalInfoForm>) => {
      setPersonalInfoForm({
        ...createInitialPersonalInfoForm(),
        ...overrides,
      });
    },
    [setPersonalInfoForm],
  );

  const applyDonorRecord = useCallback(
    (
      donorRecord: Record<string, unknown>,
      fallbackSearchData: string,
      nextSearchType?: DonorIdentificationForm['donorSearchType'],
    ) => {
      const resolvedDonorId =
        getFirstValue(donorRecord, ['NGCode', 'DonorID', 'DonorId']) ||
        fallbackSearchData;
      const resolvedSearchType =
        nextSearchType ?? donorIdentificationForm.donorSearchType;

      setDonorSearchError('');
      lastDonorSearchKeyRef.current = `${resolvedSearchType}:${resolvedDonorId}`;
      setDonorIdentificationForm(current => ({
        ...current,
        donorSearchType: resolvedSearchType,
        donorId: resolvedDonorId,
      }));

      const donorPersonalInfo = mapDonorToPersonalInfo(donorRecord);

      setPersonalInfoForm(current => ({
        ...current,
        ...Object.fromEntries(
          Object.entries(donorPersonalInfo).filter(
            ([, value]) => value !== undefined,
          ),
        ),
      }));
      setActiveTab('personal');
    },
    [
      donorIdentificationForm.donorSearchType,
      lastDonorSearchKeyRef,
      setActiveTab,
      setDonorIdentificationForm,
      setDonorSearchError,
      setPersonalInfoForm,
    ],
  );

  const handleSearchDonor = useCallback(async () => {
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
          response = await searchDonorData(
            {
              searchType,
              searchData,
              dataFlag: ContentTypes.DataFlag,
            },
            {
              headers: masterApiHeaders(),
            },
          );
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
            currentDonors.findIndex(item => item.donorId === donor.donorId) ===
              index,
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
    } catch (error) {
      if (requestId !== donorSearchRequestIdRef.current) {
        return;
      }

      setDonorSearchError(
        getErrorMessage(error, 'Failed to search donor data.'),
      );
      resetPersonalInfo();
    } finally {
      if (requestId === donorSearchRequestIdRef.current) {
        setIsSearchingDonor(false);
      }
    }
  }, [
    applyDonorRecord,
    donorIdentificationForm.donorId,
    donorIdentificationForm.donorSearchType,
    donorSearchRequestIdRef,
    resetPersonalInfo,
    setDonorOptions,
    setDonorSearchError,
    setIsSearchingDonor,
    setShowDonorModal,
  ]);

  const handleSelectDonor = useCallback(
    (donor: DonorSearchResult) => {
      applyDonorRecord(
        donor.record,
        donorIdentificationForm.donorId.trim(),
        'donorId',
      );
      setShowDonorModal(false);
      setDonorOptions([]);
    },
    [
      applyDonorRecord,
      donorIdentificationForm.donorId,
      setDonorOptions,
      setShowDonorModal,
    ],
  );

  const handleCloseDonorModal = useCallback(() => {
    setShowDonorModal(false);
  }, [setShowDonorModal]);

  useEffect(() => {
    const searchData = donorIdentificationForm.donorId.trim();

    if (!searchData) {
      lastDonorSearchKeyRef.current = '';
      donorSearchRequestIdRef.current += 1;
      setIsSearchingDonor(false);
      setDonorSearchError('');
      setDonorOptions([]);
      setShowDonorModal(false);
      if (preservePersonalInfoOnEmptyDonorIdRef.current) {
        preservePersonalInfoOnEmptyDonorIdRef.current = false;
        return;
      }
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
  }, [
    donorIdentificationForm.donorId,
    donorIdentificationForm.donorSearchType,
    donorSearchRequestIdRef,
    handleSearchDonor,
    lastDonorSearchKeyRef,
    preservePersonalInfoOnEmptyDonorIdRef,
    resetPersonalInfo,
    setDonorOptions,
    setDonorSearchError,
    setIsSearchingDonor,
    setShowDonorModal,
  ]);

  return {
    handleCloseDonorModal,
    handleSelectDonor,
    resetPersonalInfo,
  };
};
