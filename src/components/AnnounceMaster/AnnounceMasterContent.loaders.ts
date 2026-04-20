import { ContentTypes } from 'src/constants/content';
import {
  getCurrencyByCountry,
  getDepositBanks,
  getDistrictByState,
  getEventDetails,
  getOperationAmountByQty,
  getPurposeByDataFlag,
  getSalutations,
  getStateAndDistrictByPinCode,
  getStatesByCountry,
  getYojnaByPurposeAndCurrency,
} from 'src/api/masterApi';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import axiosInstance from 'src/redux/interceptor';
import {
  createEventOptions,
  createUniqueFieldOptions,
  extractAnnounceCauseOptions,
  extractArrayPayload,
  extractCauseHeadOptions,
  extractCurrencyId,
  extractDistrictOptions,
  extractHowToDonateOptions,
  extractOccasionOptions,
  extractOperationAmount,
  extractPincodeLocation,
  extractSalutationOptions,
  extractStateOptions,
  extractYojnaOptions,
  mapBankRecord,
  mapEventDetailRecord,
  resolveStateOption,
} from './AnnounceMasterContent.helpers';
import { DepositBank, EventOption } from './types';

const readSessionCache = <T,>(key: string): T | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawValue = window.sessionStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  } catch {
    return null;
  }
};

const writeSessionCache = (key: string, value: unknown) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore cache write failures.
  }
};

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.response?.data?.Message ||
  error?.message ||
  fallback;

const loadEventCauseOptions = async (
  eventOperation: string,
): Promise<EventOption[]> => {
  const response = await axiosInstance.get(masterApiPaths.getAnnounceCauses, {
    params: {
      DataFlag: ContentTypes.DataFlag,
      Operation: eventOperation,
    },
  });

  return extractAnnounceCauseOptions(response.data);
};

const loadEventDetailsData = async ({
  eventOperation,
  isLive,
}: {
  eventOperation: string;
  isLive: boolean;
}) => {
  const response = await getEventDetails({
    dataflag: ContentTypes.DataFlag,
    IsLive: isLive ? 'Y' : 'N',
    Operation: eventOperation,
  });

  const records = extractArrayPayload(response.data).map(mapEventDetailRecord);

  return {
    records,
    eventOptions: createEventOptions(records),
    eventCityOptions: createUniqueFieldOptions(records, 'eventCity'),
    eventChannelOptions: createUniqueFieldOptions(records, 'eventChannel'),
    panditOptions: createUniqueFieldOptions(records, 'panditJi'),
  };
};

const loadOccasionTypeOptions = async (): Promise<EventOption[]> => {
  const response = await axiosInstance.get(masterApiPaths.getOccasionMaster, {
    params: {
      DataFlag: ContentTypes.DataFlag,
    },
    headers: masterApiHeaders(),
  });

  return extractOccasionOptions(response.data);
};

const loadHowToDonateMasterOptions = async (): Promise<EventOption[]> => {
  const response = await axiosInstance.get(
    masterApiPaths.getHowToDonateMaster,
    {
      headers: masterApiHeaders(),
    },
  );

  return extractHowToDonateOptions(response.data);
};

const loadStateMasterOptions = async (): Promise<EventOption[]> => {
  const response = await getStatesByCountry(
    {
      countryCode: 22,
      DataFlag: ContentTypes.DataFlag,
    },
    {
      headers: masterApiHeaders(),
    },
  );

  return extractStateOptions(response.data);
};

const loadDistrictMasterOptions = async (
  stateCode: string,
): Promise<EventOption[]> => {
  const response = await getDistrictByState(
    {
      stateCode,
      DataFlag: ContentTypes.DataFlag,
    },
    {
      headers: masterApiHeaders(),
    },
  );

  return extractDistrictOptions(response.data);
};

const loadPincodeLocationData = async ({
  normalizedPincode,
  stateOptions,
}: {
  normalizedPincode: string;
  stateOptions: EventOption[];
}) => {
  const response = await getStateAndDistrictByPinCode(
    {
      countryCode: 22,
      dataFlag: ContentTypes.DataFlag,
      pincode: normalizedPincode,
    },
    {
      headers: masterApiHeaders(),
    },
  );

  const location = extractPincodeLocation(response.data);

  return {
    location,
    matchedState: location ? resolveStateOption(stateOptions, location) : null,
  };
};

const loadCauseHeadMasterOptions = async (): Promise<EventOption[]> => {
  const cacheKey = `announce:cause-head-options:${ContentTypes.DataFlag}`;
  const cachedOptions = readSessionCache<EventOption[]>(cacheKey);

  if (cachedOptions?.length) {
    return cachedOptions;
  }

  const response = await getPurposeByDataFlag(
    {
      DataFlag: ContentTypes.DataFlag,
    },
    {
      headers: masterApiHeaders(),
    },
  );

  const options = extractCauseHeadOptions(response.data);
  writeSessionCache(cacheKey, options);
  return options;
};

const loadPurposeOptionsData = async (purposeId: string) => {
  const normalizedPurposeId = purposeId.trim();
  const currencyCacheKey = `announce:currency-id:${ContentTypes.DataFlag}`;
  const cachedCurrencyId = readSessionCache<string>(currencyCacheKey);

  let currencyId = cachedCurrencyId || '';

  if (!currencyId) {
    const currencyResponse = await getCurrencyByCountry(
      {
        countryCode: 22,
        DataFlag: ContentTypes.DataFlag,
      },
      {
        headers: masterApiHeaders(),
      },
    );

    currencyId = extractCurrencyId(currencyResponse.data);

    if (currencyId) {
      writeSessionCache(currencyCacheKey, currencyId);
    }
  }

  if (!currencyId) {
    return {
      currencyId: '',
      purposeOptions: [],
    };
  }

  const optionsCacheKey = `announce:yojna-options:${ContentTypes.DataFlag}:${currencyId}:${normalizedPurposeId}`;
  const cachedOptions = readSessionCache<EventOption[]>(optionsCacheKey);

  if (cachedOptions) {
    return {
      currencyId,
      purposeOptions: cachedOptions,
    };
  }

  const response = await getYojnaByPurposeAndCurrency(
    {
      DataFlag: ContentTypes.DataFlag,
      CurrencyId: currencyId,
      PurposeId: normalizedPurposeId,
    },
    {
      headers: masterApiHeaders(),
    },
  );

  const purposeOptions = extractYojnaOptions(response.data);
  writeSessionCache(optionsCacheKey, purposeOptions);

  return {
    currencyId,
    purposeOptions,
  };
};

const loadOperationAmountValue = async ({
  currencyId,
  quantity,
}: {
  currencyId: string;
  quantity: number;
}) => {
  const response = await getOperationAmountByQty(
    {
      DataFlag: ContentTypes.DataFlag,
      CurrencyId: currencyId,
      qty: quantity,
    },
    {
      headers: masterApiHeaders(),
    },
  );

  return extractOperationAmount(response.data);
};

const loadSalutationMasterOptions = async () => {
  const requestConfigs = [
    {
      params: {
        Data_Flag: ContentTypes.DataFlag,
      },
    },
    {
      params: {
        dataflag: ContentTypes.DataFlag,
      },
    },
  ];

  let response = null;
  let lastError: unknown = null;

  for (const config of requestConfigs) {
    try {
      response = await getSalutations(config.params);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!response) {
    throw lastError;
  }

  return extractSalutationOptions(response.data);
};

const loadBanksData = async (): Promise<{
  banks: DepositBank[];
  errorMessage: string;
}> => {
  try {
    const response = await getDepositBanks({
      dataflag: ContentTypes.DataFlag,
    });

    const banks = extractArrayPayload(response.data)
      .map(mapBankRecord)
      .filter(
        (bank, index, currentBanks) =>
          (bank.bankName || bank.accountNo || bank.ifsc || bank.branch) &&
          currentBanks.findIndex(item => item.id === bank.id) === index,
      );

    return {
      banks,
      errorMessage: '',
    };
  } catch (error) {
    return {
      banks: [],
      errorMessage: getErrorMessage(error, 'Failed to load bank list.'),
    };
  }
};

export {
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
};
