import React from 'react';
import { FloatingInputField } from './FloatingInputField';

interface PincodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const PincodeField = ({
  value,
  onChange,
  disabled = false,
  error,
}: PincodeFieldProps) => (
  <FloatingInputField
    id="pincode"
    label="Pincode"
    value={value}
    onChange={onChange}
    disabled={disabled}
    error={error}
  />
);
