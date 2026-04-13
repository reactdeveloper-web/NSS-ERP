import React from 'react';
import { Select } from 'antd';
import {
  AddedAnnounceCause,
  AnnounceDetailsForm,
  AnnounceValidationErrors,
  EventOption,
} from '../types';
// import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
// import { FloatingTimePicker } from 'src/components/Common/FloatingTimePicker';
import { FloatingDatePicker } from '../../Common/FloatingDatePicker';
import { FloatingTimePicker } from '../../Common/FloatingTimePicker';
import { FloatingInputField } from '../../Common/FloatingInputField';

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
  errors,
  onAmountChange,
  onChange,
  onAddCause,
  onEditCause,
  onDeleteCause,
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
    error?: string,
  ) => (
    <div>
      <div
        className={`form-floating ant-select-floating ${value ? 'has-value' : ''
          } ${disabled ? 'is-disabled' : ''} ${error ? 'has-error' : ''}`}
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
      {error ? <div className="announce-master-field-error">{error}</div> : null}
    </div>
  );

  const renderQuantityField = (
    quantity: number,
    disabled: boolean,
    onQuantityInputChange?: (nextQuantity: number) => void,
  ) =>
    quantityControlMode === 'select' ? (
      <div className="col-md-4">
        <div
          className={`form-floating ant-select-floating ${quantity ? 'has-value' : ''
            } ${disabled ? 'is-disabled' : ''}`}
        >
          <Select
            id="quantity"
            placeholder=""
            disabled={disabled}
            value={quantity || undefined}
            onChange={nextValue =>
              onQuantityInputChange?.(Number(nextValue) || 1)
            }
            options={quantityOptions.map(option => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <label htmlFor="quantity">Quantity</label>
        </div>
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
          {renderFloatingSelect(
            'occasionType',
            <>
              In Memory / Occasion Type <span className="text-danger">*</span>
            </>,
            form.occasionType,
            occasionTypeOptions,
            false,
            errors.occasionType,
          )}
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
            error={errors.occasionDate}
          />
        </div>

        <div className="col-md-3">
          {/* <div
            className={`form-floating ant-input-floating ${errors.occasionRemark ? 'has-error' : ''
              }`}
          >
            <input
              id="occasionRemark"
              type="text"
              className="form-control ant-input-floating-control"
              placeholder=" "
              value={form.occasionRemark}
              spellCheck={true}
              onChange={event => onChange('occasionRemark', event.target.value)}
              aria-invalid={Boolean(errors.occasionRemark)}
            />
            <label htmlFor="occasionRemark">
              Remark <span className="text-danger">*</span>
            </label>
          </div>
          {errors.occasionRemark ? (
            <div className="announce-master-field-error">
              {errors.occasionRemark}
            </div>
          ) : null} */}
          <FloatingInputField
            id='occasionRemark'
            label={
              <>
                Remark <span className="text-danger">*</span>
              </>
            }
            value={form.occasionRemark}
            onChange={value => onChange('occasionRemark', value)}
            error={errors.occasionRemark}
          />
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
            false,
            errors.causeHead,
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
            false,
            errors.purpose,
          )}
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

            {quantityControlMode === 'select'
              ? renderQuantityField(form.quantity, false, onQuantityChange)
              : null}

            <div className="col-md-4">
              <div
                className={`form-floating ant-input-floating ${errors.announceAmount ? 'has-error' : ''
                  }`}
              >
                <input
                  id="autoAmount"
                  type="text"
                  className={`form-control ant-input-floating-control ${isAmountEditable ? '' : 'form-control-solid'
                    }`}
                  placeholder=" "
                  value={amount}
                  readOnly={!isAmountEditable}
                  onChange={event => onAmountChange(event.target.value)}
                  aria-invalid={Boolean(errors.announceAmount)}
                />
                <label htmlFor="autoAmount">
                  Amount (Auto) <span className="text-danger">*</span>
                </label>
              </div>
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
                  label="Cause Head Date"
                  value={form.causeHeadDate}
                  onChange={value => onChange('causeHeadDate', value)}
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
            disabled={isAddCauseDisabled}
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
                  {renderFloatingSelect(
                    'causeHead',
                    <>
                      Cause Head <span className="text-danger">*</span>
                    </>,
                    cause.causeHead,
                    causeHeadOptions,
                    true,
                  )}
                </div>

                <div className="col-md-3">
                  {renderFloatingSelect(
                    'purpose',
                    <>
                      Purpose <span className="text-danger">*</span>
                    </>,
                    cause.purpose,
                    [
                      {
                        value: cause.purpose,
                        label: cause.purposeLabel,
                      },
                    ],
                    true,
                  )}
                </div>
                <div className="col-md-5">
                  <div className="row g-5">
                    <div className="col-md-4">
                      <div className="form-floating ant-input-floating">
                        <input
                          id={`quantity-${cause.id}`}
                          type="text"
                          className="form-control ant-input-floating-control"
                          placeholder=" "
                          value={cause.quantity}
                          disabled
                        />
                        <label htmlFor={`quantity-${cause.id}`}>Quantity</label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-floating ant-input-floating">
                        <input
                          id={`autoAmount-${cause.id}`}
                          type="text"
                          className="form-control ant-input-floating-control form-control-solid"
                          placeholder=" "
                          value={cause.amount}
                          readOnly
                        />
                        <label htmlFor={`autoAmount-${cause.id}`}>
                          Amount (Auto)
                        </label>
                      </div>
                    </div>

                    {cause.causeHead === '150' ? (
                      <div className="col-md-4">
                        <FloatingDatePicker
                          id={`causeHeadDate-${cause.id}`}
                          label="Cause Head Date"
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
                    onClick={() => onEditCause(cause.id)}
                  >
                    <i className="fa fa-pen  fs-5"></i>
                  </button>
                  <button
                    className="btn btn-light-danger  w-50 text-center"
                    type="button"
                    onClick={() => onDeleteCause(cause.id)}
                  >
                    <i className="fa fa-trash  fs-5"></i>
                  </button>
                </div>
              </div>

              {['162', '167', '168'].includes(cause.causeHead) ? (
                <div className="row g-5 mt-1">
                  <div className="col-md-3">
                    <div className="form-floating ant-input-floating">
                      <input
                        id={`namePlateName-${cause.id}`}
                        type="text"
                        className="form-control ant-input-floating-control"
                        placeholder=" "
                        value={cause.namePlateName}
                        disabled
                      />
                      <label htmlFor={`namePlateName-${cause.id}`}>
                        Name Plate Name
                      </label>
                    </div>
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
          {renderFloatingSelect(
            'paymentMode',
            'Payment Mode',
            form.paymentMode,
            [
              { value: '', label: 'Select' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Cheque', label: 'Cheque' },
              { value: 'DD', label: 'DD' },
              { value: 'Money Order', label: 'Money Order' },
              { value: 'Online', label: 'Online' },
              { value: 'Pay-In-Slip', label: 'Pay-In-Slip' },
              { value: 'Material', label: 'Material' },
            ],
            false,
            errors.paymentMode,
          )}
        </div>

        <div className="col-md-2">
          {renderFloatingSelect(
            'howToDonate',
            'How To Donate',
            form.howToDonate,
            howToDonateOptions,
            false,
            errors.howToDonate,
          )}
        </div>

        <div className="col-md-2">
          <FloatingDatePicker
            id="expectedDate"
            label="Expected Donation Date"
            value={form.expectedDate}
            onChange={value => onChange('expectedDate', value)}
          />
        </div>

        <div className="col-md-2">
          <FloatingTimePicker
            id="expectedTime"
            label="Expected Donation Time"
            value={form.expectedTime}
            onChange={value => onChange('expectedTime', value)}
          />
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
            <div
              className={`form-floating ant-input-floating ${errors.motivatedAmount ? 'has-error' : ''
                }`}
            >
              <input
                id="motivatedAmount"
                type="text"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.motivatedAmount}
                onChange={event =>
                  onChange('motivatedAmount', event.target.value)
                }
                aria-invalid={Boolean(errors.motivatedAmount)}
              />
              <label htmlFor="motivatedAmount">
                Motivated Amount <span className="text-danger">*</span>
              </label>
            </div>
            {errors.motivatedAmount ? (
              <div className="announce-master-field-error">
                {errors.motivatedAmount}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {['162', '167', '168'].includes(form.causeHead) ? (
        <div className="row g-5 mt-1">
          <div className="col-md-3">
            <div className="form-floating ant-input-floating">
              <input
                id="namePlateName"
                type="text"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.namePlateName}
                onChange={event =>
                  onChange('namePlateName', event.target.value)
                }
              />
              <label htmlFor="namePlateName">Name Plate Name</label>
            </div>
          </div>

          <div className="col-md-9">
            <div className="form-floating ant-input-floating">
              <textarea
                id="donorInstruction"
                className="form-control ant-input-floating-control"
                placeholder=" "
                value={form.donorInstruction}
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
