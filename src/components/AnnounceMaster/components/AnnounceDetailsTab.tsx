import React from 'react';
import {
  AddedAnnounceCause,
  AnnounceDetailsForm,
  AnnounceValidationErrors,
  EventOption,
} from '../types';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { FloatingTimePicker } from 'src/components/Common/FloatingTimePicker';

interface AnnounceDetailsTabProps {
  form: AnnounceDetailsForm;
  addedCauses: AddedAnnounceCause[];
  editingCauseId: number | null;
  occasionTypeOptions: EventOption[];
  causeHeadOptions: EventOption[];
  purposeOptions: EventOption[];
  howToDonateOptions: EventOption[];
  amount: string;
  isAmountEditable: boolean;
  quantityControlMode: 'disabled' | 'stepper' | 'select';
  quantityOptions: { value: number; label: string }[];
  isAddCauseDisabled: boolean;
  isViewMode?: boolean;
  errors: AnnounceValidationErrors;
  onAmountChange: (value: string) => void;
  onChange: <K extends keyof AnnounceDetailsForm>(
    field: K,
    value: AnnounceDetailsForm[K],
  ) => void;
  onAddCause: () => void;
  onEditCause: (causeId: number) => void;
  onDeleteCause: (causeId: number) => void;
  onQuantityChange: (nextQuantity: number) => void;
}

export const AnnounceDetailsTab = ({
  form,
  addedCauses,
  editingCauseId,
  occasionTypeOptions,
  causeHeadOptions,
  purposeOptions,
  howToDonateOptions,
  amount,
  isAmountEditable,
  quantityControlMode,
  quantityOptions,
  isAddCauseDisabled,
  isViewMode = false,
  errors,
  onAmountChange,
  onChange,
  onAddCause,
  onEditCause,
  onDeleteCause,
  onQuantityChange,
}: AnnounceDetailsTabProps) => {
  const renderQuantityField = (
    quantity: number,
    disabled: boolean,
    onQuantityInputChange?: (nextQuantity: number) => void,
  ) =>
    quantityControlMode === 'select' ? (
      <div className="col-md-4">
        <FloatingSelectField
          id="quantity"
          label="Quantity"
          value={String(quantity || '')}
          options={quantityOptions.map(option => ({
            value: String(option.value),
            label: option.label,
          }))}
          disabled={disabled}
          onChange={value => onQuantityInputChange?.(Number(value) || 1)}
        />
      </div>
    ) : (
      <div className="col-md-2">
        <div className="form-floating ant-input-floating quantity-floating">
          <div className="input-group ant-input-floating-control quantity-input-group">
            <button
              className="btn btn-light quantity-input-btn"
              type="button"
              disabled={disabled || quantityControlMode === 'disabled'}
              onClick={() => onQuantityInputChange?.(quantity - 1)}
            >
              -
            </button>
            <input
              id="quantity"
              type="text"
              className="form-control text-center quantity-input-field"
              value={quantity}
              inputMode="numeric"
              placeholder=" "
              disabled={disabled || quantityControlMode === 'disabled'}
              onChange={event =>
                onQuantityInputChange?.(Number(event.target.value) || 1)
              }
            />
            <button
              className="btn btn-light quantity-input-btn"
              type="button"
              disabled={disabled || quantityControlMode === 'disabled'}
              onClick={() => onQuantityInputChange?.(quantity + 1)}
            >
              +
            </button>
          </div>
          <label htmlFor="quantity">Quantity</label>
        </div>
      </div>
    );

  return (
    <div className="announce-master-panel">
      <div className="announce-master-helper-text">
        {' '}
        In Memory dropdown + Purpose fixed amount
      </div>
      <div className="row g-5">
        <div className="col-md-3">
          <FloatingSelectField
            id="occasionType"
            label={
              <>
                In Memory / Occasion Type <span className="text-danger">*</span>
              </>
            }
            value={form.occasionType}
            options={occasionTypeOptions}
            disabled={isViewMode}
            onChange={value => onChange('occasionType', value)}
            error={errors.occasionType}
          />
        </div>

        <div className="col-md-2">
          <FloatingDatePicker
            id="occasionDate"
            label={
              <>
                Occasion Date <span className="text-danger">*</span>
              </>
            }
            value={form.occasionDate}
            onChange={value => onChange('occasionDate', value)}
            disabled={isViewMode}
            readOnly={isViewMode}
            error={errors.occasionDate}
          />
        </div>

        <div className="col-md-3">
          <FloatingInputField
            id="occasionRemark"
            label={
              <>
                Remark <span className="text-danger">*</span>
              </>
            }
            value={form.occasionRemark}
            onChange={value => onChange('occasionRemark', value)}
            disabled={isViewMode}
            error={errors.occasionRemark}
          />
        </div>
      </div>

      <div className="separator separator-dashed my-6"></div>

      <div className="row g-5">
        <div className="col-md-3">
          <FloatingSelectField
            id="causeHead"
            label={
              <>
                Cause Head <span className="text-danger">*</span>
              </>
            }
            value={form.causeHead}
            options={causeHeadOptions}
            disabled={isViewMode}
            onChange={value => onChange('causeHead', value)}
            error={errors.causeHead}
          />
        </div>

        <div className="col-md-3">
          <FloatingSelectField
            id="purpose"
            label={
              <>
                Purpose <span className="text-danger">*</span>
              </>
            }
            value={form.purpose}
            options={purposeOptions}
            disabled={isViewMode}
            onChange={value => onChange('purpose', value)}
            error={errors.purpose}
          />
          <div className="text-muted fs-8 mt-2">
            Purpose amount fixed - amount auto calculate
          </div>
        </div>
        <div className="col-md-5">
          <div className="row g-5">
            {quantityControlMode === 'stepper' ||
            quantityControlMode === 'disabled' ? (
              <div className="col-md-4">
                <div className="form-floating ant-input-floating quantity-floating">
                  <div className="input-group ant-input-floating-control quantity-input-group">
                    <button
                      className="btn btn-light quantity-input-btn"
                      type="button"
                      disabled={
                        quantityControlMode === 'disabled' || isViewMode
                      }
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
                      disabled={
                        quantityControlMode === 'disabled' || isViewMode
                      }
                      onChange={event =>
                        onQuantityChange(Number(event.target.value) || 1)
                      }
                    />
                    <button
                      className="btn btn-light quantity-input-btn"
                      type="button"
                      disabled={
                        quantityControlMode === 'disabled' || isViewMode
                      }
                      onClick={() => onQuantityChange(form.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <label htmlFor="quantity">Quantity</label>
                </div>
              </div>
            ) : null}

            {quantityControlMode === 'select'
              ? renderQuantityField(form.quantity, isViewMode, onQuantityChange)
              : null}

            <div className="col-md-4">
              <FloatingInputField
                id="autoAmount"
                label={
                  <>
                    Amount (Auto) <span className="text-danger">*</span>
                  </>
                }
                value={amount}
                onChange={onAmountChange}
                readOnly={!isAmountEditable || isViewMode}
                disabled={isViewMode}
                className={`form-control ant-input-floating-control ${
                  isAmountEditable ? '' : 'form-control-solid'
                }`}
                error={errors.announceAmount}
              />
              {!isAmountEditable && errors.announceAmount ? (
                <div className="announce-master-field-error">
                  {errors.announceAmount}
                </div>
              ) : null}
              <div className="text-muted fs-8 mt-2">
                {isAmountEditable
                  ? 'Manual amount allowed for selected purpose'
                  : 'Auto amount fetched/calculated'}
              </div>
            </div>
            {['150'].includes(form.causeHead) ? (
              <div className="col-md-4">
                <FloatingDatePicker
                  id="causeHeadDate"
                  label="Bhojan Miti Date"
                  value={form.causeHeadDate}
                  onChange={value => onChange('causeHeadDate', value)}
                  disabled={isViewMode}
                  readOnly={isViewMode}
                  error={errors.causeHeadDate}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-md-1">
          <button
            className="btn btn-primary fs-6 px-0 w-100"
            type="button"
            disabled={isAddCauseDisabled || isViewMode}
            onClick={onAddCause}
          >
            {editingCauseId === null ? 'Add Cause' : 'Update Cause'}
          </button>
        </div>
      </div>

      {addedCauses.length ? (
        <div className="mt-6">
          {addedCauses.map(cause => (
            <div className="card border-0 mb-5" key={cause.id}>
              <div className="row g-5">
                <div className="col-md-3">
                  <FloatingSelectField
                    id={`causeHead-${cause.id}`}
                    label={
                      <>
                        Cause Head <span className="text-danger">*</span>
                      </>
                    }
                    value={cause.causeHead}
                    options={causeHeadOptions}
                    disabled
                    onChange={() => undefined}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingSelectField
                    id={`purpose-${cause.id}`}
                    label={
                      <>
                        Purpose <span className="text-danger">*</span>
                      </>
                    }
                    value={cause.purpose}
                    options={[
                      {
                        value: cause.purpose,
                        label: cause.purposeLabel,
                      },
                    ]}
                    disabled
                    onChange={() => undefined}
                  />
                </div>
                <div className="col-md-5">
                  <div className="row g-5">
                    <div className="col-md-4">
                      <FloatingInputField
                        id={`quantity-${cause.id}`}
                        label="Quantity"
                        value={String(cause.quantity)}
                        onChange={() => undefined}
                        disabled
                      />
                    </div>

                    <div className="col-md-4">
                      <FloatingInputField
                        id={`autoAmount-${cause.id}`}
                        label="Amount (Auto)"
                        value={cause.amount}
                        onChange={() => undefined}
                        readOnly
                        className="form-control ant-input-floating-control form-control-solid"
                      />
                    </div>

                    {cause.causeHead === '150' ? (
                      <div className="col-md-4">
                        <FloatingDatePicker
                          id={`causeHeadDate-${cause.id}`}
                          label="Bhojan Miti Date"
                          value={cause.causeHeadDate}
                          disabled
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-1 d-flex">
                  <button
                    className="btn btn-light-primary text-center w-50"
                    type="button"
                    disabled={isViewMode}
                    onClick={() => onEditCause(cause.id)}
                  >
                    <i className="fa fa-pen  fs-5"></i>
                  </button>
                  <button
                    className="btn btn-light-danger  w-50 text-center"
                    type="button"
                    disabled={isViewMode}
                    onClick={() => onDeleteCause(cause.id)}
                  >
                    <i className="fa fa-trash  fs-5"></i>
                  </button>
                </div>
              </div>

              {['162', '167', '168'].includes(cause.causeHead) ? (
                <div className="row g-5 mt-1">
                  <div className="col-md-3">
                    <FloatingInputField
                      id={`namePlateName-${cause.id}`}
                      label="Name Plate Name"
                      value={cause.namePlateName}
                      onChange={() => undefined}
                      disabled
                    />
                  </div>

                  <div className="col-md-9">
                    <div className="form-floating ant-input-floating">
                      <textarea
                        id={`donorInstruction-${cause.id}`}
                        className="form-control ant-input-floating-control"
                        placeholder=" "
                        value={cause.donorInstruction}
                        disabled
                        style={{ minHeight: '42px' }}
                      />
                      <label htmlFor={`donorInstruction-${cause.id}`}>
                        Donor Instruction
                      </label>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="row g-5 mt-1">
        <div className="col-md-2">
          <FloatingSelectField
            id="paymentMode"
            label="Payment Mode"
            value={form.paymentMode}
            options={[
              { value: '', label: 'Select' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Cheque', label: 'Cheque' },
              { value: 'DD', label: 'DD' },
              { value: 'Money Order', label: 'Money Order' },
              { value: 'Online', label: 'Online' },
              { value: 'Pay-In-Slip', label: 'Pay-In-Slip' },
              { value: 'Material', label: 'Material' },
            ]}
            disabled={isViewMode}
            onChange={value => onChange('paymentMode', value)}
            error={errors.paymentMode}
          />
        </div>

        <div className="col-md-2">
          <FloatingSelectField
            id="howToDonate"
            label="How To Donate"
            value={form.howToDonate}
            options={howToDonateOptions}
            disabled={isViewMode}
            onChange={value => onChange('howToDonate', value)}
            error={errors.howToDonate}
          />
        </div>

        <div className="col-md-2">
          <FloatingDatePicker
            id="expectedDate"
            label="Expected Donation Date"
            value={form.expectedDate}
            onChange={value => onChange('expectedDate', value)}
            disabled={isViewMode}
            readOnly={isViewMode}
          />
        </div>

        <div className="col-md-2">
          <FloatingTimePicker
            id="expectedTime"
            label="Expected Donation Time"
            value={form.expectedTime}
            onChange={value => onChange('expectedTime', value)}
            disabled={isViewMode}
          />
        </div>

        <div className="col-md-1">
          <label className="form-check form-check-custom form-check-solid pt-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.isMotivated}
              disabled={isViewMode}
              onChange={event => onChange('isMotivated', event.target.checked)}
            />
            <span className="form-check-label fw-semibold">Motivated</span>
          </label>
        </div>

        {form.isMotivated ? (
          <div className="col-md-3">
            <FloatingInputField
              id="motivatedAmount"
              label={
                <>
                  Motivated Amount <span className="text-danger">*</span>
                </>
              }
              value={form.motivatedAmount}
              onChange={value => onChange('motivatedAmount', value)}
              disabled={isViewMode}
              error={errors.motivatedAmount}
            />
          </div>
        ) : null}
      </div>
      {['162', '167', '168'].includes(form.causeHead) ? (
        <div className="row g-5 mt-1">
          <div className="col-md-3">
            <FloatingInputField
              id="namePlateName"
              label="Name Plate Name"
              value={form.namePlateName}
              onChange={value => onChange('namePlateName', value)}
              disabled={isViewMode}
            />
          </div>

          <div className="col-md-9">
            <div className="form-floating ant-input-floating">
              <textarea
                id="donorInstruction"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.donorInstruction}
                disabled={isViewMode}
                onChange={event =>
                  onChange('donorInstruction', event.target.value)
                }
                style={{ minHeight: '42px' }}
              />
              <label htmlFor="donorInstruction">Donor Instruction</label>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
