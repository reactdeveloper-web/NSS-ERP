import React, { useCallback, useEffect, useRef } from 'react';

type FlatpickrInstance = {
  altInput?: HTMLInputElement;
  destroy?: () => void;
  open?: () => void;
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
        altFormat?: string;
        altInput?: boolean;
        clickOpens?: boolean;
        dateFormat?: string;
        defaultDate?: string;
        disableMobile?: boolean;
        enableTime?: boolean;
        noCalendar?: boolean;
        position?: string;
        time_24hr?: boolean;
        onChange?: (
          selectedDates: Date[],
          dateStr: string,
          instance: { input: HTMLInputElement },
        ) => void;
      },
    ) => FlatpickrInstance;
  }
}

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
}

export const FloatingTimePicker = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  placeholder = 'Select Time',
  className = 'form-control ant-input-floating-control',
  wrapperClassName = 'form-floating ant-input-floating',
}: FloatingTimePickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<FlatpickrInstance | null>(null);
  const hasFlatpickr =
    typeof window !== 'undefined' && typeof window.flatpickr === 'function';

  const handleOpenPicker = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }

    pickerRef.current?.open?.();

    if (pickerRef.current?.open) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  }, [disabled, readOnly]);

  useEffect(() => {
    const input = inputRef.current;
    const canInitPicker = !disabled && !readOnly && hasFlatpickr;

    if (!input || !canInitPicker) {
      return;
    }

    pickerRef.current =
      window.flatpickr?.(input, {
        allowInput: false,
        altFormat: 'h:i K',
        altInput: true,
        clickOpens: true,
        dateFormat: 'H:i',
        defaultDate: value || undefined,
        disableMobile: true,
        enableTime: true,
        noCalendar: true,
        position: 'auto left',
        time_24hr: false,
        onChange: (_selectedDates, dateStr) => {
          onChange?.(dateStr);
        },
      }) ?? null;

    return () => {
      pickerRef.current?.destroy?.();
      pickerRef.current = null;
    };
  }, [disabled, hasFlatpickr, onChange, readOnly, value]);

  useEffect(() => {
    const altInput = pickerRef.current?.altInput;

    if (!altInput) {
      return;
    }

    altInput.placeholder = placeholder;
    altInput.disabled = disabled;
    altInput.readOnly = true;
    altInput.className = className;
    altInput.addEventListener('click', handleOpenPicker);
    altInput.addEventListener('focus', handleOpenPicker);

    return () => {
      altInput.removeEventListener('click', handleOpenPicker);
      altInput.removeEventListener('focus', handleOpenPicker);
    };
  }, [className, disabled, handleOpenPicker, placeholder]);

  useEffect(() => {
    const picker = pickerRef.current;

    if (!picker) {
      return;
    }

    if (value) {
      picker.setDate?.(value, false, 'H:i');
      return;
    }

    picker.clear?.(false);
  }, [value]);

  return (
    <div className={`${wrapperClassName} floating-date-picker`}>
      <input
        ref={inputRef}
        id={id}
        type={hasFlatpickr ? 'text' : 'time'}
        className={className}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onClick={hasFlatpickr ? undefined : handleOpenPicker}
        onFocus={hasFlatpickr ? undefined : handleOpenPicker}
        onChange={event => onChange?.(event.target.value)}
      />
      <button
        type="button"
        className="floating-date-picker-icon"
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
  );
};
