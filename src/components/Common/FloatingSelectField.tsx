import React from 'react';
import { Select } from 'antd';

export interface FloatingSelectOption {
  value: string;
  label: string;
}

interface FloatingSelectFieldProps {
  id: string;
  label: React.ReactNode;
  value: string | string[];
  options: FloatingSelectOption[];
  disabled?: boolean;
  onChange: (value: string | string[]) => void;
  error?: string;
  mode?: 'multiple';
}

export const FloatingSelectField = ({
  id,
  label,
  value,
  options,
  disabled = false,
  onChange,
  error,
  mode,
}: FloatingSelectFieldProps) => (
  <div>
    <div
      className={`form-floating ant-select-floating ${
        Array.isArray(value) ? (value.length ? 'has-value' : '') : value ? 'has-value' : ''
      } ${disabled ? 'is-disabled' : ''} ${error ? 'has-error' : ''}`}
    >
      <Select
        id={id}
        mode={mode}
        placeholder=""
        showSearch
        allowClear={!disabled}
        disabled={disabled}
        value={
          Array.isArray(value)
            ? value.length
              ? value
              : undefined
            : value || undefined
        }
        onChange={nextValue =>
          onChange(
            mode === 'multiple'
              ? ((nextValue as string[]) || [])
              : ((nextValue as string) || ''),
          )
        }
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
    {error ? <div className="announce-master-field-error">{error}</div> : null}
  </div>
);
