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
        clickOpens?: boolean;
        dateFormat?: string;
        defaultDate?: string;
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
  placeholder = ' ',
  className = 'form-control ant-input-floating-control',
  wrapperClassName = 'form-floating ant-input-floating',
}: FloatingTimePickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<FlatpickrInstance | null>(null);

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
        dateFormat: 'H:i',
        defaultDate: value || undefined,
        enableTime: true,
        noCalendar: true,
        position: 'auto left',
        time_24hr: true,
        onChange: (_selectedDates, dateStr) => {
          onChange?.(dateStr);
        },
      }) ?? null;

    return () => {
      pickerRef.current?.destroy?.();
      pickerRef.current = null;
    };
  }, [disabled, readOnly, onChange]);

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
    <div className={wrapperClassName}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onChange={event => onChange?.(event.target.value)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
