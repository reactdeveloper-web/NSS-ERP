import React from 'react';
import { AnnounceEventForm } from '../types';

interface AnnounceEventCardProps {
  form: AnnounceEventForm;
  onChange: <K extends keyof AnnounceEventForm>(
    field: K,
    value: AnnounceEventForm[K],
  ) => void;
}

export const AnnounceEventCard = ({
  form,
  onChange,
}: AnnounceEventCardProps) => {
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
                <div className="form-floating">
                  <select
                    id="eventName"
                    className="form-select"
                    value={form.eventName}
                    onChange={event =>
                      onChange('eventName', event.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="apno">Apno Se Apni Baat, D-live</option>
                    <option value="donormeet">Monthly Donor Meet</option>
                    <option value="csr">CSR Announcement</option>
                  </select>
                  <label htmlFor="eventName">Event Name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    id="eventCause"
                    className="form-select"
                    value={form.eventCause}
                    onChange={event =>
                      onChange('eventCause', event.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Rehabilitation">Rehabilitation</option>
                    <option value="Artificial Limb Camp">
                      Artificial Limb Camp
                    </option>
                    <option value="Hospital Support">Hospital Support</option>
                    <option value="General Donation">General Donation</option>
                  </select>
                  <label htmlFor="eventCause">Event Cause</label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="form-floating">
              <input
                id="eventFromDate"
                type="date"
                className="form-control"
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
            <div className="form-floating">
              <input
                id="eventToDate"
                type="date"
                className="form-control"
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
                <div className="form-floating">
                  <input
                    id="eventFromTime"
                    type="time"
                    className="form-control"
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
                <div className="form-floating">
                  <input
                    id="eventToTime"
                    type="time"
                    className="form-control"
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
            <div className="form-floating">
              <select
                id="eventCity"
                className="form-select"
                value={form.eventCity}
                onChange={event => onChange('eventCity', event.target.value)}
              >
                <option value="">Select</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Delhi">Delhi</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
              <label htmlFor="eventCity">Event City</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-floating">
              <select
                id="eventChannel"
                className="form-select"
                value={form.eventChannel}
                onChange={event => onChange('eventChannel', event.target.value)}
              >
                <option value="">Select</option>
                <option value="Aastha">Aastha</option>
                <option value="Sanskar">Sanskar</option>
                <option value="YouTube">YouTube</option>
                <option value="Facebook Live">Facebook Live</option>
              </select>
              <label htmlFor="eventChannel">Channel</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-floating">
              <select
                id="panditJi"
                className="form-select"
                value={form.panditJi}
                onChange={event => onChange('panditJi', event.target.value)}
              >
                <option value="">Select</option>
                <option value="Pujya Prashant Agarwal Ji">
                  Pujya Prashant Agarwal Ji
                </option>
                <option value="Pujya ___ Ji">Pujya ___ Ji</option>
              </select>
              <label htmlFor="panditJi">Pandit Ji</label>
            </div>
          </div>

          <div className="col-md-8">
            <div className="form-floating">
              <input
                id="eventLocation"
                type="text"
                className="form-control form-control-solid"
                placeholder=" "
                value={form.eventLocation}
                readOnly
              />
              <label htmlFor="eventLocation">Location / Venue (Display)</label>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-floating">
              <select
                id="eventCurrency"
                className="form-select form-select-solid"
                value={form.currency}
                disabled
              >
                <option value="INR">INR</option>
              </select>
              <label htmlFor="eventCurrency">Currency</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
