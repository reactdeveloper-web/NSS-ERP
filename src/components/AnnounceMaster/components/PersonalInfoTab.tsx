import React from 'react';
import { PersonalInfoForm, SalutationOption } from '../types';

interface PersonalInfoTabProps {
  form: PersonalInfoForm;
  salutations: SalutationOption[];
  onChange: <K extends keyof PersonalInfoForm>(
    field: K,
    value: PersonalInfoForm[K],
  ) => void;
}

export const PersonalInfoTab = ({
  form,
  salutations,
  onChange,
}: PersonalInfoTabProps) => {
  const salutationOptions =
    form.salutation &&
    !salutations.some(salutation => salutation.value === form.salutation)
      ? [{ value: form.salutation, label: form.salutation }, ...salutations]
      : salutations;

  return (
    <div>
      <div className="text-muted fs-7 mb-4">
        Donor ID empty: please fill personal details.
      </div>

      <div className="row g-5">
        <div className="col-md-2">
          <div className="form-floating">
            <input
              id="mobileNo"
              type="tel"
              className="form-control"
              placeholder=" "
              value={form.mobileNo}
              onChange={event => onChange('mobileNo', event.target.value)}
            />
            <label htmlFor="mobileNo">
              Mobile No. <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <input
              id="whatsappNo"
              type="tel"
              className="form-control"
              placeholder=" "
              value={form.whatsappNo}
              onChange={event => onChange('whatsappNo', event.target.value)}
            />
            <label htmlFor="whatsappNo">WhatsApp No.</label>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-floating">
            <select
              id="salutation"
              className="form-select"
              value={form.salutation}
              disabled={form.salutationLocked}
              onChange={event => onChange('salutation', event.target.value)}
            >
              <option value="">Select</option>
              {salutationOptions.map(salutation => (
                <option key={salutation.value} value={salutation.value}>
                  {salutation.label}
                </option>
              ))}
            </select>
            <label htmlFor="salutation">Salutation</label>
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-floating">
            <input
              id="announcerName"
              type="text"
              className="form-control"
              placeholder=" "
              value={form.announcerName}
              onChange={event => onChange('announcerName', event.target.value)}
            />
            <label htmlFor="announcerName">
              Announcer Name <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-3">
          <label className="form-check form-check-custom form-check-solid pt-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.announceInOtherName}
              onChange={event =>
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
                <div className="form-floating">
                  <input
                    id="announcedForName"
                    type="text"
                    className="form-control"
                    placeholder=" "
                    value={form.announcedForName}
                    onChange={event =>
                      onChange('announcedForName', event.target.value)
                    }
                  />
                  <label htmlFor="announcedForName">
                    Announcer In The Name Of{' '}
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    id="relationName"
                    type="text"
                    className="form-control"
                    placeholder=" "
                    value={form.relationName}
                    onChange={event =>
                      onChange('relationName', event.target.value)
                    }
                  />
                  <label htmlFor="relationName">Relation</label>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="col-md-2">
          <div className="form-floating">
            <input
              id="pincode"
              type="text"
              className="form-control"
              placeholder=" "
              value={form.pincode}
              onChange={event => onChange('pincode', event.target.value)}
            />
            <label htmlFor="pincode">Pincode</label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <select
              id="country"
              className="form-select"
              value={form.country}
              disabled
            >
              <option value="India">India</option>
            </select>
            <label htmlFor="country">Country</label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <select
              id="state"
              className="form-select"
              value={form.state}
              disabled={form.stateLocked}
              onChange={event => onChange('state', event.target.value)}
            >
              <option value="">Select</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
            </select>
            <label htmlFor="state">State</label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <input
              id="district"
              type="text"
              className="form-control"
              placeholder=" "
              value={form.district}
              onChange={event => onChange('district', event.target.value)}
            />
            <label htmlFor="district">District</label>
          </div>
        </div>
      </div>
    </div>
  );
};
