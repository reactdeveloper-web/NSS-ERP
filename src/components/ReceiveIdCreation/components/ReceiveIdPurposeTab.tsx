import React from 'react';
import {
  AddedAnnounceCause,
  EventOption,
} from 'src/components/AnnounceMaster/types';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

interface ReceivePurposeDraft {
  causeHead: string;
  purpose: string;
  quantity: number;
  causeHeadDate: string;
  namePlateName: string;
  donorInstruction: string;
}

interface ReceiveIdPurposeTabProps extends ReceiveIdFormTabProps {
  purposeForm?: ReceivePurposeDraft;
  addedCauses?: AddedAnnounceCause[];
  editingCauseId?: number | null;
  causeHeadOptions?: EventOption[];
  purposeOptions?: EventOption[];
  autoAmount?: string;
  isAmountEditable?: boolean;
  quantityControlMode?: 'disabled' | 'stepper' | 'select';
  quantityOptions?: { value: number; label: string }[];
  isAddCauseDisabled?: boolean;
  onPurposeChange?: <K extends keyof ReceivePurposeDraft>(
    field: K,
    value: ReceivePurposeDraft[K],
  ) => void;
  onPurposeAmountChange?: (value: string) => void;
  onPurposeQuantityChange?: (nextQuantity: number) => void;
  onAddCause?: () => void;
  onEditCause?: (causeId: number) => void;
  onDeleteCause?: (causeId: number) => void;
}

const selectOnlyOptions = [{ value: '', label: 'Select' }];
const emptyPurposeForm: ReceivePurposeDraft = {
  causeHead: '',
  purpose: '',
  quantity: 1,
  causeHeadDate: '',
  namePlateName: '',
  donorInstruction: '',
};

export const ReceiveIdPurposeTab: React.FC<ReceiveIdPurposeTabProps> = ({
  values,
  updateField,
  isReadOnly,
  purposeForm = emptyPurposeForm,
  addedCauses = [],
  editingCauseId = null,
  causeHeadOptions = [],
  purposeOptions = [],
  autoAmount = '',
  isAmountEditable = false,
  quantityControlMode = 'disabled',
  quantityOptions = [],
  isAddCauseDisabled = true,
  onPurposeChange,
  onPurposeAmountChange,
  onPurposeQuantityChange,
  onAddCause,
  onEditCause,
  onDeleteCause,
}) => {
  const buildSelectedOptions = (
    value: string,
    label: string,
    options: EventOption[],
    alternateValues: string[] = [],
  ) => {
    const normalizedAlternates = alternateValues
      .map(optionValue => optionValue.trim())
      .filter(Boolean);
    const selectedOption = options.find(
      option =>
        option.value === value ||
        normalizedAlternates.includes(option.value.trim()) ||
        (option.purposeId?.trim() &&
          normalizedAlternates.includes(option.purposeId.trim())) ||
        (option.yojnaId?.trim() &&
          normalizedAlternates.includes(option.yojnaId.trim())),
    );

    if (selectedOption || !value.trim() || !label.trim()) {
      return options;
    }

    return [{ value, label }, ...options];
  };

  const renderQuantitySelect = () => (
    <div className="col-md-4">
      <FloatingSelectField
        id="quantity"
        label="Quantity"
        value={String(purposeForm.quantity || '')}
        options={quantityOptions.map(option => ({
          value: String(option.value),
          label: option.label,
        }))}
        disabled={isReadOnly}
        onChange={value => onPurposeQuantityChange?.(Number(value) || 1)}
      />
    </div>
  );

  return (
    <div className={'tab-pane fade'} id="tab_purpose" role="tabpanel">
      <div id="purposeBlock">
        <div className="row g-5">
          <div className="col-md-3">
            <FloatingSelectField
              id="causeHead"
              label={
                <>
                  Cause Head <span className="text-danger">*</span>
                </>
              }
              value={purposeForm.causeHead}
              options={causeHeadOptions}
              disabled={isReadOnly}
              onChange={value => onPurposeChange?.('causeHead', value)}
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
              value={purposeForm.purpose}
              options={purposeOptions}
              disabled={isReadOnly}
              onChange={value => onPurposeChange?.('purpose', value)}
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
                          quantityControlMode === 'disabled' || isReadOnly
                        }
                        onClick={() =>
                          onPurposeQuantityChange?.(purposeForm.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        type="text"
                        className="form-control text-center quantity-input-field"
                        value={purposeForm.quantity}
                        inputMode="numeric"
                        placeholder=" "
                        disabled={
                          quantityControlMode === 'disabled' || isReadOnly
                        }
                        onChange={event =>
                          onPurposeQuantityChange?.(
                            Number(event.target.value) || 1,
                          )
                        }
                      />
                      <button
                        className="btn btn-light quantity-input-btn"
                        type="button"
                        disabled={
                          quantityControlMode === 'disabled' || isReadOnly
                        }
                        onClick={() =>
                          onPurposeQuantityChange?.(purposeForm.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <label htmlFor="quantity">Quantity</label>
                  </div>
                </div>
              ) : null}

              {quantityControlMode === 'select' ? renderQuantitySelect() : null}

              <div className="col-md-4">
                <FloatingInputField
                  id="autoAmount"
                  label={
                    <>
                      Amount (Auto) <span className="text-danger">*</span>
                    </>
                  }
                  value={autoAmount}
                  onChange={value => onPurposeAmountChange?.(value)}
                  readOnly={!isAmountEditable || isReadOnly}
                  disabled={isReadOnly}
                  className={`form-control ant-input-floating-control ${
                    isAmountEditable ? '' : 'form-control-solid'
                  }`}
                />
                <div className="text-muted fs-8 mt-2">
                  {isAmountEditable
                    ? 'Manual amount allowed for selected purpose'
                    : 'Auto amount fetched/calculated'}
                </div>
              </div>

              {purposeForm.causeHead === '150' ? (
                <div className="col-md-4">
                  <FloatingDatePicker
                    id="causeHeadDate"
                    label="Bhojan Miti Date"
                    value={purposeForm.causeHeadDate}
                    onChange={value =>
                      onPurposeChange?.('causeHeadDate', value)
                    }
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-md-1">
            <button
              className="btn btn-primary fs-6 px-0 w-100"
              type="button"
              disabled={isAddCauseDisabled || isReadOnly}
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
                {(() => {
                  const causeHeadFieldValue =
                    cause.causeHeadPurposeId || cause.causeHead;
                  const causeHeadFieldOptions = buildSelectedOptions(
                    causeHeadFieldValue,
                    cause.causeHeadLabel,
                    causeHeadOptions,
                    [cause.causeHead, cause.causeHeadPurposeId],
                  );
                  const purposeFieldValue = cause.yojnaId || cause.purpose;
                  const purposeFieldOptions = buildSelectedOptions(
                    purposeFieldValue,
                    cause.purposeLabel,
                    [],
                    [cause.purpose, cause.yojnaId],
                  );
                  const normalizedCauseHeadValue =
                    cause.causeHeadPurposeId || cause.causeHead;

                  return (
                    <div className="row g-5">
                      <div className="col-md-3">
                        <FloatingSelectField
                          id={`causeHead-${cause.id}`}
                          label="Cause Head"
                          value={causeHeadFieldValue}
                          options={causeHeadFieldOptions}
                          disabled
                          onChange={() => undefined}
                        />
                      </div>

                      <div className="col-md-3">
                        <FloatingSelectField
                          id={`purpose-${cause.id}`}
                          label="Purpose"
                          value={purposeFieldValue}
                          options={purposeFieldOptions}
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

                          {normalizedCauseHeadValue === '150' ? (
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
                          disabled={isReadOnly}
                          onClick={() => onEditCause?.(cause.id)}
                        >
                          <i className="fa fa-pen fs-5"></i>
                        </button>
                        <button
                          className="btn btn-light-danger w-50 text-center"
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => onDeleteCause?.(cause.id)}
                        >
                          <i className="fa fa-trash fs-5"></i>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {['162', '167', '168'].includes(
                  cause.causeHeadPurposeId || cause.causeHead,
                ) ? (
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

        {['162', '167', '168'].includes(purposeForm.causeHead) ? (
          <div className="row g-5 mt-1">
            <div className="col-md-3">
              <FloatingInputField
                id="namePlateName"
                label="Name Plate Name"
                value={purposeForm.namePlateName}
                onChange={value => onPurposeChange?.('namePlateName', value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="col-md-9">
              <div className="form-floating ant-input-floating">
                <textarea
                  id="donorInstruction"
                  className="form-control ant-input-floating-control"
                  placeholder=" "
                  value={purposeForm.donorInstruction}
                  disabled={isReadOnly}
                  onChange={event =>
                    onPurposeChange?.('donorInstruction', event.target.value)
                  }
                  style={{ minHeight: '42px' }}
                />
                <label htmlFor="donorInstruction">Donor Instruction</label>
              </div>
            </div>
          </div>
        ) : null}

        <div className={'separator separator-dashed my-6'}></div>

        <div className={'col-md-3'}>
          <FloatingSelectField
            id="criticalDisease"
            label="Critical Disease"
            value={values.criticalDisease}
            options={selectOnlyOptions}
            disabled={isReadOnly}
            onChange={value => updateField('criticalDisease', value as string)}
          />
        </div>

        <div id="familyRefWrap" className={'d-none'}>
          <div className={'notice d-flex bg-light-warning rounded border-warning border border-dashed p-4 mb-5'}>
            <div className={'fw-semibold fs-6 text-gray-700'}>
              Construction donations: ek family ke multiple log donate kar sakte hain. Main Member Donor ID as reference.
            </div>
          </div>

          <div className={'row g-5'}>
            <div className={'col-md-6'}>
              <FloatingInputField
                id="mainMemberDonorId"
                label="Main Member Donor ID (Reference)"
                value={values.mainMemberDonorId}
                onChange={value => updateField('mainMemberDonorId', value)}
                placeholder="Enter main donor id (optional)"
                readOnly={isReadOnly}
              />
            </div>

            <div className={'col-md-6'}>
              <FloatingInputField
                id="familyRefNote"
                label="Reference Note"
                value={values.referenceNote}
                onChange={value => updateField('referenceNote', value)}
                placeholder="Optional"
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
