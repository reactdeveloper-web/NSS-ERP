import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchDonorData } from 'src/api/masterApi';
import { ContentTypes } from 'src/constants/content';
import axiosInstance from 'src/redux/interceptor';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  buildQuantityOptions,
  donorSearchTypeCandidates,
  extractDonorRecords,
  getFirstValue,
  parseAmountValue,
} from 'src/components/AnnounceMaster/AnnounceMasterContent.helpers';
import {
  loadCauseHeadMasterOptions,
  loadDistrictMasterOptions,
  loadOperationAmountValue,
  loadPincodeLocationData,
  loadPurposeOptionsData,
  loadStateMasterOptions,
} from 'src/components/AnnounceMaster/AnnounceMasterContent.loaders';
import { AddedAnnounceCause, EventOption } from 'src/components/AnnounceMaster/types';
import { ReceiveIdAnnouncesTab } from './ReceiveIdAnnouncesTab';
import { ReceiveIdAttachmentsTab } from './ReceiveIdAttachmentsTab';
import { ReceiveIdCommunicationAddressTab } from './ReceiveIdCommunicationAddressTab';
import { ReceiveIdContactDetailsTab } from './ReceiveIdContactDetailsTab';
import { ReceiveIdFormFooter } from './ReceiveIdFormFooter';
import { ReceiveIdFormHeader } from './ReceiveIdFormHeader';
import { ReceiveIdFormTabNav } from './ReceiveIdFormTabNav';
import { ReceiveIdIdentityDetailsTab } from './ReceiveIdIdentityDetailsTab';
import { ReceiveIdInstructionTab } from './ReceiveIdInstructionTab';
import { ReceiveIdPaymentDetailsTab } from './ReceiveIdPaymentDetailsTab';
import { ReceiveIdPersonalDetailsTab } from './ReceiveIdPersonalDetailsTab';
import { ReceiveIdPurposeTab } from './ReceiveIdPurposeTab';
import { ReceiveIdReceiptDetailsTab } from './ReceiveIdReceiptDetailsTab';
import { ReceiveIdRemarksTab } from './ReceiveIdRemarksTab';
import {
  createInitialReceiveIdFormValues,
  ReceiveIdFormField,
  ReceiveIdFormValues,
} from './ReceiveIdForm.types';

interface ReceiveIdFormProps {
  onExit: () => void;
}

interface ReceivePurposeDraft {
  causeHead: string;
  purpose: string;
  quantity: number;
  causeHeadDate: string;
  namePlateName: string;
  donorInstruction: string;
}

const createInitialReceivePurposeDraft = (): ReceivePurposeDraft => ({
  causeHead: '',
  purpose: '',
  quantity: 1,
  causeHeadDate: '',
  namePlateName: '',
  donorInstruction: '',
});

const normalizeDate = (value: string) => {
  if (!value) {
    return '';
  }

  const [day, month, year] = value.split(/[/-]/);

  if (!day || !month || !year) {
    return value;
  }

  return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const normalizeValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const mapReceiveDetailsToFormValues = (
  data: Record<string, unknown>,
): ReceiveIdFormValues => ({
  ...createInitialReceiveIdFormValues(),
  donorId: getFirstValue(data, ['Don_Id', 'Person_Id', 'Receive_DID']),
  announceId: getFirstValue(data, ['Announce_Id']),
  salutation: getFirstValue(data, ['Receive_DShri']) || 'Mr.',
  firstName: getFirstValue(data, ['First_Name']),
  lastName: getFirstValue(data, ['Last_Name']),
  dateOfBirth: normalizeDate(getFirstValue(data, ['DOB'])),
  occasion: getFirstValue(data, ['occasion', 'InRMemory']),
  inMemoryText: getFirstValue(data, ['InRMemory']),
  address1: getFirstValue(data, ['Receive_Add1']),
  address2: getFirstValue(data, ['Receive_Add2']),
  address3: getFirstValue(data, ['Receive_Add3']),
  country: getFirstValue(data, ['Receive_Country']),
  pincode: getFirstValue(data, ['Receive_Pincode']),
  state: getFirstValue(data, ['Receive_State']),
  city: getFirstValue(data, ['Receive_City']),
  district: getFirstValue(data, ['Receive_District']),
  careOf: getFirstValue(data, ['Receive_CareOf']),
  mobile1: getFirstValue(data, ['Receive_Mob']),
  whatsapp: getFirstValue(data, ['Receive_Whatsapp']),
  email1: getFirstValue(data, ['Email_ID']),
  mobile2: getFirstValue(data, ['Receive_Mob2']),
  email2: getFirstValue(data, ['Email_Id2']),
  aadharNumber: getFirstValue(data, ['Receive_Aadhar']),
  panNumber: getFirstValue(data, ['Pan_No']),
  paymentMode: getFirstValue(data, ['Receive_PayMode']),
  currency: getFirstValue(data, ['Receive_Currency']) || 'Indian Rupee (INR)',
  amount: normalizeValue(data.Receive_Amount),
  materialDepositId: getFirstValue(data, ['Store_Deposit_Id']),
  material: getFirstValue(data, ['Receive_Material']),
  bankName1: getFirstValue(data, ['Receive_Bank', 'Bank_Code']),
  chequeDate: normalizeDate(getFirstValue(data, ['Receive_Cheque_Date'])),
  chequeNo: getFirstValue(data, ['Receive_Cheque']),
  depositBank: getFirstValue(data, ['Deposit_Bank']) || 'All',
  depositDate: normalizeDate(getFirstValue(data, ['Deposit_Date'])),
  manualBankId: getFirstValue(data, ['Mannual_Bank_Code']),
  receiptCopy: getFirstValue(data, ['MailCode']) || 'Soft Copy',
  proofType: getFirstValue(data, ['Proof_Type']),
  receiveEvent: getFirstValue(data, ['Receive_Venue']),
  protocolSadhak: getFirstValue(data, ['Protocol_Sadhak']),
  provisionalNo: getFirstValue(data, ['Receive_Prov_No']),
  provisionalDate: normalizeDate(getFirstValue(data, ['Prov_Date'])),
  remarks:
    getFirstValue(data, ['Receive_Remark']) ||
    getFirstValue(data, ['Remark']) ||
    getFirstValue(data, ['Call_Remark']),
  mainMemberDonorId: getFirstValue(data, ['WOH_REF']),
  totalDueAmount: getFirstValue(data, ['TotAnnounceAmount']),
});

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || '',
    lastName: parts.length > 1 ? parts[parts.length - 1] : '',
  };
};

const mapDonorRecordToReceiveFormValues = (
  donorRecord: Record<string, unknown>,
): Partial<ReceiveIdFormValues> => {
  const donorName = getFirstValue(donorRecord, [
    'DonorName',
    'DName',
    'Name',
    'AnnouncerName',
  ]);
  const nameParts = splitName(donorName);

  return {
    donorId: getFirstValue(donorRecord, ['NGCode', 'DonorID', 'DonorId']),
    salutation:
      getFirstValue(donorRecord, [
        'DShri',
        'Salutation',
        'SalutationName',
        'Title',
        'TitleName',
        'Prefix',
      ]) || undefined,
    firstName:
      getFirstValue(donorRecord, ['First_Name', 'FirstName']) ||
      nameParts.firstName,
    lastName:
      getFirstValue(donorRecord, ['Last_Name', 'LastName']) || nameParts.lastName,
    dateOfBirth: normalizeDate(getFirstValue(donorRecord, ['DOB', 'DateOfBirth'])),
    address1: getFirstValue(donorRecord, ['Add1', 'Address1', 'DAdd1']),
    address2: getFirstValue(donorRecord, ['Add2', 'Address2', 'DAdd2']),
    address3: getFirstValue(donorRecord, ['Add3', 'Address3', 'DAdd3']),
    country: getFirstValue(donorRecord, ['CountryName', 'Country', 'CountryCode']),
    pincode: getFirstValue(donorRecord, ['PinCode', 'Pincode', 'ZipCode']),
    state: getFirstValue(donorRecord, ['StateName', 'State', 'StateCode']),
    city: getFirstValue(donorRecord, ['CityName', 'City', 'CityCode']),
    district: getFirstValue(donorRecord, [
      'DistrictName',
      'District',
      'DistrictCode',
    ]),
    mobile1: getFirstValue(donorRecord, [
      'DMobile',
      'MobileNo',
      'Mobile',
      'mobile',
    ]),
    whatsapp: getFirstValue(donorRecord, [
      'WhatsappNo',
      'WhatsAppNo',
      'WMobile',
      'AltMobile',
      'DMobile',
    ]),
    email1: getFirstValue(donorRecord, ['DEmail', 'Email', 'email']),
    aadharNumber: getFirstValue(donorRecord, [
      'AadharNo',
      'AadhaarNo',
      'Aadhar',
      'Aadhaar',
    ]),
    panNumber: getFirstValue(donorRecord, ['PAN_Number', 'PanNo', 'PAN', 'pan']),
  };
};

export const ReceiveIdForm: React.FC<ReceiveIdFormProps> = ({ onExit }) => {
  const location = useLocation();
  const [formValues, setFormValues] = useState<ReceiveIdFormValues>(
    createInitialReceiveIdFormValues(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [stateOptions, setStateOptions] = useState<EventOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<EventOption[]>([]);
  const [isPincodeLocationLocked, setIsPincodeLocationLocked] = useState(false);
  const [receivePurposeForm, setReceivePurposeForm] =
    useState<ReceivePurposeDraft>(createInitialReceivePurposeDraft());
  const [causeHeadOptions, setCauseHeadOptions] = useState<EventOption[]>([]);
  const [purposeOptions, setPurposeOptions] = useState<EventOption[]>([]);
  const [addedCauses, setAddedCauses] = useState<AddedAnnounceCause[]>([]);
  const [editingCauseId, setEditingCauseId] = useState<number | null>(null);
  const [autoAmount, setAutoAmount] = useState('');
  const [currencyId, setCurrencyId] = useState('');
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const pincodeRequestIdRef = useRef(0);
  const purposeOptionsRequestIdRef = useRef(0);
  const amountRequestIdRef = useRef(0);

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const receiveId = searchParams.get('RID') || '';
  const receiveHead = searchParams.get('HEAD') || '';
  const operation = searchParams.get('Operation')?.toUpperCase() || '';
  const isReadOnly = operation === 'VIEW';
  const shouldFetchDetails =
    ['EDIT', 'VIEW'].includes(operation) && Boolean(receiveId);

  const updateField = useCallback(
    (field: ReceiveIdFormField, value: string) => {
      if (field === 'pincode') {
        const normalizedPincode = value.replace(/\D/g, '').slice(0, 6);

        setFormValues(current => ({
          ...current,
          pincode: normalizedPincode,
        }));
        return;
      }

      setFormValues(current => ({
        ...current,
        [field]: value,
        district: field === 'state' ? '' : current.district,
      }));
    },
    [],
  );

  const updatePurposeField = useCallback(
    <K extends keyof ReceivePurposeDraft>(
      field: K,
      value: ReceivePurposeDraft[K],
    ) => {
      if (field === 'causeHead') {
        purposeOptionsRequestIdRef.current += 1;
        amountRequestIdRef.current += 1;
        setCurrencyId('');
        setPurposeOptions([]);
        setAutoAmount('');
        setIsAmountEditable(false);
        setReceivePurposeForm(current => ({
          ...current,
          causeHead: String(value),
          purpose: '',
          quantity: 1,
          causeHeadDate: String(value) === '150' ? current.causeHeadDate : '',
          namePlateName: ['162', '167', '168'].includes(String(value))
            ? current.namePlateName
            : '',
          donorInstruction: ['162', '167', '168'].includes(String(value))
            ? current.donorInstruction
            : '',
        }));
        return;
      }

      if (field === 'purpose') {
        amountRequestIdRef.current += 1;
        setAutoAmount('');
        setIsAmountEditable(false);
        setReceivePurposeForm(current => ({
          ...current,
          purpose: String(value),
          quantity: 1,
        }));
        return;
      }

      setReceivePurposeForm(current => ({ ...current, [field]: value }));
    },
    [],
  );

  const fetchReceiveDetails = useCallback(
    async (
      nextReceiveId: string,
      nextReceiveHead = receiveHead,
      includeContextParams = true,
    ) => {
      setLoading(true);
      setError('');
      setSearchError('');

      try {
        const params: Record<string, string> = {
          receiveId: nextReceiveId,
        };

        if (includeContextParams) {
          params.receiveHead = nextReceiveHead;
          params.dataFlag = ContentTypes.DataFlag;
        }

        const response = await axiosInstance.get(
          masterApiPaths.getReceiveIdDetailsById,
          {
            params,
            headers: masterApiHeaders(),
          },
        );

        const responseData = response.data?.Data;

        if (responseData && typeof responseData === 'object') {
          setFormValues(
            mapReceiveDetailsToFormValues(responseData as Record<string, unknown>),
          );
          return;
        }

        setSearchError('No receive ID details found.');
      } catch (apiError: any) {
        setFormValues(createInitialReceiveIdFormValues());
        const message =
          apiError?.response?.data?.message ||
          apiError?.response?.data?.Message ||
          apiError?.message ||
          'Receive ID details load nahi hui.';

        if (includeContextParams) {
          setError(message);
        } else {
          setSearchError(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [receiveHead],
  );

  useEffect(() => {
    if (!shouldFetchDetails) {
      setFormValues(createInitialReceiveIdFormValues());
      setError('');
      return;
    }

    void fetchReceiveDetails(receiveId, receiveHead);
  }, [fetchReceiveDetails, receiveHead, receiveId, shouldFetchDetails]);

  useEffect(() => {
    const loadStates = async () => {
      try {
        setStateOptions(await loadStateMasterOptions());
      } catch {
        setStateOptions([]);
      }
    };

    void loadStates();
  }, []);

  useEffect(() => {
    const loadCauseHeads = async () => {
      try {
        setCauseHeadOptions(await loadCauseHeadMasterOptions());
      } catch {
        setCauseHeadOptions([]);
      }
    };

    void loadCauseHeads();
  }, []);

  useEffect(() => {
    if (!formValues.state.trim() || stateOptions.length === 0) {
      return;
    }

    const matchedState = stateOptions.find(
      option =>
        option.value === formValues.state ||
        option.label === formValues.state ||
        option.stateCode?.trim() === formValues.state.trim(),
    );

    if (!matchedState || matchedState.value === formValues.state) {
      return;
    }

    setFormValues(current => ({
      ...current,
      state: matchedState.value,
    }));
  }, [formValues.state, stateOptions]);

  useEffect(() => {
    const selectedState = stateOptions.find(
      option =>
        option.value === formValues.state ||
        option.label === formValues.state ||
        option.stateCode?.trim() === formValues.state.trim(),
    );
    const stateCode = selectedState?.stateCode?.trim();

    if (!stateCode) {
      setDistrictOptions([]);
      return;
    }

    const loadDistricts = async () => {
      try {
        setDistrictOptions(await loadDistrictMasterOptions(stateCode));
      } catch {
        setDistrictOptions([]);
      }
    };

    void loadDistricts();
  }, [formValues.state, stateOptions]);

  useEffect(() => {
    if (!formValues.district.trim() || districtOptions.length === 0) {
      return;
    }

    const matchedDistrict = districtOptions.find(
      option =>
        option.value === formValues.district ||
        option.label === formValues.district ||
        option.districtCode?.trim() === formValues.district.trim(),
    );

    if (!matchedDistrict || matchedDistrict.value === formValues.district) {
      return;
    }

    setFormValues(current => ({
      ...current,
      district: matchedDistrict.value,
    }));
  }, [districtOptions, formValues.district]);

  useEffect(() => {
    const normalizedPincode = formValues.pincode.replace(/\D/g, '');

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

          setFormValues(current => ({
            ...current,
            country: location.country.trim() || 'India',
            state: matchedState?.value || location.state.trim() || current.state,
            district: location.district.trim() || current.district,
          }));
          setIsPincodeLocationLocked(
            Boolean(
              matchedState?.value ||
                location.state.trim() ||
                location.district.trim(),
            ),
          );
        } catch {
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
  }, [formValues.pincode, stateOptions]);

  useEffect(() => {
    if (!receivePurposeForm.causeHead.trim() || causeHeadOptions.length === 0) {
      return;
    }

    const matchedCauseHead = causeHeadOptions.find(
      option =>
        option.value === receivePurposeForm.causeHead ||
        option.purposeId?.trim() === receivePurposeForm.causeHead.trim(),
    );

    if (!matchedCauseHead || matchedCauseHead.value === receivePurposeForm.causeHead) {
      return;
    }

    setReceivePurposeForm(current => ({
      ...current,
      causeHead: matchedCauseHead.value,
    }));
  }, [causeHeadOptions, receivePurposeForm.causeHead]);

  useEffect(() => {
    const selectedCauseHead = causeHeadOptions.find(
      option =>
        option.value === receivePurposeForm.causeHead ||
        option.purposeId?.trim() === receivePurposeForm.causeHead.trim(),
    );
    const purposeId = selectedCauseHead?.value || receivePurposeForm.causeHead.trim();

    if (!purposeId) {
      purposeOptionsRequestIdRef.current += 1;
      setCurrencyId('');
      setPurposeOptions([]);
      setAutoAmount('');
      setIsAmountEditable(false);
      setReceivePurposeForm(current =>
        current.purpose || current.quantity !== 1
          ? { ...current, purpose: '', quantity: 1 }
          : current,
      );
      return;
    }

    const requestId = purposeOptionsRequestIdRef.current + 1;
    purposeOptionsRequestIdRef.current = requestId;

    const loadPurposes = async () => {
      try {
        const {
          currencyId: nextCurrencyId,
          purposeOptions: nextPurposeOptions,
        } = await loadPurposeOptionsData(purposeId);

        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        if (!nextCurrencyId) {
          setCurrencyId('');
          setPurposeOptions([]);
          setAutoAmount('');
          setIsAmountEditable(false);
          return;
        }

        setCurrencyId(nextCurrencyId);
        setPurposeOptions(nextPurposeOptions);
        setIsAmountEditable(false);
        setReceivePurposeForm(current => {
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
      } catch {
        if (requestId !== purposeOptionsRequestIdRef.current) {
          return;
        }

        setCurrencyId('');
        setPurposeOptions([]);
        setAutoAmount('');
        setIsAmountEditable(false);
        setReceivePurposeForm(current =>
          current.purpose || current.quantity !== 1
            ? { ...current, purpose: '', quantity: 1 }
            : current,
        );
      }
    };

    void loadPurposes();
  }, [causeHeadOptions, receivePurposeForm.causeHead]);

  useEffect(() => {
    const quantity = Math.max(1, Number(receivePurposeForm.quantity) || 1);
    const selectedCauseHead = causeHeadOptions.find(
      option => option.value === receivePurposeForm.causeHead,
    );
    const selectedCauseHeadPurposeId =
      selectedCauseHead?.purposeId?.trim() || receivePurposeForm.causeHead.trim();
    const selectedPurpose = purposeOptions.find(
      option => option.value === receivePurposeForm.purpose,
    );
    const selectedPurposeId =
      selectedPurpose?.yojnaId?.trim() || receivePurposeForm.purpose.trim();
    const selectedPurposeQty = selectedPurpose?.qtyValue?.trim() || '';
    const selectedPurposeQtyNumber = Math.max(0, Number(selectedPurposeQty || 0));
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
      setIsAmountEditable(selectedPurposeAmount <= 1);
      setAutoAmount(current =>
        current || (selectedPurposeAmount > 0 ? String(selectedPurposeAmount) : ''),
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

    const loadAmount = async () => {
      try {
        const nextAmount = await loadOperationAmountValue({
          currencyId,
          quantity,
        });

        if (requestId === amountRequestIdRef.current) {
          setAutoAmount(nextAmount);
        }
      } catch {
        if (requestId === amountRequestIdRef.current) {
          setAutoAmount('');
        }
      }
    };

    void loadAmount();
  }, [
    causeHeadOptions,
    currencyId,
    purposeOptions,
    receivePurposeForm.causeHead,
    receivePurposeForm.purpose,
    receivePurposeForm.quantity,
  ]);

  useEffect(() => {
    const selectedPurpose = purposeOptions.find(
      option => option.value === receivePurposeForm.purpose,
    );
    const selectedPurposeQty = Math.max(
      0,
      Number(selectedPurpose?.qtyValue?.trim() || 0),
    );

    if (selectedPurposeQty <= 1) {
      return;
    }

    setReceivePurposeForm(current =>
      current.quantity === selectedPurposeQty
        ? current
        : { ...current, quantity: selectedPurposeQty },
    );
  }, [purposeOptions, receivePurposeForm.purpose]);

  const handleSearchReceiveId = useCallback(
    (nextReceiveId: string) => {
      void fetchReceiveDetails(nextReceiveId, receiveHead, false);
    },
    [fetchReceiveDetails, receiveHead],
  );

  const handleSearchDonor = useCallback(
    async (searchType: string, searchValue: string) => {
      if (searchType === 'receiveId') {
        setSearchError('');
        handleSearchReceiveId(searchValue);
        return;
      }

      if (!searchValue.trim()) {
        setSearchError('Please enter a value to search.');
        return;
      }

      setLoading(true);
      setSearchError('');

      try {
        const searchTypeOptions =
          donorSearchTypeCandidates[searchType] ?? donorSearchTypeCandidates.donorId;
        let response = null;
        let lastError: unknown = null;

        for (const nextSearchType of searchTypeOptions) {
          try {
            response = await searchDonorData(
              {
                searchType: nextSearchType,
                searchData: searchValue,
                dataFlag: ContentTypes.DataFlag,
              },
              {
                headers: masterApiHeaders(),
              },
            );
            break;
          } catch (apiError) {
            lastError = apiError;
          }
        }

        if (!response) {
          throw lastError;
        }

        const donorRecords = extractDonorRecords(response.data);

        if (!donorRecords.length) {
          setSearchError('No donor data found.');
          return;
        }

        setFormValues(current => ({
          ...current,
          ...Object.fromEntries(
            Object.entries(mapDonorRecordToReceiveFormValues(donorRecords[0])).filter(
              ([, value]) => value !== undefined,
            ),
          ),
        }));
      } catch (apiError: any) {
        setSearchError(
          apiError?.response?.data?.message ||
            apiError?.response?.data?.Message ||
            apiError?.message ||
            'Failed to search donor data.',
        );
      } finally {
        setLoading(false);
      }
    },
    [handleSearchReceiveId],
  );

  const resetReceivePurposeDraft = useCallback(() => {
    purposeOptionsRequestIdRef.current += 1;
    amountRequestIdRef.current += 1;
    setCurrencyId('');
    setPurposeOptions([]);
    setAutoAmount('');
    setIsAmountEditable(false);
    setReceivePurposeForm(createInitialReceivePurposeDraft());
  }, []);

  const handlePurposeAmountChange = useCallback((value: string) => {
    setAutoAmount(value.replace(/[^\d.]/g, ''));
  }, []);

  const handlePurposeQuantityChange = useCallback((nextQuantity: number) => {
    setReceivePurposeForm(current => ({
      ...current,
      quantity: Math.max(1, Number.isFinite(nextQuantity) ? nextQuantity : 1),
    }));
  }, []);

  const syncCauseSummaryFields = useCallback(
    (causes: AddedAnnounceCause[]) => {
      const totalAmount = causes.reduce(
        (total, cause) => total + parseAmountValue(cause.amount),
        0,
      );
      const [firstCause] = causes;

      setFormValues(current => ({
        ...current,
        head: firstCause?.causeHeadPurposeId || firstCause?.causeHead || '',
        subHead: firstCause?.yojnaId || firstCause?.purpose || '',
        purposeDetails: causes
          .map(cause => cause.purposeLabel || cause.purpose)
          .filter(Boolean)
          .join(', '),
        quantity: causes.length
          ? String(
              causes.reduce(
                (total, cause) => total + (Number(cause.quantity) || 0),
                0,
              ),
            )
          : '1',
        amount: totalAmount > 0 ? String(totalAmount) : current.amount,
      }));
    },
    [],
  );

  const handleAddCause = useCallback(() => {
    if (isReadOnly) {
      return;
    }

    const normalizedCauseHead = receivePurposeForm.causeHead.trim();
    const normalizedPurpose = receivePurposeForm.purpose.trim();
    const selectedCauseHead = causeHeadOptions.find(
      option =>
        option.value.trim() === normalizedCauseHead ||
        option.purposeId?.trim() === normalizedCauseHead,
    );
    const selectedPurpose = purposeOptions.find(
      option =>
        option.value.trim() === normalizedPurpose ||
        option.yojnaId?.trim() === normalizedPurpose,
    );
    const yojnaId = selectedPurpose?.yojnaId?.trim() || normalizedPurpose;
    const causeAmount =
      autoAmount.trim() || selectedPurpose?.amountValue?.trim() || '';
    const causeHeadPurposeId =
      selectedCauseHead?.purposeId?.trim() ||
      selectedCauseHead?.value.trim() ||
      normalizedCauseHead;
    const causeHeadValue = selectedCauseHead?.value.trim() || causeHeadPurposeId;
    const purposeValue = selectedPurpose?.value.trim() || yojnaId;

    if (
      !normalizedCauseHead ||
      !normalizedPurpose ||
      !yojnaId ||
      !causeAmount ||
      (causeHeadPurposeId === '150' && !receivePurposeForm.causeHeadDate.trim())
    ) {
      return;
    }

    const nextCause: AddedAnnounceCause = {
      id: editingCauseId ?? Date.now(),
      causeHead: causeHeadValue,
      causeHeadLabel: selectedCauseHead?.label || normalizedCauseHead,
      causeHeadPurposeId,
      purpose: purposeValue,
      purposeLabel: selectedPurpose?.label || normalizedPurpose,
      yojnaId,
      quantity: Math.max(1, Number(receivePurposeForm.quantity) || 1),
      amount: causeAmount,
      causeHeadDate: receivePurposeForm.causeHeadDate,
      namePlateName: receivePurposeForm.namePlateName.trim(),
      donorInstruction: receivePurposeForm.donorInstruction.trim(),
    };

    setAddedCauses(current => {
      const nextCauses =
        editingCauseId === null
          ? [...current, nextCause]
          : current.map(cause =>
              cause.id === editingCauseId ? nextCause : cause,
            );

      syncCauseSummaryFields(nextCauses);
      return nextCauses;
    });
    setEditingCauseId(null);
    resetReceivePurposeDraft();
  }, [
    autoAmount,
    causeHeadOptions,
    editingCauseId,
    isReadOnly,
    purposeOptions,
    receivePurposeForm,
    resetReceivePurposeDraft,
    syncCauseSummaryFields,
  ]);

  const handleEditCause = useCallback(
    (causeId: number) => {
      if (isReadOnly) {
        return;
      }

      const cause = addedCauses.find(item => item.id === causeId);

      if (!cause) {
        return;
      }

      setEditingCauseId(causeId);
      setAutoAmount(cause.amount);
      setReceivePurposeForm({
        causeHead: cause.causeHead,
        purpose: cause.purpose,
        quantity: cause.quantity,
        causeHeadDate: cause.causeHeadDate,
        namePlateName: cause.namePlateName,
        donorInstruction: cause.donorInstruction,
      });
    },
    [addedCauses, isReadOnly],
  );

  const handleDeleteCause = useCallback(
    (causeId: number) => {
      if (isReadOnly) {
        return;
      }

      setAddedCauses(current => {
        const nextCauses = current.filter(cause => cause.id !== causeId);
        syncCauseSummaryFields(nextCauses);
        return nextCauses;
      });

      if (editingCauseId === causeId) {
        setEditingCauseId(null);
        resetReceivePurposeDraft();
      }
    },
    [
      editingCauseId,
      isReadOnly,
      resetReceivePurposeDraft,
      syncCauseSummaryFields,
    ],
  );

  const availablePurposeOptions = purposeOptions.filter(option => {
    const yojnaId = option.yojnaId?.trim() || option.value.trim();

    return (
      editingCauseId !== null ||
      !addedCauses.some(cause => (cause.yojnaId || cause.purpose) === yojnaId)
    );
  });
  const selectedPurposeOption = purposeOptions.find(
    option => option.value === receivePurposeForm.purpose,
  );
  const selectedPurposeQty = Math.max(
    0,
    Number(selectedPurposeOption?.qtyValue?.trim() || 0),
  );
  const quantityControlMode: 'disabled' | 'stepper' | 'select' =
    !receivePurposeForm.purpose.trim()
      ? 'disabled'
      : selectedPurposeQty > 1
        ? 'select'
        : 'stepper';
  const quantityOptions =
    quantityControlMode === 'select'
      ? buildQuantityOptions(selectedPurposeQty)
      : [];
  const isAddCauseDisabled =
    !receivePurposeForm.causeHead.trim() ||
    !receivePurposeForm.purpose.trim() ||
    !autoAmount.trim() ||
    (receivePurposeForm.causeHead === '150' &&
      !receivePurposeForm.causeHeadDate.trim());

  const tabProps = {
    values: formValues,
    updateField,
    isReadOnly,
    stateOptions,
    districtOptions,
    isPincodeLocationLocked,
    purposeForm: receivePurposeForm,
    addedCauses,
    editingCauseId,
    causeHeadOptions,
    purposeOptions: availablePurposeOptions,
    autoAmount,
    isAmountEditable,
    quantityControlMode,
    quantityOptions,
    isAddCauseDisabled,
    onPurposeChange: updatePurposeField,
    onPurposeAmountChange: handlePurposeAmountChange,
    onPurposeQuantityChange: handlePurposeQuantityChange,
    onAddCause: handleAddCause,
    onEditCause: handleEditCause,
    onDeleteCause: handleDeleteCause,
  };

  return (
    <div className={'row g-6'}>
      <div className={'col-12'}>
        <div className={'card card-flush'}>
          <ReceiveIdFormHeader
            onSearch={handleSearchDonor}
            isSearching={loading}
            searchError={searchError}
          />

          <div className={'card-body pt-6'}>
            {error ? <div className="alert alert-warning">{error}</div> : null}
            {loading ? (
              <div className="alert alert-info">Receive ID details loading...</div>
            ) : null}

            <ReceiveIdFormTabNav />

            <div className={'tab-content'} id="detailsTabContent">
              <ReceiveIdPersonalDetailsTab {...tabProps} />
              <ReceiveIdCommunicationAddressTab {...tabProps} />
              <ReceiveIdContactDetailsTab {...tabProps} />
              <ReceiveIdIdentityDetailsTab {...tabProps} />
              <ReceiveIdPaymentDetailsTab {...tabProps} />
              <ReceiveIdReceiptDetailsTab {...tabProps} />
              <ReceiveIdPurposeTab {...tabProps} />
              <ReceiveIdInstructionTab {...tabProps} />
              <ReceiveIdRemarksTab {...tabProps} />
              <ReceiveIdAttachmentsTab {...tabProps} />
              <ReceiveIdAnnouncesTab {...tabProps} />
            </div>

            <ReceiveIdFormFooter onExit={onExit} />
          </div>
        </div>
      </div>
    </div>
  );
};
