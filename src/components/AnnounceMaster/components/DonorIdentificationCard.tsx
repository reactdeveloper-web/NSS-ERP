import React from 'react';
import { DonorIdentificationForm } from '../types';

interface DonorIdentificationCardProps {
  form: DonorIdentificationForm;
  onChange: <K extends keyof DonorIdentificationForm>(
    field: K,
    value: DonorIdentificationForm[K],
  ) => void;
}

export const DonorIdentificationCard = ({
  form,
  onChange,
}: DonorIdentificationCardProps) => {
  return (
    <div className="card card-flush h-xl-100">
      <div className="card-header border-bottom mb-4">
        <div className="card-title d-flex w-100 justify-content-between">
          <h3 className="fw-bold mb-0">Donor Identification</h3>
        </div>
      </div>

      <div className="card-body pt-2">
        <input type="hidden" value="" />

        <div className="row g-5">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              className="form-control form-control-solid"
              value={form.announceDate}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Donor ID</label>
            <div className="d-flex gap-3">
              <input
                type="text"
                className="form-control"
                placeholder="Type Donor ID"
                value={form.donorId}
                onChange={(event) => onChange('donorId', event.target.value)}
              />
            </div>
          </div>

          <div className="col-md-12">
            <label className="form-label fw-semibold">Calling Sadhak</label>
            <input
              type="text"
              className="form-control form-control-solid"
              value={form.callingSadhak}
              readOnly
            />
          </div>
        </div>

        <div className="separator separator-dashed my-6"></div>

        <div className="d-flex flex-wrap gap-5">
          <label className="form-check form-check-custom form-check-solid">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.urgentFollowup}
              onChange={(event) =>
                onChange('urgentFollowup', event.target.checked)
              }
            />
            <span className="form-check-label fw-semibold">
              Urgent Follow-up Needed
            </span>
          </label>

          <label className="form-check form-check-custom form-check-solid">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.followupNotRequired}
              onChange={(event) =>
                onChange('followupNotRequired', event.target.checked)
              }
            />
            <span className="form-check-label fw-semibold">
              Follow-up Not Required
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
