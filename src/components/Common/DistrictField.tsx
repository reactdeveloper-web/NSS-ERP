import React from 'react';
import {
  FloatingSelectField,
  FloatingSelectOption,
} from './FloatingSelectField';

interface DistrictFieldProps {
  value: string;
  options: FloatingSelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
  error?: string;
}

export const DistrictField = ({
  value,
  options,
  disabled = false,
  onChange,
  error,
}: DistrictFieldProps) => (
  <FloatingSelectField
    id="district"
    label="District"
    value={value}
    options={options}
    disabled={disabled}
    onChange={onChange}
    error={error}
  />
);
