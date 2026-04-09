import React, { useEffect, useRef } from 'react';

type FlatpickrInstance = {
  destroy?: () => void;
  setDate?: (
    date: string | Date | Array<string | Date>,
    triggerChange?: boolean,
    format?: string,
  ) => void;
  clear?: (triggerChange?: boolean) => void;
};

declare global {
  interface Window {
    flatpickr?: (
      element: HTMLElement,
      config?: {
        allowInput?: boolean;
        dateFormat?: string;
        defaultDate?: string;
        position?: string;
        clickOpens?: boolean;
        onChange?: (
          selectedDates: Date[],
          dateStr: string,
          instance: { input: HTMLInputElement },
        ) => void;
      },
    ) => FlatpickrInstance;
  }
}

interface FloatingDatePickerProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  error?: string;
}

export const FloatingDatePicker = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  placeholder = ' ',
  className = 'form-control ant-input-floating-control',
  wrapperClassName = 'form-floating ant-input-floating',
  error,
}: FloatingDatePickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<FlatpickrInstance | null>(null);

  const handleOpenPicker = () => {
    if (disabled || readOnly) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.click();
  };

  useEffect(() => {
    const input = inputRef.current;
    const canInitPicker = !disabled && !readOnly && !!window.flatpickr;

    if (!input || !canInitPicker) {
      return;
    }

    pickerRef.current =
      window.flatpickr?.(input, {
        allowInput: true,
        clickOpens: true,
        dateFormat: 'Y-m-d',
        defaultDate: value || undefined,
        position: 'auto left',
        onChange: (_selectedDates, dateStr) => {
          onChange?.(dateStr);
        },
      }) ?? null;

    return () => {
      pickerRef.current?.destroy?.();
      pickerRef.current = null;
    };
  }, [disabled, onChange, readOnly, value]);

  useEffect(() => {
    const picker = pickerRef.current;

    if (!picker) {
      return;
    }

    if (value) {
      picker.setDate?.(value, false, 'Y-m-d');
      return;
    }

    picker.clear?.(false);
  }, [value]);

  return (
    <div>
      <div
        className={`${wrapperClassName} floating-date-picker ${
          error ? 'has-error' : ''
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          className={className}
          data-kt-date-picker="true"
          data-kt-date-picker-input-mode="true"
          data-kt-date-picker-position-to-input="left"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onChange={event => onChange?.(event.target.value)}
        />
        <button
          type="button"
          className="floating-date-picker-icon"
          onClick={handleOpenPicker}
          aria-label={`Open ${
            typeof label === 'string' ? label : 'date'
          } picker`}
          tabIndex={-1}
        >
          <i className="fa fa-calendar-alt" aria-hidden="true" />
        </button>
        <label htmlFor={id}>{label}</label>
      </div>
      {error ? (
        <div className="announce-master-field-error">{error}</div>
      ) : null}
    </div>
  );
};
