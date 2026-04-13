import React from 'react';
import { FloatingInputField } from './FloatingInputField';

interface PincodeFieldProps {
  value: string;
  onChange: (value: string) => void;
<<<<<<< HEAD
  disabled?: boolean;
  error?: string;
}

export const PincodeField = ({
  value,
  onChange,
  disabled = false,
  error,
}: PincodeFieldProps) => (
=======
  error?: string;
}

export const PincodeField = ({ value, onChange, error }: PincodeFieldProps) => (
>>>>>>> rahulsharma-dev
  <FloatingInputField
    id="pincode"
    label="Pincode"
    value={value}
    onChange={onChange}
<<<<<<< HEAD
    disabled={disabled}
=======
>>>>>>> rahulsharma-dev
    error={error}
  />
);
