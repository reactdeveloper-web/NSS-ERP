import React, { useEffect, useMemo, useState } from 'react';

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

interface TimeParts {
  hour12: string;
  minute: string;
  meridiem: 'AM' | 'PM';
}

const hourOptions = Array.from({ length: 12 }, (_, index) => {
  const hour = String(index + 1).padStart(2, '0');

  return { value: hour, label: hour };
});

const minuteOptions = Array.from({ length: 60 }, (_, index) => {
  const minute = String(index).padStart(2, '0');

  return { value: minute, label: minute };
});

const meridiemOptions: Array<TimeParts['meridiem']> = ['AM', 'PM'];

const parseTimeValue = (value: string): TimeParts => {
  const normalizedValue = value.trim();
  const timeMatch = normalizedValue.match(/^(\d{1,2}):(\d{2})$/);

  if (!timeMatch) {
    return {
      hour12: '12',
      minute: '00',
      meridiem: 'AM',
    };
  }

  const parsedHour = Number(timeMatch[1]);
  const parsedMinute = timeMatch[2];
  const isPm = parsedHour >= 12;
  const normalizedHour = parsedHour % 12 || 12;

  return {
    hour12: String(normalizedHour).padStart(2, '0'),
    minute: parsedMinute,
    meridiem: isPm ? 'PM' : 'AM',
  };
};

const formatTimeValue = ({ hour12, minute, meridiem }: TimeParts) => {
  const parsedHour = Number(hour12 || '12');
  const normalized12Hour = parsedHour === 12 ? 12 : parsedHour % 12;
  const hour24 =
    meridiem === 'PM'
      ? normalized12Hour === 12
        ? 12
        : normalized12Hour + 12
      : normalized12Hour === 12
      ? 0
      : normalized12Hour;

  return `${String(hour24).padStart(2, '0')}:${minute || '00'}`;
};

export const FloatingTimePicker = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className = 'form-select form-select-solid ant-input-floating-control',
  wrapperClassName = 'form-floating ant-input-floating',
}: FloatingTimePickerProps) => {
  const [timeParts, setTimeParts] = useState<TimeParts>(() => parseTimeValue(value));

  useEffect(() => {
    setTimeParts(parseTimeValue(value));
  }, [value]);

  const isLocked = disabled || readOnly;
  const hasValue = useMemo(() => Boolean(value.trim()), [value]);

  const handlePartChange = <K extends keyof TimeParts>(
    key: K,
    nextValue: TimeParts[K],
  ) => {
    const nextParts = {
      ...timeParts,
      [key]: nextValue,
    };

    setTimeParts(nextParts);
    onChange?.(formatTimeValue(nextParts));
  };

  return (
    <div className={`${wrapperClassName} floating-time-picker`}>
      <div
        id={id}
        className={`d-flex gap-2 align-items-center ${
          hasValue ? 'is-filled' : ''
        }`}
      >
        <select
          className={className}
          value={timeParts.hour12}
          disabled={isLocked}
          onChange={event =>
            handlePartChange('hour12', event.target.value as TimeParts['hour12'])
          }
        >
          {hourOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="fw-semibold text-muted">:</span>

        <select
          className={className}
          value={timeParts.minute}
          disabled={isLocked}
          onChange={event =>
            handlePartChange('minute', event.target.value as TimeParts['minute'])
          }
        >
          {minuteOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={className}
          value={timeParts.meridiem}
          disabled={isLocked}
          onChange={event =>
            handlePartChange(
              'meridiem',
              event.target.value as TimeParts['meridiem'],
            )
          }
        >
          {meridiemOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
