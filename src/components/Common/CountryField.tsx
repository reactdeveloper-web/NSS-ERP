import React from 'react';
import {
  FloatingSelectField,
  FloatingSelectOption,
} from './FloatingSelectField';

interface CountryFieldProps {
  value: string;
  onChange: (value: string) => void;
  options?: FloatingSelectOption[];
  disabled?: boolean;
  error?: string;
}

const defaultCountryOptions: FloatingSelectOption[] = [
  { value: 'India', label: 'India' },
];

export const CountryField = ({
  value,
  onChange,
  options = defaultCountryOptions,
  disabled = true,
  error,
}: CountryFieldProps) => (
  <FloatingSelectField
    id="country"
    label="Country"
    value={value}
    options={options}
    disabled={disabled}
    onChange={onChange}
    error={error}
  />
);
