import React, { useEffect, useRef } from 'react';

type FlatpickrInstance = {
<<<<<<< HEAD
  open?: () => void;
=======
>>>>>>> rahulsharma-dev
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
<<<<<<< HEAD
  const hasFlatpickr =
    typeof window !== 'undefined' && typeof window.flatpickr === 'function';
=======
>>>>>>> rahulsharma-dev

  const handleOpenPicker = () => {
    if (disabled || readOnly) {
      return;
    }

<<<<<<< HEAD
    pickerRef.current?.open?.();

    if (pickerRef.current?.open) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
=======
    inputRef.current?.focus();
    inputRef.current?.click();
>>>>>>> rahulsharma-dev
  };

  useEffect(() => {
    const input = inputRef.current;
<<<<<<< HEAD
    const canInitPicker = !disabled && !readOnly && hasFlatpickr;
=======
    const canInitPicker = !disabled && !readOnly && !!window.flatpickr;
>>>>>>> rahulsharma-dev

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
<<<<<<< HEAD
  }, [disabled, hasFlatpickr, onChange, readOnly, value]);
=======
  }, [disabled, onChange, readOnly, value]);
>>>>>>> rahulsharma-dev

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
<<<<<<< HEAD
          type={hasFlatpickr ? 'text' : 'date'}
=======
          type="text"
>>>>>>> rahulsharma-dev
          className={className}
          data-kt-date-picker="true"
          data-kt-date-picker-input-mode="true"
          data-kt-date-picker-position-to-input="left"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
<<<<<<< HEAD
          onClick={!hasFlatpickr ? handleOpenPicker : undefined}
          onFocus={!hasFlatpickr ? handleOpenPicker : undefined}
=======
          spellCheck={false}
>>>>>>> rahulsharma-dev
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
