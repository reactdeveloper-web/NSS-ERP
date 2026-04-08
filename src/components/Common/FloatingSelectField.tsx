import React from 'react';
import { Select } from 'antd';

export interface FloatingSelectOption {
  value: string;
  label: string;
}

interface FloatingSelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: FloatingSelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const FloatingSelectField = ({
  id,
  label,
  value,
  options,
  disabled = false,
  onChange,
}: FloatingSelectFieldProps) => (
  <div
    className={`form-floating ant-select-floating ${value ? 'has-value' : ''} ${
      disabled ? 'is-disabled' : ''
    }`}
  >
    <Select
      id={id}
      placeholder=""
      showSearch
      allowClear={!disabled}
      disabled={disabled}
      value={value || undefined}
      onChange={nextValue => onChange((nextValue as string) || '')}
      optionFilterProp="label"
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      options={options.map(option => ({
        value: option.value,
        label: option.label,
      }))}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);
