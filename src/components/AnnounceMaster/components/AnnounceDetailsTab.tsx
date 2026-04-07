import React from 'react';
import { Select } from 'antd';
import { AnnounceDetailsForm, EventOption } from '../types';

interface AnnounceDetailsTabProps {
  form: AnnounceDetailsForm;
  occasionTypeOptions: EventOption[];
  causeHeadOptions: EventOption[];
  purposeOptions: EventOption[];
  amount: string;
  isAmountEditable: boolean;
  quantityControlMode: 'disabled' | 'stepper' | 'select';
  quantityOptions: { value: number; label: string }[];
  onAmountChange: (value: string) => void;
  onChange: <K extends keyof AnnounceDetailsForm>(
    field: K,
    value: AnnounceDetailsForm[K],
  ) => void;
  onQuantityChange: (nextQuantity: number) => void;
}

export const AnnounceDetailsTab = ({
  form,
  occasionTypeOptions,
  causeHeadOptions,
  purposeOptions,
  amount,
  isAmountEditable,
  quantityControlMode,
  quantityOptions,
  onAmountChange,
  onChange,
  onQuantityChange,
}: AnnounceDetailsTabProps) => {
  const renderFloatingSelect = (
    id: keyof Pick<
      AnnounceDetailsForm,
      'occasionType' | 'causeHead' | 'purpose' | 'paymentMode' | 'howToDonate'
    >,
    label: React.ReactNode,
    value: string,
    options: { value: string; label: string }[],
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
    <div>
      <div className="text-muted fs-7 mb-4">
        In Memory dropdown + Purpose fixed amount
      </div>

      <div className="row g-5">
        <div className="col-md-3">
          {renderFloatingSelect(
            'occasionType',
            <>
              In Memory / Occasion Type <span className="text-danger">*</span>
            </>,
            form.occasionType,
            occasionTypeOptions,
          )}
        </div>

        <div className="col-md-2">
          <div className="form-floating ant-input-floating">
            <input
              id="occasionDate"
              type="date"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.occasionDate}
              onChange={event => onChange('occasionDate', event.target.value)}
            />
            <label htmlFor="occasionDate">
              Occasion Date <span className="text-danger">*</span>
            </label>
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-floating ant-input-floating">
            <input
              id="occasionRemark"
              type="text"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.occasionRemark}
              onChange={event => onChange('occasionRemark', event.target.value)}
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
          {renderFloatingSelect(
            'causeHead',
            <>
              Cause Head <span className="text-danger">*</span>
            </>,
            form.causeHead,
            causeHeadOptions,
          )}
        </div>

        <div className="col-md-3">
          {renderFloatingSelect(
            'purpose',
            <>
              Purpose <span className="text-danger">*</span>
            </>,
            form.purpose,
            purposeOptions,
          )}
          <div className="text-muted fs-8 mt-2">
            Purpose amount fixed - amount auto calculate
          </div>
        </div>

        {quantityControlMode === 'stepper' ||
        quantityControlMode === 'disabled' ? (
          <div className="col-md-2">
            <div className="form-floating ant-input-floating quantity-floating">
              <div className="input-group ant-input-floating-control quantity-input-group">
                <button
                  className="btn btn-light quantity-input-btn"
                  type="button"
                  disabled={quantityControlMode === 'disabled'}
                  onClick={() => onQuantityChange(form.quantity - 1)}
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="text"
                  className="form-control text-center quantity-input-field"
                  value={form.quantity}
                  inputMode="numeric"
                  placeholder=" "
                  disabled={quantityControlMode === 'disabled'}
                  onChange={event =>
                    onQuantityChange(Number(event.target.value) || 1)
                  }
                />
                <button
                  className="btn btn-light quantity-input-btn"
                  type="button"
                  disabled={quantityControlMode === 'disabled'}
                  onClick={() => onQuantityChange(form.quantity + 1)}
                >
                  +
                </button>
              </div>
              <label htmlFor="quantity">Quantity</label>
            </div>
          </div>
        ) : null}

        {quantityControlMode === 'select' ? (
          <div className="col-md-2">
            <div
              className={`form-floating ant-select-floating ${
                form.quantity ? 'has-value' : ''
              }`}
            >
              <Select
                id="quantity"
                placeholder=""
                value={form.quantity || undefined}
                onChange={nextValue => onQuantityChange(Number(nextValue) || 1)}
                options={quantityOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
              <label htmlFor="quantity">Quantity</label>
            </div>
          </div>
        ) : null}

        <div className="col-md-2">
          <div className="form-floating ant-input-floating">
            <input
              id="autoAmount"
              type="text"
              className={`form-control ant-input-floating-control ${
                isAmountEditable ? '' : 'form-control-solid'
              }`}
              placeholder=" "
              value={amount}
              readOnly={!isAmountEditable}
              onChange={event => onAmountChange(event.target.value)}
            />
            <label htmlFor="autoAmount">
              Amount (Auto) <span className="text-danger">*</span>
            </label>
          </div>
          <div className="text-muted fs-8 mt-2">
            {isAmountEditable
              ? 'Manual amount allowed for selected purpose'
              : 'Auto amount fetched/calculated'}
          </div>
        </div>
          {form.causeHead === '150' ? (
          <div className="col-md-2">
            <div className="form-floating ant-input-floating">
              <input
                id="causeHeadDate"
                type="date"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.causeHeadDate}
                onChange={event => onChange('causeHeadDate', event.target.value)}
              />
              <label htmlFor="causeHeadDate">Cause Head Date</label>
            </div>
          </div>
        ) : null}
      </div>

      <div className="row g-5 mt-1">
        <div className="col-md-2">
          {renderFloatingSelect(
            'paymentMode',
            'Payment Mode',
            form.paymentMode,
            [
              { value: 'Cash', label: 'Cash' },
              { value: 'UPI', label: 'UPI' },
              { value: 'NetBanking', label: 'NetBanking' },
              { value: 'Cheque', label: 'Cheque' },
              { value: 'Card', label: 'Card' },
            ],
          )}
        </div>

        <div className="col-md-2">
          {renderFloatingSelect(
            'howToDonate',
            'How To Donate',
            form.howToDonate,
            [
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'UPI Link', label: 'UPI Link' },
              { value: 'Payment Gateway', label: 'Payment Gateway' },
              { value: 'Donation Box', label: 'Donation Box' },
            ],
          )}
        </div>

        <div className="col-md-2">
          <div className="form-floating ant-input-floating">
            <input
              id="expectedDate"
              type="date"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.expectedDate}
              onChange={event => onChange('expectedDate', event.target.value)}
            />
            <label htmlFor="expectedDate">Expected Donation Date</label>
          </div>
        </div>

        <div className="col-md-2">
          <div className="form-floating ant-input-floating">
            <input
              id="expectedTime"
              type="time"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.expectedTime}
              onChange={event => onChange('expectedTime', event.target.value)}
            />
            <label htmlFor="expectedTime">Expected Donation Time</label>
          </div>
        </div>

        <div className="col-md-1">
          <label className="form-check form-check-custom form-check-solid pt-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.isMotivated}
              onChange={event => onChange('isMotivated', event.target.checked)}
            />
            <span className="form-check-label fw-semibold">Motivated</span>
          </label>
        </div>

        {form.isMotivated ? (
          <div className="col-md-3">
            <div className="form-floating ant-input-floating">
              <input
                id="motivatedAmount"
                type="text"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.motivatedAmount}
                onChange={event =>
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
