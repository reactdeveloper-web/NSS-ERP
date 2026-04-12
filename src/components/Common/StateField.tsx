import React from 'react';
import {
  FloatingSelectField,
  FloatingSelectOption,
} from './FloatingSelectField';

interface StateFieldProps {
  value: string;
  options: FloatingSelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
  error?: string;
}

export const StateField = ({
  value,
  options,
  disabled = false,
  onChange,
  error,
}: StateFieldProps) => (
  <FloatingSelectField
    id="state"
    label="State"
    value={value}
    options={options}
    disabled={disabled}
    onChange={onChange}
    error={error}
  />
);
