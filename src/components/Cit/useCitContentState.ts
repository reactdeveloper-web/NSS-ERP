import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import { ContentTypes } from 'src/constants/content';
import { FloatingSelectOption } from 'src/components/Common/FloatingSelectField';
import axiosInstance from 'src/redux/interceptor';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  extractArrayPayload,
  extractDonorRecords,
  getFirstValue,
} from '../AnnounceMaster/AnnounceMasterContent.helpers';
import {
  CallCenterTicketForm,
  CallCenterTicketValidationErrors,
} from './components/CallCenterTicketTab';
import { TicketFollowUpItem } from './components/TicketFollowUpTab';
import {
  buildCitSavePayload,
  CitCacheRecord,
  CitCallCategoryOption,
  CitOperation,
  createInitialTicketForm,
  createNextInformationCode,
  extractCitDetailRecord,
  extractCitFollowUps,
  extractCitId,
  extractCitCallCategoryOptions,
  extractCitEmployeeOptions,
  extractCitCallSubCategoryOptions,
  getCurrentUserMeta,
  mapCitRecordToCache,
  readCitCache,
  validateCitForm,
  writeCitCache,
} from './cit.helpers';

type CitTabKey = 'cit' | 'followup';

const buildSavedRecord = ({
  existingRecords,
  informationCode,
  completed,
  ticketForm,
  followUps,
}: {
  existingRecords: CitCacheRecord[];
  informationCode: string;
  completed: boolean;
  ticketForm: CallCenterTicketForm;
  followUps: TicketFollowUpItem[];
}): CitCacheRecord => {
  const now = new Date().toISOString();

  return {
    informationCode,
    completed,
    ticketForm: {
      ...ticketForm,
      ticketId: informationCode,
    },
    followUps,
    createdAt:
      existingRecords.find(record => record.informationCode === informationCode)
        ?.createdAt || now,
    updatedAt: now,
  };
};

const mergeSavedRecordWithApiRecord = ({
  savedRecord,
  apiRecord,
}: {
  savedRecord: CitCacheRecord;
  apiRecord: CitCacheRecord;
}): CitCacheRecord => ({
  ...savedRecord,
  ...apiRecord,
  completed: apiRecord.completed || savedRecord.completed,
  ticketForm: {
    ...savedRecord.ticketForm,
    ...apiRecord.ticketForm,
    callCategoryName:
      apiRecord.ticketForm.callCategoryName || savedRecord.ticketForm.callCategoryName,
    selectTypeId: apiRecord.ticketForm.selectTypeId.length
      ? apiRecord.ticketForm.selectTypeId
      : savedRecord.ticketForm.selectTypeId,
    selectType: apiRecord.ticketForm.selectType || savedRecord.ticketForm.selectType,
    requestBy: apiRecord.ticketForm.requestBy || savedRecord.ticketForm.requestBy,
    country1: apiRecord.ticketForm.country1 || savedRecord.ticketForm.country1,
    mobileNo1: apiRecord.ticketForm.mobileNo1 || savedRecord.ticketForm.mobileNo1,
    country2: apiRecord.ticketForm.country2 || savedRecord.ticketForm.country2,
    mobileNo2: apiRecord.ticketForm.mobileNo2 || savedRecord.ticketForm.mobileNo2,
    callBackDate:
      apiRecord.ticketForm.callBackDate || savedRecord.ticketForm.callBackDate,
    callBackTime:
      apiRecord.ticketForm.callBackTime || savedRecord.ticketForm.callBackTime,
    details: apiRecord.ticketForm.details || savedRecord.ticketForm.details,
  },
  followUps: apiRecord.followUps.length ? apiRecord.followUps : savedRecord.followUps,
});

const applyRecordToForm = (
  record: CitCacheRecord | null,
  informationCodeParam: string,
  setTicketForm: (value: CallCenterTicketForm) => void,
  setDonorSearchValue: (value: string) => void,
  setFollowUps: (value: TicketFollowUpItem[]) => void,
  setCompleted: (value: boolean) => void,
  setActiveTab: (value: CitTabKey) => void,
) => {
  if (!record) {
    setTicketForm({
      ...createInitialTicketForm(),
      ticketId:
        informationCodeParam !== '0' ? informationCodeParam : 'AUTO/VIEW',
    });
    setDonorSearchValue('');
    setFollowUps([]);
    setCompleted(false);
    setActiveTab('cit');
    return;
  }

  setTicketForm(record.ticketForm);
  setDonorSearchValue(record.ticketForm.ngCode || '');
  setFollowUps(record.followUps);
  setCompleted(record.completed);
  setActiveTab('cit');
};

export const useCitContentState = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const operation = (
    queryParams.get('Operation') || 'ADD'
  ).toUpperCase() as CitOperation;
  const informationCodeParam = queryParams.get('InformationCode') || '0';
  const isListingMode = !queryParams.get('Operation');
  const isViewMode = operation === 'VIEW';

  const [activeTab, setActiveTab] = useState<CitTabKey>('cit');
  const [completed, setCompleted] = useState(false);
  const [ticketForm, setTicketForm] = useState<CallCenterTicketForm>(
    createInitialTicketForm,
  );
  const [callCategoryOptions, setCallCategoryOptions] = useState<
    CitCallCategoryOption[]
  >([
    {
      value: '',
      label: 'Select',
      deptIds: [],
      employeeIds: [],
      completionEmployeeIds: [],
    },
  ]);
  const [countryOptions, setCountryOptions] = useState<FloatingSelectOption[]>(
    [],
  );
  const [selectTypeOptions, setSelectTypeOptions] = useState<
    FloatingSelectOption[]
  >([{ value: '', label: 'Select' }]);
  const [selectSadhakOptions, setSelectSadhakOptions] = useState<
    FloatingSelectOption[]
  >([{ value: '', label: 'Select' }]);
  const [followUps, setFollowUps] = useState<TicketFollowUpItem[]>([]);
  const [records, setRecords] = useState<CitCacheRecord[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [validationErrors, setValidationErrors] =
    useState<CallCenterTicketValidationErrors>({});
  const [donorSearchValue, setDonorSearchValue] = useState('');
  const [isSearchingDonor, setIsSearchingDonor] = useState(false);
  const [donorSearchError, setDonorSearchError] = useState('');
  const [saveRequestPayload, setSaveRequestPayload] = useState<unknown>(null);
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveResultPayload, setSaveResultPayload] = useState<unknown>(null);
  const [saveResultSucceeded, setSaveResultSucceeded] = useState(false);
  const [shouldNavigateOnModalClose, setShouldNavigateOnModalClose] =
    useState(false);
  const donorSearchRequestIdRef = useRef(0);
  const donorSearchTouchedRef = useRef(false);
  const updateRecords = useCallback((nextRecords: CitCacheRecord[]) => {
    writeCitCache(nextRecords);
    setRecords(nextRecords);
  }, []);

  const fetchCitRecordById = useCallback(async (citId: string) => {
    const { dataFlag } = getCurrentUserMeta();
    const requestBodies = [
      {
        citId: Number(citId || 0) || 0,
        dataFlag: dataFlag || ContentTypes.DataFlag,
      },
      {
        iCall_Information_Traits_ID: Number(citId || 0) || 0,
        data_Flag: dataFlag || ContentTypes.DataFlag,
      },
      {
        InformationCode: Number(citId || 0) || 0,
        data_Flag: dataFlag || ContentTypes.DataFlag,
      },
      {
        citId: Number(citId || 0) || 0,
        data_Flag: dataFlag || ContentTypes.DataFlag,
      },
    ];

    for (const requestBody of requestBodies) {
      try {
        const response = await axiosInstance.post(
          masterApiPaths.getCitDetailsById,
          requestBody,
          {
            headers: masterApiHeaders(),
          },
        );
        const apiRecord = extractCitDetailRecord(response.data);

        if (apiRecord) {
          return {
            record: {
              ...mapCitRecordToCache(apiRecord),
              followUps: extractCitFollowUps(response.data),
            },
            rawResponse: response.data,
          };
        }
      } catch {
        // Try next request body shape.
      }
    }

    return null;
  }, []);

  const openCitListing = useCallback(() => {
    history.push(PATH.CIT);
  }, [history]);

  const openCitForm = useCallback(
    (nextInformationCode: string, nextOperation: CitOperation) => {
      history.push(
        `${PATH.CIT}?InformationCode=${nextInformationCode}&Operation=${nextOperation}`,
      );
    },
    [history],
  );

  const handleCloseSaveResultModal = useCallback(() => {
    setShowSaveResultModal(false);
    setSaveRequestPayload(null);
    setSaveResultPayload(null);
    setSaveResultSucceeded(false);

    if (shouldNavigateOnModalClose) {
      setShouldNavigateOnModalClose(false);
      openCitListing();
    }
  }, [openCitListing, shouldNavigateOnModalClose]);

  useEffect(() => {
    setRecords(readCitCache());
  }, [location.search]);

  useEffect(() => {
    if (!statusMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage('');

      if (shouldNavigateOnModalClose) {
        setShouldNavigateOnModalClose(false);
        openCitListing();
      }
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [openCitListing, shouldNavigateOnModalClose, statusMessage]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await axiosInstance.get('/master/GetCountryAll', {
          params: { dataFlag: 'FOREIGN_GANGOTRI' },
          headers: masterApiHeaders(),
        });
        const nextOptions = extractArrayPayload(response.data)
          .map(record => {
            const label = getFirstValue(record, [
              'country_name',
              'Country_Name',
              'CountryName',
              'countryName',
              'country',
              'Country',
              'name',
              'Name',
            ]).trim();
            const value = getFirstValue(record, [
              'country_code',
              'Country_Code',
              'CountryCode',
              'country_id',
              'Country_Id',
              'CountryId',
              'id',
              'ID',
            ]).trim();

            return {
              value,
              label,
            };
          })
          .filter(
            (option, index, currentOptions) =>
              option.value &&
              option.label &&
              currentOptions.findIndex(item => item.value === option.value) ===
                index,
          );

        setCountryOptions(nextOptions);
      } catch {
        setCountryOptions([]);
      }
    };

    void loadCountries();
  }, []);

  useEffect(() => {
    if (!countryOptions.length) {
      return;
    }

    setTicketForm(current => {
      const resolveCountryCode = (value: string) => {
        const normalizedValue = value.trim().toLowerCase();

        if (!normalizedValue) {
          return '';
        }

        const matchingOption = countryOptions.find(
          option =>
            option.value.trim().toLowerCase() === normalizedValue ||
            option.label.trim().toLowerCase() === normalizedValue,
        );

        return matchingOption?.value || value;
      };

      const nextCountry1 = resolveCountryCode(current.country1);
      const nextCountry2 = resolveCountryCode(current.country2);

      if (
        nextCountry1 === current.country1 &&
        nextCountry2 === current.country2
      ) {
        return current;
      }

      return {
        ...current,
        country1: nextCountry1,
        country2: nextCountry2,
      };
    });
  }, [countryOptions]);

  useEffect(() => {
    const loadCallCategories = async () => {
      const { dataFlag } = getCurrentUserMeta();
      const requestConfigs = [
        () =>
          axiosInstance.post(masterApiPaths.getCallCategoryList, null, {
            headers: masterApiHeaders(),
          }),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            { Data_Flag: dataFlag || ContentTypes.DataFlag },
            {
              headers: masterApiHeaders(),
            },
          ),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            { data_Flag: dataFlag || ContentTypes.DataFlag },
            {
              headers: masterApiHeaders(),
            },
          ),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            { dataFlag: dataFlag || ContentTypes.DataFlag },
            {
              headers: masterApiHeaders(),
            },
          ),
        () =>
          axiosInstance.post(
            masterApiPaths.getCallCategoryList,
            { DataFlag: dataFlag || ContentTypes.DataFlag },
            {
              headers: masterApiHeaders(),
            },
          ),
        () =>
          axiosInstance.post(masterApiPaths.getCallCategoryList, {}, {
            headers: masterApiHeaders(),
          }),
      ];

      for (const makeRequest of requestConfigs) {
        try {
          const response = await makeRequest();
          const nextOptions = extractCitCallCategoryOptions(response.data);

          if (nextOptions.length > 1) {
            setCallCategoryOptions(nextOptions);
            return;
          }
        } catch {
          // Try next request shape.
        }
      }

      setCallCategoryOptions([
        {
          value: '',
          label: 'Select',
          deptIds: [],
          employeeIds: [],
          completionEmployeeIds: [],
        },
      ]);
    };

    void loadCallCategories();
  }, []);

  useEffect(() => {
    if (!callCategoryOptions.length || !ticketForm.callCategoryId) {
      return;
    }

    const selectedOption = callCategoryOptions.find(
      option => option.value === ticketForm.callCategoryId,
    );

    if (!selectedOption || selectedOption.label === 'Select') {
      return;
    }

    setTicketForm(current =>
      current.callCategoryName === selectedOption.label
        ? current
        : {
            ...current,
            callCategoryName: selectedOption.label,
          },
    );
  }, [callCategoryOptions, ticketForm.callCategoryId]);

  useEffect(() => {
    const loadCallSubCategories = async () => {
      if (!ticketForm.callCategoryId || ticketForm.callCategoryId === '27') {
        setSelectTypeOptions([{ value: '', label: 'Select' }]);
        return;
      }

      try {
        const { dataFlag } = getCurrentUserMeta();
        const response = await axiosInstance.post(
          masterApiPaths.getCallSubCategoryList,
          {
            CatId: Number(ticketForm.callCategoryId),
            DataFlag: dataFlag || ContentTypes.DataFlag,
          },
          {
            headers: masterApiHeaders(),
          },
        );
        const nextOptions = extractCitCallSubCategoryOptions(response.data);
        setSelectTypeOptions(
          nextOptions.length ? nextOptions : [{ value: '', label: 'Select' }],
        );
      } catch {
        setSelectTypeOptions([{ value: '', label: 'Select' }]);
      }
    };

    void loadCallSubCategories();
  }, [ticketForm.callCategoryId]);

  useEffect(() => {
    if (
      ticketForm.callCategoryId === '27' ||
      !ticketForm.selectTypeId.length ||
      !selectTypeOptions.length
    ) {
      return;
    }

    const selectedLabels = selectTypeOptions
      .filter(
        option => option.value !== '' && ticketForm.selectTypeId.includes(option.value),
      )
      .map(option => option.label)
      .filter(Boolean);

    const nextSelectType = selectedLabels.join(', ');

    if (!nextSelectType || nextSelectType === ticketForm.selectType) {
      return;
    }

    setTicketForm(current => ({
      ...current,
      selectType: nextSelectType,
    }));
  }, [
    selectTypeOptions,
    ticketForm.callCategoryId,
    ticketForm.selectType,
    ticketForm.selectTypeId,
  ]);

  useEffect(() => {
    const loadEmployees = async () => {
      if (ticketForm.callCategoryId !== '27') {
        setSelectSadhakOptions([{ value: '', label: 'Select' }]);
        return;
      }

      try {
        const response = await axiosInstance.get(masterApiPaths.getEmployeeAll, {
          params: {
            emp_num: 0,
            dm_id: 0,
            emp_code: 0,
          },
          headers: masterApiHeaders(),
        });
        const nextOptions = extractCitEmployeeOptions(response.data);
        setSelectSadhakOptions(
          nextOptions.length ? nextOptions : [{ value: '', label: 'Select' }],
        );
      } catch {
        setSelectSadhakOptions([{ value: '', label: 'Select' }]);
      }
    };

    void loadEmployees();
  }, [ticketForm.callCategoryId]);

  useEffect(() => {
    if (
      ticketForm.callCategoryId !== '27' ||
      !selectSadhakOptions.length ||
      !ticketForm.selectSadhakId
    ) {
      return;
    }

    const selectedOption = selectSadhakOptions.find(
      option => option.value === ticketForm.selectSadhakId,
    );

    if (!selectedOption || selectedOption.label === 'Select') {
      return;
    }

    setTicketForm(current =>
      current.selectSadhakName === selectedOption.label
        ? current
        : {
            ...current,
            selectSadhakName: selectedOption.label,
          },
    );
  }, [selectSadhakOptions, ticketForm.callCategoryId, ticketForm.selectSadhakId]);

  useEffect(() => {
    setValidationErrors(current => {
      const nextErrors = { ...current };

      if (ticketForm.requestBy.trim()) {
        delete nextErrors.requestBy;
      }
      if (ticketForm.callCategoryId.trim()) {
        delete nextErrors.callCategoryName;
      }
      if (ticketForm.callCategoryId === '27' && ticketForm.selectSadhakId.trim()) {
        delete nextErrors.selectSadhakName;
      }
      if (
        ticketForm.callCategoryId !== '27' &&
        ticketForm.selectTypeId.length
      ) {
        delete nextErrors.selectType;
      }
      if (ticketForm.mobileNo1.trim() ? ticketForm.country1.trim() : true) {
        delete nextErrors.country1;
      }
      if (ticketForm.callBackDate.trim()) {
        delete nextErrors.callBackDate;
      }
      if (ticketForm.details.trim()) {
        delete nextErrors.details;
      }

      return Object.keys(nextErrors).length === Object.keys(current).length
        ? current
        : nextErrors;
    });
  }, [ticketForm]);

  useEffect(() => {
    const searchValue = donorSearchValue.trim();

    setTicketForm(current =>
      current.ngCode === searchValue
        ? current
        : {
            ...current,
            ngCode: searchValue,
          },
    );

    if (!searchValue) {
      donorSearchRequestIdRef.current += 1;
      setIsSearchingDonor(false);
      setDonorSearchError('');
      return;
    }

    if (searchValue === '0') {
      donorSearchRequestIdRef.current += 1;
      setIsSearchingDonor(false);
      setDonorSearchError('');
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const requestId = donorSearchRequestIdRef.current + 1;
      donorSearchRequestIdRef.current = requestId;
      setIsSearchingDonor(true);
      setDonorSearchError('');

      try {
        const searchTypes = ['NGCode', 'donorId', 'DonorId'];
        let donorRecords: Record<string, unknown>[] = [];

        for (const searchType of searchTypes) {
          try {
            const response = await axiosInstance.get(
              masterApiPaths.searchDonorData,
              {
                params: {
                  searchType,
                  searchData: searchValue,
                  dataFlag: ContentTypes.DataFlag,
                },
                headers: masterApiHeaders(),
              },
            );

            donorRecords = extractDonorRecords(response.data);

            if (donorRecords.length) {
              break;
            }
          } catch {
            // Try next donor search type.
          }
        }

        if (requestId !== donorSearchRequestIdRef.current) {
          return;
        }

        if (!donorRecords.length) {
          if (!donorSearchTouchedRef.current) {
            setDonorSearchError('');
            return;
          }
          setDonorSearchError('Donor not found.');
          return;
        }

        const donorCode = getFirstValue(donorRecords[0], [
          'NGCode',
          'DonorID',
          'DonorId',
          'donorId',
        ]).trim();
        const donorSalutation = getFirstValue(donorRecords[0], [
          'DShri',
          'Salutation',
          'SalutationName',
          'Title',
          'TitleName',
          'Prefix',
        ]).trim();
        const donorName = getFirstValue(donorRecords[0], [
          'DonorName',
          'DName',
          'Name',
          'AnnouncerName',
        ]).trim();
        const requestByValue = [
          donorSalutation && donorSalutation !== '0' ? donorSalutation : '',
          donorName,
        ]
          .filter(Boolean)
          .join(' ');

        if (!requestByValue) {
          setDonorSearchError('Donor name not available.');
          return;
        }

        setTicketForm(current => ({
          ...current,
          ngCode: donorCode || searchValue,
          requestBy: requestByValue,
        }));
      } finally {
        if (requestId === donorSearchRequestIdRef.current) {
          setIsSearchingDonor(false);
        }
      }
    }, 600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [donorSearchValue]);

  useEffect(() => {
    if (isListingMode) {
      return;
    }

    if (operation === 'ADD') {
      applyRecordToForm(
        null,
        informationCodeParam,
        setTicketForm,
        setDonorSearchValue,
        setFollowUps,
        setCompleted,
        setActiveTab,
      );
      return;
    }

    const loadCitDetails = async () => {
      const cacheRecord = readCitCache().find(
        record => record.informationCode === informationCodeParam,
      );

      try {
        const fetchedRecord = await fetchCitRecordById(informationCodeParam);

        if (fetchedRecord) {
          applyRecordToForm(
            fetchedRecord.record,
            informationCodeParam,
            setTicketForm,
            setDonorSearchValue,
            setFollowUps,
            setCompleted,
            setActiveTab,
          );
          return;
        }
      } catch {
        // cache fallback
      }

      applyRecordToForm(
        cacheRecord || null,
        informationCodeParam,
        setTicketForm,
        setDonorSearchValue,
        setFollowUps,
        setCompleted,
        setActiveTab,
      );
    };

    void loadCitDetails();
  }, [fetchCitRecordById, informationCodeParam, isListingMode, operation]);

  const handleTicketFormChange = <K extends keyof CallCenterTicketForm>(
    field: K,
    value: CallCenterTicketForm[K],
  ) => {
    setTicketForm(current => ({ ...current, [field]: value }));
    setValidationErrors(current => {
      if (!current[field as keyof CallCenterTicketValidationErrors]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field as keyof CallCenterTicketValidationErrors];
      return nextErrors;
    });
  };

  const handleCallCategoryChange = (value: string) => {
    const selectedOption = callCategoryOptions.find(option => option.value === value);

    setTicketForm(current => ({
      ...current,
      callCategoryId: value,
      callCategoryName: selectedOption?.label === 'Select' ? '' : selectedOption?.label || '',
      selectTypeId: [],
      selectType: '',
      selectSadhakId: '',
      selectSadhakName: '',
    }));

    setValidationErrors(current => {
      if (!current.callCategoryName) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.callCategoryName;
      delete nextErrors.selectType;
      delete nextErrors.selectSadhakName;
      return nextErrors;
    });
  };

  const handleSelectTypeChange = (value: string[]) => {
    const selectedLabels = selectTypeOptions
      .filter(option => value.includes(option.value))
      .map(option => option.label)
      .filter(label => label !== 'Select');

    setTicketForm(current => ({
      ...current,
      selectTypeId: value,
      selectType: selectedLabels.join(', '),
    }));

    setValidationErrors(current => {
      if (!current.selectType) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.selectType;
      return nextErrors;
    });
  };

  const handleSelectSadhakChange = (value: string) => {
    const selectedOption = selectSadhakOptions.find(
      option => option.value === value,
    );

    setTicketForm(current => ({
      ...current,
      selectSadhakId: value,
      selectSadhakName:
        selectedOption?.label === 'Select' ? '' : selectedOption?.label || '',
    }));

    setValidationErrors(current => {
      if (!current.selectSadhakName) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.selectSadhakName;
      return nextErrors;
    });
  };

  const handleAddFollowUp = () => {
    if (isViewMode) {
      return;
    }

    setFollowUps(current => [...current, { id: Date.now(), note: '' }]);
  };

  const handleFollowUpChange = (id: number, value: string) => {
    setFollowUps(current =>
      current.map(item => (item.id === id ? { ...item, note: value } : item)),
    );
  };

  const handleRemoveFollowUp = (id: number) => {
    setFollowUps(current => current.filter(item => item.id !== id));
  };

  const handleReset = () => {
    if (isListingMode || operation === 'ADD') {
      applyRecordToForm(
        null,
        informationCodeParam,
        setTicketForm,
        setDonorSearchValue,
        setFollowUps,
        setCompleted,
        setActiveTab,
      );
      setValidationErrors({});
      return;
    }

    const matchingRecord = readCitCache().find(
      record => record.informationCode === informationCodeParam,
    );

    if (!matchingRecord) {
      return;
    }

    applyRecordToForm(
      matchingRecord,
      informationCodeParam,
      setTicketForm,
      setDonorSearchValue,
      setFollowUps,
      setCompleted,
      setActiveTab,
    );
    setValidationErrors({});
  };

  const handleSave = async () => {
    if (isViewMode) {
      openCitListing();
      return;
    }

    const nextErrors = validateCitForm(ticketForm, {
      hasSelectableTypes: selectTypeOptions.some(
        option => option.value !== '' && option.label !== 'Select',
      ),
    });

    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors);
      setStatusMessage('');
      return;
    }

    try {
      const { path, payload } = buildCitSavePayload({
        form: ticketForm,
        followUps,
        completed,
        operation,
        informationCodeParam,
        donorSearchValue,
        selectedCategoryOption:
          callCategoryOptions.find(
            option => option.value === ticketForm.callCategoryId,
          ) || null,
      });
      setSaveRequestPayload(payload);
      const response = await axiosInstance.post(path, payload, {
        headers: masterApiHeaders(),
      });
      const existingRecords = readCitCache();
      const nextInformationCode = extractCitId(
        response.data,
        operation === 'ADD'
          ? createNextInformationCode(existingRecords)
          : informationCodeParam,
      );
      const savedRecord = buildSavedRecord({
        existingRecords,
        informationCode: nextInformationCode,
        completed,
        ticketForm,
        followUps,
      });
      const refreshedRecord = await fetchCitRecordById(nextInformationCode);
      const nextRecord = refreshedRecord?.record
        ? mergeSavedRecordWithApiRecord({
            savedRecord,
            apiRecord: refreshedRecord.record,
          })
        : savedRecord;
      const nextRecords = existingRecords.some(
        record => record.informationCode === nextInformationCode,
      )
        ? existingRecords.map(record =>
            record.informationCode === nextInformationCode ? nextRecord : record,
          )
        : [...existingRecords, nextRecord];

      updateRecords(nextRecords);
      if (refreshedRecord) {
        applyRecordToForm(
          nextRecord,
          nextInformationCode,
          setTicketForm,
          setDonorSearchValue,
          setFollowUps,
          setCompleted,
          setActiveTab,
        );
      }
      setSaveResultPayload(refreshedRecord?.rawResponse || response.data);
      setSaveResultSucceeded(true);
      setStatusMessage(
        operation === 'ADD'
          ? 'Call information trait saved successfully.'
          : 'Call information trait updated successfully.',
      );
      setShouldNavigateOnModalClose(true);
      setShowSaveResultModal(false);
    } catch (error: any) {
      setSaveResultPayload(
        error?.response?.data || {
          message: error?.message || 'CIT save failed.',
        },
      );
      setSaveResultSucceeded(false);
      setShouldNavigateOnModalClose(false);
      setShowSaveResultModal(false);
      setStatusMessage(
        error?.response?.data?.message || error?.message || 'CIT save failed.',
      );
    }
  };

  const handleDelete = (informationCode: string) => {
    setDeletingId(informationCode);

    const nextRecords = readCitCache().filter(
      record => record.informationCode !== informationCode,
    );

    updateRecords(nextRecords);
    setDeletingId(null);
    setStatusMessage('Call information trait deleted successfully.');
  };

  return {
    operation,
    isListingMode,
    isViewMode,
    activeTab,
    setActiveTab,
    completed,
    setCompleted,
    ticketForm,
    donorSearchValue,
    setDonorSearchValue: (value: string) => {
      donorSearchTouchedRef.current = true;
      setDonorSearchValue(value);
    },
    isSearchingDonor,
    donorSearchError,
    saveRequestPayload,
    callCategoryOptions,
    countryOptions,
    selectTypeOptions,
    selectSadhakOptions,
    followUps,
    deletingId,
    statusMessage,
    validationErrors,
    showSaveResultModal,
    saveResultPayload,
    saveResultSucceeded,
    openCitListing,
    openCitForm,
    handleCloseSaveResultModal,
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
  };
};
