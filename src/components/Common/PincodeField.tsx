import React from 'react';
import { FloatingInputField } from './FloatingInputField';

interface PincodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PincodeField = ({ value, onChange, error }: PincodeFieldProps) => (
  <FloatingInputField
    id="pincode"
    label="Pincode"
    value={value}
    onChange={onChange}
    error={error}
  />
);
