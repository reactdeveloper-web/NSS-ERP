import React from 'react';
import { purposeOptions } from '../data';
import { AnnounceDetailsForm } from '../types';

interface AnnounceDetailsTabProps {
  form: AnnounceDetailsForm;
  amount: number;
  onChange: <K extends keyof AnnounceDetailsForm>(
    field: K,
    value: AnnounceDetailsForm[K],
  ) => void;
  onQuantityChange: (nextQuantity: number) => void;
}

export const AnnounceDetailsTab = ({
  form,
  amount,
  onChange,
  onQuantityChange,
}: AnnounceDetailsTabProps) => {
  return (
    <div>
      <div className="text-muted fs-7 mb-4">
        In Memory dropdown + Purpose fixed amount
      </div>

      <div className="row g-5">
        <div className="col-md-3">
          <label className="form-label fw-semibold">
            In Memory / Occasion Type <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={form.occasionType}
            onChange={(event) => onChange('occasionType', event.target.value)}
          >
            <option value="">Select</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="punyatithi">Punya Tithi</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">
            Occasion Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            value={form.occasionDate}
            onChange={(event) => onChange('occasionDate', event.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-semibold">
            Remark <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Remark / Name / Note"
            value={form.occasionRemark}
            onChange={(event) => onChange('occasionRemark', event.target.value)}
          />
        </div>
      </div>

      <div className="separator separator-dashed my-6"></div>

      <div className="row g-5">
        <div className="col-md-3">
          <label className="form-label fw-semibold">
            Cause Head <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={form.causeHead}
            onChange={(event) => onChange('causeHead', event.target.value)}
          >
            <option value="">Select</option>
            <option value="limb">Artificial Limb</option>
            <option value="surgery">Corrective Surgery</option>
            <option value="education">Education</option>
            <option value="food">Food / Seva</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-semibold">
            Purpose <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={form.purpose}
            onChange={(event) => onChange('purpose', event.target.value)}
          >
            {purposeOptions.map((option) => (
              <option key={option.value || 'empty'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="text-muted fs-8 mt-2">
            Purpose amount fixed - amount auto calculate
          </div>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">Quantity</label>
          <div className="input-group">
            <button
              className="btn btn-light"
              type="button"
              onClick={() => onQuantityChange(form.quantity - 1)}
            >
              -
            </button>
            <input
              type="text"
              className="form-control text-center"
              value={form.quantity}
              inputMode="numeric"
              onChange={(event) =>
                onQuantityChange(Number(event.target.value) || 1)
              }
            />
            <button
              className="btn btn-light"
              type="button"
              onClick={() => onQuantityChange(form.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">
            Amount (Auto) <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control form-control-solid"
            value={amount ? amount.toLocaleString('en-IN') : ''}
            readOnly
          />
          <div className="text-muted fs-8 mt-2">Auto = fixed rate x quantity</div>
        </div>
      </div>

      <div className="row g-5 mt-1">
        <div className="col-md-2">
          <label className="form-label fw-semibold">Payment Mode</label>
          <select
            className="form-select"
            value={form.paymentMode}
            onChange={(event) => onChange('paymentMode', event.target.value)}
          >
            <option value="">Select</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="NetBanking">NetBanking</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">How To Donate</label>
          <select
            className="form-select"
            value={form.howToDonate}
            onChange={(event) => onChange('howToDonate', event.target.value)}
          >
            <option value="">Select</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI Link">UPI Link</option>
            <option value="Payment Gateway">Payment Gateway</option>
            <option value="Donation Box">Donation Box</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">Expected Donation Date</label>
          <input
            type="date"
            className="form-control"
            value={form.expectedDate}
            onChange={(event) => onChange('expectedDate', event.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold">Expected Donation Time</label>
          <input
            type="time"
            className="form-control"
            value={form.expectedTime}
            onChange={(event) => onChange('expectedTime', event.target.value)}
          />
        </div>

        <div className="col-md-1">
          <label className="form-check form-check-custom form-check-solid pt-10">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.isMotivated}
              onChange={(event) => onChange('isMotivated', event.target.checked)}
            />
            <span className="form-check-label fw-semibold">Motivated</span>
          </label>
        </div>

        {form.isMotivated ? (
          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Motivated Amount <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter motivated amount"
              value={form.motivatedAmount}
              onChange={(event) =>
                onChange('motivatedAmount', event.target.value)
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
