import React from 'react';
import { Select } from 'antd';
import { AnnounceEventForm, EventOption } from '../types';

interface AnnounceEventCardProps {
  form: AnnounceEventForm;
  eventOptions: EventOption[];
  eventCauseOptions: EventOption[];
  eventCityOptions: EventOption[];
  eventChannelOptions: EventOption[];
  panditOptions: EventOption[];
  eventLoading: boolean;
  eventError: string;
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
  );

  return (
    <div className="card card-flush h-xl-100">
      <div className="card-header border-bottom mb-4">
        <div className="card-title d-flex w-100 justify-content-between">
          <h3 className="fw-bold mb-1">Announce Event</h3>
        </div>
      </div>

      <div className="card-body pt-2">
        <div className="row g-5">
          <div className="col-md-2">
            {/* <label className="form-label fw-semibold">Live / NonLive</label> */}
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
            {/* <label className="form-label fw-semibold">Event Date Range</label> */}
            <div className="row g-3">
              <div className="col-md-6">
                {renderFloatingSelect(
                  'eventName',
                  'Event Name',
                  form.eventName,
                  eventOptions,
                  eventLoading,
                )}
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
                )}
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="form-floating ant-input-floating">
              <input
                id="eventFromDate"
                type="date"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.eventFromDate}
                onChange={event =>
                  onChange('eventFromDate', event.target.value)
                }
              />
              <label htmlFor="eventFromDate">From Date</label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-floating ant-input-floating">
              <input
                id="eventToDate"
                type="date"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.eventToDate}
                onChange={event => onChange('eventToDate', event.target.value)}
              />
              <label htmlFor="eventToDate">To Date</label>
            </div>
          </div>

          <div className="col-md-4">
            {/* <label className="form-label fw-semibold">Event Time Range</label> */}
            <div className="row g-3">
              <div className="col-6">
                <div className="form-floating ant-input-floating">
                  <input
                    id="eventFromTime"
                    type="time"
                    className="form-control ant-input-floating-control"
                    placeholder=" "
                    value={form.eventFromTime}
                    onChange={event =>
                      onChange('eventFromTime', event.target.value)
                    }
                  />
                  <label htmlFor="eventFromTime">From Time</label>
                </div>
              </div>
              <div className="col-6">
                <div className="form-floating ant-input-floating">
                  <input
                    id="eventToTime"
                    type="time"
                    className="form-control ant-input-floating-control"
                    placeholder=" "
                    value={form.eventToTime}
                    onChange={event =>
                      onChange('eventToTime', event.target.value)
                    }
                  />
                  <label htmlFor="eventToTime">To Time</label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            {renderFloatingSelect(
              'eventCity',
              'Event City',
              form.eventCity,
              eventCityOptions,
            )}
          </div>

          <div className="col-md-3">
            {renderFloatingSelect(
              'eventChannel',
              'Channel',
              form.eventChannel,
              eventChannelOptions,
            )}
          </div>

          <div className="col-md-3">
            {renderFloatingSelect(
              'panditJi',
              'Pandit Ji',
              form.panditJi,
              panditOptions,
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
    </div>
  );
};
