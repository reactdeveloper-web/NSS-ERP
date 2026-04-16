import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
import axiosInstance from 'src/redux/interceptor';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  extractArrayPayload,
} from '../AnnounceMaster/AnnounceMasterContent.helpers';
import {
  CallCenterTicketForm,
  CallCenterTicketValidationErrors,
} from './components/CallCenterTicketTab';
import { CitListingItem } from './components/CitListing';
import { TicketFollowUpItem } from './components/TicketFollowUpTab';
import {
  buildCitSavePayload,
  CitCacheRecord,
  CitOperation,
  createInitialTicketForm,
  createNextInformationCode,
  extractCitId,
  getCurrentUserMeta,
  mapCitRecordToCache,
  readCitCache,
  validateCitForm,
  writeCitCache,
} from './cit.helpers';

type CitTabKey = 'cit' | 'followup';

const buildListingItems = (records: CitCacheRecord[]): CitListingItem[] =>
  [...records]
    .sort(
      (left, right) =>
        Number(right.informationCode) - Number(left.informationCode),
    )
    .map(record => ({
      informationCode: record.informationCode,
      date: record.ticketForm.date,
      ngCode: record.ticketForm.ngCode,
      callCategoryName: record.ticketForm.callCategoryName,
      requestBy: record.ticketForm.requestBy,
      mobileNo1: record.ticketForm.mobileNo1,
      callBackDate: record.ticketForm.callBackDate,
      completed: record.completed,
    }));

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

const applyRecordToForm = (
  record: CitCacheRecord | null,
  informationCodeParam: string,
  setTicketForm: (value: CallCenterTicketForm) => void,
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
    setFollowUps([]);
    setCompleted(false);
    setActiveTab('cit');
    return;
  }

  setTicketForm(record.ticketForm);
  setFollowUps(record.followUps);
  setCompleted(record.completed);
  setActiveTab('cit');
};

export const useCitContentState = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);
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
  const [followUps, setFollowUps] = useState<TicketFollowUpItem[]>([]);
  const [records, setRecords] = useState<CitCacheRecord[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [listingLoading, setListingLoading] = useState(false);
  const [listingError, setListingError] = useState('');
  const [validationErrors, setValidationErrors] =
    useState<CallCenterTicketValidationErrors>({});
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveResultPayload, setSaveResultPayload] = useState<unknown>(null);
  const [shouldNavigateOnModalClose, setShouldNavigateOnModalClose] =
    useState(false);

  const listingItems = useMemo(() => buildListingItems(records), [records]);

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
    setSaveResultPayload(null);

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
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [statusMessage]);

  useEffect(() => {
    if (!isListingMode) {
      return;
    }

    const loadCitListing = async () => {
      const { empNum, dataFlag, fyId } = getCurrentUserMeta();

      setListingLoading(true);
      setListingError('');

      try {
        const response = await axiosInstance.post(masterApiPaths.getCitList, {
          useR_ID: empNum,
          user_id: empNum,
          data_Flag: dataFlag,
          fY_ID: fyId,
          PageNumber: 1,
          PageSize: 100,
        });
        const apiRecords = extractArrayPayload(response.data);

        if (!apiRecords.length) {
          return;
        }

        const nextRecords = apiRecords.map(mapCitRecordToCache);
        setRecords(nextRecords);
        writeCitCache(nextRecords);
      } catch (error: any) {
        setListingError(
          error?.response?.data?.message ||
            error?.message ||
            'CIT listing load nahi hui.',
        );
      } finally {
        setListingLoading(false);
      }
    };

    void loadCitListing();
  }, [isListingMode]);

  useEffect(() => {
    if (isListingMode) {
      return;
    }

    if (operation === 'ADD') {
      applyRecordToForm(
        null,
        informationCodeParam,
        setTicketForm,
        setFollowUps,
        setCompleted,
        setActiveTab,
      );
      return;
    }

    const loadCitDetails = async () => {
      const { dataFlag } = getCurrentUserMeta();
      const cacheRecord = readCitCache().find(
        record => record.informationCode === informationCodeParam,
      );

      try {
        const response = await axiosInstance.post(
          masterApiPaths.getCitDetailsById,
          {
            iCall_Information_Traits_ID: Number(informationCodeParam || 0) || 0,
            InformationCode: Number(informationCodeParam || 0) || 0,
            data_Flag: dataFlag,
          },
        );
        const [apiRecord] = extractArrayPayload(response.data);

        if (apiRecord) {
          applyRecordToForm(
            mapCitRecordToCache(apiRecord),
            informationCodeParam,
            setTicketForm,
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
        setFollowUps,
        setCompleted,
        setActiveTab,
      );
    };

    void loadCitDetails();
  }, [informationCodeParam, isListingMode, operation]);

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

  const handleAddFollowUp = () => {
    if (isViewMode) {
      return;
    }

    setFollowUps(current => [
      ...current,
      { id: Date.now(), date: '', time: '', note: '' },
    ]);
  };

  const handleFollowUpChange = (
    id: number,
    field: 'date' | 'time' | 'note',
    value: string,
  ) => {
    setFollowUps(current =>
      current.map(item => (item.id === id ? { ...item, [field]: value } : item)),
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

    const nextErrors = validateCitForm(ticketForm);

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
      });
      const response = await axiosInstance.post(path, payload);
      const existingRecords = readCitCache();
      const nextInformationCode = extractCitId(
        response.data,
        operation === 'ADD'
          ? createNextInformationCode(existingRecords)
          : informationCodeParam,
      );
      const nextRecord = buildSavedRecord({
        existingRecords,
        informationCode: nextInformationCode,
        completed,
        ticketForm,
        followUps,
      });
      const nextRecords = existingRecords.some(
        record => record.informationCode === nextInformationCode,
      )
        ? existingRecords.map(record =>
            record.informationCode === nextInformationCode ? nextRecord : record,
          )
        : [...existingRecords, nextRecord];

      writeCitCache(nextRecords);
      setRecords(nextRecords);
      setSaveResultPayload(response.data);
      setStatusMessage(
        operation === 'ADD'
          ? 'Call information trait saved successfully.'
          : 'Call information trait updated successfully.',
      );
      setShouldNavigateOnModalClose(true);
      setShowSaveResultModal(true);
    } catch (error: any) {
      setSaveResultPayload(
        error?.response?.data || {
          message: error?.message || 'CIT save failed.',
        },
      );
      setShouldNavigateOnModalClose(false);
      setShowSaveResultModal(true);
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

    writeCitCache(nextRecords);
    setRecords(nextRecords);
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
    followUps,
    deletingId,
    statusMessage,
    listingLoading,
    listingError,
    validationErrors,
    showSaveResultModal,
    saveResultPayload,
    listingItems,
    openCitListing,
    openCitForm,
    handleCloseSaveResultModal,
    handleTicketFormChange,
    handleAddFollowUp,
    handleFollowUpChange,
    handleRemoveFollowUp,
    handleReset,
    handleSave,
    handleDelete,
  };
};
