import React from 'react';

interface FloatingInputFieldProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  error?: string;
}

export const FloatingInputField = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = ' ',
  disabled = false,
  readOnly = false,
  className = 'form-control ant-input-floating-control',
  error,
}: FloatingInputFieldProps) => (
  <div>
    <div
      className={`form-floating ant-input-floating ${error ? 'has-error' : ''}`}
    >
      <input
        id={id}
        type={type}
        className={className}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onChange={event => onChange(event.target.value)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
    {error ? <div className="announce-master-field-error">{error}</div> : null}
  </div>
);
