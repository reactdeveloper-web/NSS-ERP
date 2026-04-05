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
          <div className="form-floating">
            <select
              id="occasionType"
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
            <label htmlFor="occasionType">
              In Memory / Occasion Type <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <input
              id="occasionDate"
              type="date"
              className="form-control"
              placeholder=" "
              value={form.occasionDate}
              onChange={(event) => onChange('occasionDate', event.target.value)}
            />
            <label htmlFor="occasionDate">
              Occasion Date <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-floating">
            <input
              id="occasionRemark"
              type="text"
              className="form-control"
              placeholder=" "
              value={form.occasionRemark}
              onChange={(event) => onChange('occasionRemark', event.target.value)}
            />
            <label htmlFor="occasionRemark">
              Remark <span className="text-danger">*</span>
            </label>
          </div>
        </div>
      </div>

      <div className="separator separator-dashed my-6"></div>

      <div className="row g-5">
        <div className="col-md-3">
          <div className="form-floating">
            <select
              id="causeHead"
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
            <label htmlFor="causeHead">
              Cause Head <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-floating">
            <select
              id="purpose"
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
            <label htmlFor="purpose">
              Purpose <span className="text-danger">*</span>
            </label>
          </div>
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
          <div className="form-floating">
            <input
              id="autoAmount"
              type="text"
              className="form-control form-control-solid"
              placeholder=" "
              value={amount ? amount.toLocaleString('en-IN') : ''}
              readOnly
            />
            <label htmlFor="autoAmount">
              Amount (Auto) <span className="text-danger">*</span>
            </label>
          </div>
          <div className="text-muted fs-8 mt-2">Auto = fixed rate x quantity</div>
        </div>
      </div>

      <div className="row g-5 mt-1">
        <div className="col-md-2">
          <div className="form-floating">
            <select
              id="paymentMode"
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
            <label htmlFor="paymentMode">Payment Mode</label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <select
              id="howToDonate"
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
            <label htmlFor="howToDonate">How To Donate</label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <input
              id="expectedDate"
              type="date"
              className="form-control"
              placeholder=" "
              value={form.expectedDate}
              onChange={(event) => onChange('expectedDate', event.target.value)}
            />
            <label htmlFor="expectedDate">Expected Donation Date</label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating">
            <input
              id="expectedTime"
              type="time"
              className="form-control"
              placeholder=" "
              value={form.expectedTime}
              onChange={(event) => onChange('expectedTime', event.target.value)}
            />
            <label htmlFor="expectedTime">Expected Donation Time</label>
          </div>
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
            <div className="form-floating">
              <input
                id="motivatedAmount"
                type="text"
                className="form-control"
                placeholder=" "
                value={form.motivatedAmount}
                onChange={(event) =>
                  onChange('motivatedAmount', event.target.value)
                }
              />
              <label htmlFor="motivatedAmount">
                Motivated Amount <span className="text-danger">*</span>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
