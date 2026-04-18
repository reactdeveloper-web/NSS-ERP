import React from 'react';

interface FloatingTextareaFieldProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  minHeight?: string;
  error?: string;
}

export const FloatingTextareaField = ({
  id,
  label,
  value,
  onChange,
  placeholder = ' ',
  disabled = false,
  readOnly = false,
  className = 'form-control ant-input-floating-control',
  minHeight = '120px',
  error,
}: FloatingTextareaFieldProps) => (
  <div>
    <div
      className={`form-floating ant-input-floating ${
        error ? 'has-error' : ''
      }`}
    >
      <textarea
        id={id}
        className={className}
        placeholder={placeholder}
        style={{ minHeight }}
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
