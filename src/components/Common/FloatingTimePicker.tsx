import React, { useCallback, useEffect, useRef, useState } from 'react';

type FlatpickrInstance = {
  open?: () => void;
  destroy?: () => void;
  setDate?: (
    date: string | Date | Array<string | Date>,
    triggerChange?: boolean,
    format?: string,
  ) => void;
  clear?: (triggerChange?: boolean) => void;
};

type FlatpickrFactory = (
  element: HTMLElement,
  config?: Record<string, unknown>,
) => FlatpickrInstance;

interface FloatingTimePickerProps {
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

const getFlatpickr = (): FlatpickrFactory | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as Window & { flatpickr?: FlatpickrFactory }).flatpickr;
};

export const FloatingTimePicker = ({
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
}: FloatingTimePickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<FlatpickrInstance | null>(null);
  const [isFlatpickrReady, setIsFlatpickrReady] = useState(
    Boolean(getFlatpickr()),
  );

  const destroyPicker = useCallback(() => {
    pickerRef.current?.destroy?.();
    pickerRef.current = null;
  }, []);

  const initializePicker = useCallback(() => {
    const input = inputRef.current;
    const flatpickr = getFlatpickr();

    if (!input || disabled || readOnly) {
      return false;
    }

    if (pickerRef.current) {
      return true;
    }

    if (!flatpickr) {
      return false;
    }

    pickerRef.current = flatpickr(input, {
      allowInput: true,
      clickOpens: true,
      // dateFormat: 'h:i K',
      defaultDate: value || undefined,
      position: 'auto left',
      //time_24hr: true,
         enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
      // onChange: (_selectedDates: Date[], dateStr: string) => {
      //   onChange?.(dateStr);
      // },
    });
    setIsFlatpickrReady(true);

    return true;
  }, [disabled, onChange, readOnly, value]);

  const handleOpenPicker = () => {
    if (disabled || readOnly) {
      return;
    }

    if (initializePicker()) {
      pickerRef.current?.open?.();
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  useEffect(() => {
    if (disabled || readOnly) {
      destroyPicker();
      return;
    }

    if (initializePicker()) {
      return () => {
        destroyPicker();
      };
    }

    const timeoutId = window.setTimeout(() => {
      initializePicker();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      destroyPicker();
    };
  }, [destroyPicker, disabled, initializePicker, readOnly]);

  useEffect(() => {
    const picker = pickerRef.current;

    if (!picker) {
      setIsFlatpickrReady(Boolean(getFlatpickr()));
      return;
    }

    if (value) {
      picker.setDate?.(value, false, 'h:i K');
      return;
    }

    picker.clear?.(false);
  }, [value]);

  return (
    <div>
      <div
        className={`${wrapperClassName} floating-time-picker ${
          error ? 'has-error' : ''
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type={isFlatpickrReady ? 'text' : 'time'}
          className={className}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onClick={handleOpenPicker}
          onFocus={handleOpenPicker}
          onChange={event => onChange?.(event.target.value)}
        />
        <button
          type="button"
          className="floating-date-picker-icon floating-time-picker-icon"
          onClick={handleOpenPicker}
          aria-label={`Open ${
            typeof label === 'string' ? label : 'time'
          } picker`}
          tabIndex={-1}
        >
          <i className="fa fa-clock" aria-hidden="true" />
        </button>
        <label htmlFor={id}>{label}</label>
      </div>
      {error ? (
        <div className="announce-master-field-error">{error}</div>
      ) : null}
    </div>
  );
};
