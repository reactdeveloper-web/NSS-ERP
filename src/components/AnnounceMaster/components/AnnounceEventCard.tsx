import React from 'react';
import { Select } from 'antd';
import {
  AnnounceEventForm,
  AnnounceValidationErrors,
  EventOption,
} from '../types';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingTimePicker } from 'src/components/Common/FloatingTimePicker';

interface AnnounceEventCardProps {
  form: AnnounceEventForm;
  eventOptions: EventOption[];
  eventCauseOptions: EventOption[];
  eventCityOptions: EventOption[];
  eventChannelOptions: EventOption[];
  panditOptions: EventOption[];
  eventLoading: boolean;
  eventError: string;
  isViewMode?: boolean;
  errors: AnnounceValidationErrors;
  onChange: <K extends keyof AnnounceEventForm>(
    field: K,
    value: AnnounceEventForm[K],
  ) => void;
}

export const AnnounceEventCard = ({
  form,
  eventOptions,
  eventCauseOptions,
  eventCityOptions,
  eventChannelOptions,
  panditOptions,
  eventLoading,
  eventError,
  isViewMode = false,
  errors,
  onChange,
}: AnnounceEventCardProps) => {
  const renderFloatingSelect = (
    id: keyof Pick<
      AnnounceEventForm,
      'eventName' | 'eventCause' | 'eventCity' | 'eventChannel' | 'panditJi'
    >,
    label: string,
    value: string,
    options: EventOption[],
    disabled = false,
  ) => (
    <div>
      <div
        className={`form-floating ant-select-floating ${
          value ? 'has-value' : ''
        } ${disabled ? 'is-disabled' : ''}`}
      >
        <Select
          id={id}
          placeholder=""
          showSearch
          allowClear={!disabled}
          disabled={disabled}
          value={value || undefined}
          onChange={nextValue => onChange(id, (nextValue as string) || '')}
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
    </div>
  );

  return (
    <>
      <div className="announce-master-panel">
        <div className="announce-master-helper-text">
          Announcement details: please fill in the announcement details.
        </div>
        <div className="row g-5">
          <div className="col-md-2">
            <div
              className="btn-group w-100"
              role="group"
              aria-label="Live NonLive"
            >
              <input
                type="radio"
                className="btn-check"
                name="liveType"
                id="btnLive"
                autoComplete="off"
                checked={form.liveType === 'live'}
                disabled={isViewMode}
                onChange={() => onChange('liveType', 'live')}
              />
              <label
                className={`btn btn-sm ${
                  form.liveType === 'live'
                    ? 'btn-light-primary active'
                    : 'btn-light'
                }`}
                htmlFor="btnLive"
              >
                Live
              </label>

              <input
                type="radio"
                className="btn-check"
                name="liveType"
                id="btnNonLive"
                autoComplete="off"
                checked={form.liveType === 'nonLive'}
                disabled={isViewMode}
                onChange={() => onChange('liveType', 'nonLive')}
              />
              <label
                className={`btn btn-sm ${
                  form.liveType === 'nonLive'
                    ? 'btn-light-primary active'
                    : 'btn-light'
                }`}
                htmlFor="btnNonLive"
              >
                NonLive
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row g-3">
              <div className="col-md-6">
                {renderFloatingSelect(
                  'eventName',
                  'Event Name',
                  form.eventName,
                  eventOptions,
                  eventLoading || isViewMode,
                )}
                {errors.eventName ? (
                  <div className="announce-master-field-error">
                    {errors.eventName}
                  </div>
                ) : null}
                {eventError ? (
                  <div className="text-danger fs-8 mt-1">{eventError}</div>
                ) : null}
              </div>

              <div className="col-md-6">
                {renderFloatingSelect(
                  'eventCause',
                  'Event Cause',
                  form.eventCause,
                  eventCauseOptions,
                  isViewMode,
                )}
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <FloatingDatePicker
              id="eventFromDate"
              label="From Date"
              value={form.eventFromDate}
              disabled
              readOnly
              onChange={value => onChange('eventFromDate', value)}
            />
          </div>
          <div className="col-md-2">
            <FloatingDatePicker
              id="eventToDate"
              label="To Date"
              value={form.eventToDate}
              disabled
              readOnly
              onChange={value => onChange('eventToDate', value)}
            />
          </div>

          <div className="col-md-4">
            <div className="row g-3">
              <div className="col-6">
                <FloatingTimePicker
                  id="eventFromTime"
                  label="From Time"
                  value={form.eventFromTime}
                  disabled
                  readOnly
                  onChange={value => onChange('eventFromTime', value)}
                />
              </div>
              <div className="col-6">
                <FloatingTimePicker
                  id="eventToTime"
                  label="To Time"
                  value={form.eventToTime}
                  disabled
                  readOnly
                  onChange={value => onChange('eventToTime', value)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-2">
            {renderFloatingSelect(
              'eventCity',
              'Event City',
              form.eventCity,
              eventCityOptions,
              true,
            )}
          </div>

          <div className="col-md-3">
            {renderFloatingSelect(
              'eventChannel',
              'Channel',
              form.eventChannel,
              eventChannelOptions,
              true,
            )}
          </div>

          <div className="col-md-3">
            {renderFloatingSelect(
              'panditJi',
              'Pandit Ji',
              form.panditJi,
              panditOptions,
              true,
            )}
          </div>

          <div className="col-md-8">
            <div className="form-floating ant-input-floating">
              <input
                id="eventLocation"
                type="text"
                className="form-control form-control-solid ant-input-floating-control"
                placeholder=" "
                value={form.eventLocation}
                disabled
                readOnly
              />
              <label htmlFor="eventLocation">Location / Venue (Display)</label>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className={`form-floating ant-select-floating has-value is-disabled`}
            >
              <Select
                id="eventCurrency"
                value={form.currency || undefined}
                disabled
                options={[{ value: 'INR', label: 'INR' }]}
              />
              <label htmlFor="eventCurrency">Currency</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
