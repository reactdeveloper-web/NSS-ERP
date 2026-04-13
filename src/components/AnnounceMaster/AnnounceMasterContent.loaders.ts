import { ContentTypes } from 'src/constants/content';
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
  const response = await axiosInstance.get(masterApiPaths.getEventDetails, {
    params: {
      dataflag: ContentTypes.DataFlag,
      IsLive: isLive ? 'Y' : 'N',
      Operation: eventOperation,
    },
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
  const response = await axiosInstance.get(masterApiPaths.getStatesByCountry, {
    params: {
      countryCode: 22,
      DataFlag: ContentTypes.DataFlag,
    },
    headers: masterApiHeaders(),
  });

  return extractStateOptions(response.data);
};

const loadDistrictMasterOptions = async (
  stateCode: string,
): Promise<EventOption[]> => {
  const response = await axiosInstance.get(masterApiPaths.getDistrictByState, {
    params: {
      stateCode,
      DataFlag: ContentTypes.DataFlag,
    },
    headers: masterApiHeaders(),
  });

  return extractDistrictOptions(response.data);
};

const loadPincodeLocationData = async ({
  normalizedPincode,
  stateOptions,
}: {
  normalizedPincode: string;
  stateOptions: EventOption[];
}) => {
  const response = await axiosInstance.post(
    masterApiPaths.getStateAndDistrictByPinCode,
    null,
    {
      params: {
        countryCode: 22,
        dataFlag: ContentTypes.DataFlag,
        pincode: normalizedPincode,
      },
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
  const response = await axiosInstance.get(
    masterApiPaths.getPurposeByDataFlag,
    {
      params: {
        DataFlag: ContentTypes.DataFlag,
      },
      headers: masterApiHeaders(),
    },
  );

  return extractCauseHeadOptions(response.data);
};

const loadPurposeOptionsData = async (purposeId: string) => {
  const currencyResponse = await axiosInstance.get(
    masterApiPaths.getCurrencyByCountry,
    {
      params: {
        countryCode: 22,
        DataFlag: ContentTypes.DataFlag,
      },
      headers: masterApiHeaders(),
    },
  );

  const currencyId = extractCurrencyId(currencyResponse.data);

  if (!currencyId) {
    return {
      currencyId: '',
      purposeOptions: [],
    };
  }

  const response = await axiosInstance.get(
    masterApiPaths.getYojnaByPurposeAndCurrency,
    {
      params: {
        DataFlag: ContentTypes.DataFlag,
        CurrencyId: currencyId,
        PurposeId: purposeId,
      },
      headers: masterApiHeaders(),
    },
  );

  return {
    currencyId,
    purposeOptions: extractYojnaOptions(response.data),
  };
};

const loadOperationAmountValue = async ({
  currencyId,
  quantity,
}: {
  currencyId: string;
  quantity: number;
}) => {
  const response = await axiosInstance.get(
    masterApiPaths.getOperationAmountByQty,
    {
      params: {
        DataFlag: ContentTypes.DataFlag,
        CurrencyId: currencyId,
        qty: quantity,
      },
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
      response = await axiosInstance.get(masterApiPaths.getSalutations, {
        params: config.params,
      });
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
    const response = await axiosInstance.get(masterApiPaths.getDepositBanks, {
      params: {
        dataflag: ContentTypes.DataFlag,
      },
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
