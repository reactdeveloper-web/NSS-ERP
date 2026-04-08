import React from 'react';
import { FloatingSelectField, FloatingSelectOption } from './FloatingSelectField';

interface DistrictFieldProps {
  value: string;
  options: FloatingSelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const DistrictField = ({
  value,
  options,
  disabled = false,
  onChange,
}: DistrictFieldProps) => (
  <FloatingSelectField
    id="district"
    label="District"
    value={value}
    options={options}
    disabled={disabled}
    onChange={onChange}
  />
);
