import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from 'src/redux/interceptor';
import {
  FloatingSelectField,
  FloatingSelectOption,
} from './FloatingSelectField';
import {
  extractArrayPayload,
  getFirstValue,
} from '../AnnounceMaster/AnnounceMasterContent.helpers';

interface CountryFieldProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: React.ReactNode;
  options?: FloatingSelectOption[];
  apiDataFlag?: string;
  includeEmptyOption?: boolean;
  disabled?: boolean;
  error?: string;
}

const defaultCountryOptions: FloatingSelectOption[] = [
  { value: 'India', label: 'India' },
];

export const CountryField = ({
  value,
  onChange,
  id = 'country',
  label = 'Country',
  options = defaultCountryOptions,
  apiDataFlag,
  includeEmptyOption = false,
  disabled = true,
  error,
}: CountryFieldProps) => {
  const [apiOptions, setApiOptions] = useState<FloatingSelectOption[]>([]);

  useEffect(() => {
    if (!apiDataFlag) {
      return;
    }

    let active = true;

    const loadCountries = async () => {
      try {
        const response = await axiosInstance.get('/master/GetCountryAll', {
          params: { dataFlag: apiDataFlag },
        });
        const nextOptions = extractArrayPayload(response.data)
          .map(record => {
            const countryName = getFirstValue(record, [
              'country_name',
              'Country_Name',
              'CountryName',
              'countryName',
              'country',
              'Country',
              'name',
              'Name',
            ]);

            return {
              value: countryName,
              label: countryName,
            };
          })
          .filter(
            (option, index, currentOptions) =>
              option.value &&
              currentOptions.findIndex(item => item.value === option.value) ===
                index,
          );

        if (active) {
          setApiOptions(nextOptions);
        }
      } catch {
        if (active) {
          setApiOptions([]);
        }
      }
    };

    void loadCountries();

    return () => {
      active = false;
    };
  }, [apiDataFlag]);

  const resolvedOptions = useMemo(() => {
    const baseOptions = apiDataFlag && apiOptions.length ? apiOptions : options;

    if (!includeEmptyOption) {
      return baseOptions;
    }

    return [{ value: '', label: 'Select' }, ...baseOptions];
  }, [apiDataFlag, apiOptions, includeEmptyOption, options]);

  return (
    <FloatingSelectField
      id={id}
      label={label}
      value={value}
      options={resolvedOptions}
      disabled={disabled}
      onChange={onChange}
      error={error}
    />
  );
};
