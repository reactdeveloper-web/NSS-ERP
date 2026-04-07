import React from 'react';

interface PincodeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const PincodeField = ({ value, onChange }: PincodeFieldProps) => (
  <div className="form-floating ant-input-floating">
    <input
      id="pincode"
      type="text"
      className="form-control ant-input-floating-control"
      placeholder=" "
      value={value}
      onChange={event => onChange(event.target.value)}
    />
    <label htmlFor="pincode">Pincode</label>
  </div>
);
