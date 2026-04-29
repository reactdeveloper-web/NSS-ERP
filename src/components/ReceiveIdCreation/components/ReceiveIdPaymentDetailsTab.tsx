import React from 'react';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

const selectOnlyOptions = [{ value: '', label: 'Select' }];
const depositBankOptions = [{ value: 'All', label: 'All' }];

const withCurrentOption = (
  options: { value: string; label: string }[],
  value: string,
) =>
  value && !options.some(option => option.value === value)
    ? [...options, { value, label: value }]
    : options;

export const ReceiveIdPaymentDetailsTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_payment" role="tabpanel">
      <div id="paymentBlock">
        <div className={'row g-5'}>
          <div className={'col-md-3'}>
            <FloatingSelectField
              id="paymentMode"
              label={
                <>
                  Payment Mode <span className={'text-danger'}>*</span>
                </>
              }
              value={values.paymentMode}
              options={withCurrentOption(selectOnlyOptions, values.paymentMode)}
              disabled={isReadOnly}
              onChange={value => updateField('paymentMode', value as string)}
            />
          </div>

          <div className={'col-md-3 d-flex justify-content-between'}>
            <div className={'form-check mt-12'}>
              <input className={'form-check-input'} type="checkbox" disabled={isReadOnly} />
              <label className={'form-check-label fw-semibold'}>Pay-In-Slip Cash</label>
            </div>
            <div className={'d-flex flex-column flex-grow-1 ms-3'}>
              <FloatingInputField
                id="currency"
                label={
                  <>
                    Currency <span className={'text-danger'}>*</span>
                  </>
                }
                value={values.currency}
                onChange={value => updateField('currency', value)}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className={'col-md-3'}>
            <FloatingInputField
              id="amount"
              label={
                <>
                  Amount <span className={'text-danger'}>*</span>
                </>
              }
              value={values.amount}
              onChange={value => updateField('amount', value)}
              readOnly={isReadOnly}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingInputField
              id="materialDepositId"
              label="Material Deposit Id"
              value={values.materialDepositId}
              onChange={value => updateField('materialDepositId', value)}
              readOnly={isReadOnly}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingInputField
              id="material"
              label="Material"
              value={values.material}
              onChange={value => updateField('material', value)}
              readOnly={isReadOnly}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingSelectField
              id="bankName1"
              label="Bank Name 1"
              value={values.bankName1}
              options={withCurrentOption(selectOnlyOptions, values.bankName1)}
              disabled={isReadOnly}
              onChange={value => updateField('bankName1', value as string)}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingDatePicker
              id="chequeDate"
              label="Cheque/Draft Date"
              value={values.chequeDate}
              onChange={value => updateField('chequeDate', value)}
              readOnly={isReadOnly}
            />
          </div>
          <div className={'col-md-3'}>
            <FloatingInputField
              id="chequeNo"
              label="Cheque/Draft No"
              value={values.chequeNo}
              onChange={value => updateField('chequeNo', value)}
              readOnly={isReadOnly}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingSelectField
              id="depositBank"
              label="Deposit Bank & Date"
              value={values.depositBank}
              options={withCurrentOption(depositBankOptions, values.depositBank)}
              disabled={isReadOnly}
              onChange={value => updateField('depositBank', value as string)}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingDatePicker
              id="depositDate"
              label="Deposit Date"
              value={values.depositDate}
              onChange={value => updateField('depositDate', value)}
              readOnly={isReadOnly}
            />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>PDC Cheque-1</label>

            <div className={'btn-group w-100 mt-2'} role="group">
              <input type="radio" className={'btn-check'} name="pdc" id="pdcYes" autoComplete="off" disabled={isReadOnly} />
              <label className={'btn btn-outline-secondary w-50'} htmlFor="pdcYes">
                Yes
              </label>

              <input type="radio" className={'btn-check'} name="pdc" id="pdcNo" autoComplete="off" defaultChecked disabled={isReadOnly} />
              <label className={'btn btn-outline-secondary w-50'} htmlFor="pdcNo">
                No
              </label>
            </div>
          </div>

          <div className={'col-md-3'}>
            <FloatingInputField
              id="manualBankId"
              label="Manual Bank Id"
              value={values.manualBankId}
              onChange={value => updateField('manualBankId', value)}
              placeholder="Optional"
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className={'separator separator-dashed my-6'}></div>

        <div id="chequeSection" className={'d-none'}>
          <div className={'border rounded p-5'}>
            <div className={'d-flex justify-content-between align-items-center mb-5'}>
              <div>
                <h5 className={'fw-bold mb-1'}>Cheque Details</h5>
                <div className={'text-muted fs-8'}>You can add multiple cheques if needed</div>
              </div>
              <button className={'btn btn-primary btn-sm'} type="button" id="addChequeBtn">
                + Add Cheque Row
              </button>
            </div>

            <div className={'table-responsive'}>
              <table className={'table table-rounded table-striped border gy-5 gs-5'}>
                <thead>
                  <tr className={'fw-bold fs-6 text-gray-800'}>
                    <th>Donor Bank</th>
                    <th>Cheque/Draft Date</th>
                    <th>Cheque/Draft No.</th>
                    <th>Deposit Bank</th>
                    <th>Deposit Date</th>
                    <th>PDC</th>
                    <th className={'text-center'}>Action</th>
                  </tr>
                </thead>
                <tbody id="chequeTbody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
