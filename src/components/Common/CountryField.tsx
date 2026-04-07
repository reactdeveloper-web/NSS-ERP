import React from 'react';
import { FloatingSelectField, FloatingSelectOption } from './FloatingSelectField';

interface CountryFieldProps {
  value: string;
  onChange: (value: string) => void;
  options?: FloatingSelectOption[];
  disabled?: boolean;
}

const defaultCountryOptions: FloatingSelectOption[] = [
  { value: 'India', label: 'India' },
];

export const CountryField = ({
  value,
  onChange,
  options = defaultCountryOptions,
  disabled = true,
}: CountryFieldProps) => (
  <FloatingSelectField
    id="country"
    label="Country"
    value={value}
    options={options}
    disabled={disabled}
    onChange={onChange}
  />
);
