import React from 'react';
import { PersonalInfoForm } from '../types';

interface PersonalInfoTabProps {
  form: PersonalInfoForm;
  onChange: <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => void;
}

export const PersonalInfoTab = ({ form, onChange }: PersonalInfoTabProps) => {
  return (
    <div>
      <div className="text-muted fs-7 mb-4">
        Donor ID empty: please fill personal details.
      </div>

      <div className="row g-5">
        <div className="col-md-2">
          <label className="form-label fw-semibold">
            Mobile No. <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter mobile number"
            value={form.mobileNo}
            onChange={(event) => onChange('mobileNo', event.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">WhatsApp No.</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Optional"
            value={form.whatsappNo}
            onChange={(event) => onChange('whatsappNo', event.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-semibold">
            Announcer Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Donor name / New name"
            value={form.announcerName}
            onChange={(event) => onChange('announcerName', event.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-check form-check-custom form-check-solid pt-10">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.announceInOtherName}
              onChange={(event) =>
                onChange('announceInOtherName', event.target.checked)
              }
            />
            <span className="form-check-label fw-semibold">
              Announce in someone else&apos;s name
            </span>
          </label>
        </div>

        {form.announceInOtherName ? (
          <div className="col-md-4">
            <div className="row g-5">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Announcer In The Name Of <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name to announce"
                  value={form.announcedForName}
                  onChange={(event) =>
                    onChange('announcedForName', event.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  e.g., Father / Mother / Friend
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Relation"
                  value={form.relationName}
                  onChange={(event) => onChange('relationName', event.target.value)}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="col-md-2">
          <label className="form-label fw-semibold">Pincode</label>
          <input
            type="text"
            className="form-control"
            value={form.pincode}
            onChange={(event) => onChange('pincode', event.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">Country</label>
          <select className="form-select" value={form.country} disabled>
            <option value="India">India</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">State</label>
          <select
            className="form-select"
            value={form.state}
            onChange={(event) => onChange('state', event.target.value)}
          >
            <option value="">Select</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Delhi">Delhi</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">District</label>
          <input
            type="text"
            className="form-control"
            value={form.district}
            onChange={(event) => onChange('district', event.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
