import React from 'react';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

const receiptCopyOptions = [
  { value: 'Soft Copy', label: 'Soft Copy' },
  { value: 'Hard Copy', label: 'Hard Copy' },
  { value: 'Both', label: 'Both' },
];

const proofTypeOptions = [
  { value: '', label: 'Select' },
  { value: 'PAN', label: 'PAN' },
  { value: 'Aadhaar', label: 'Aadhaar' },
  { value: 'Passport', label: 'Passport' },
];

const receiveEventOptions = [
  { value: '', label: 'Select' },
  { value: 'Apno Se Apni Baat (Live)', label: 'Apno Se Apni Baat (Live)' },
  { value: 'Hospital Visit', label: 'Hospital Visit' },
  { value: 'Donation Drive', label: 'Donation Drive' },
  { value: 'Rathyatra Event', label: 'Rathyatra Event' },
];

const selectOnlyOptions = [{ value: '', label: 'Select' }];

const magazinePreferenceOptions = [
  { value: '', label: 'Select' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'English', label: 'English' },
];

const withCurrentOption = (
  options: { value: string; label: string }[],
  value: string,
) =>
  value && !options.some(option => option.value === value)
    ? [...options, { value, label: value }]
    : options;

export const ReceiveIdReceiptDetailsTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_receipt" role="tabpanel">
      <div id="receiptBlock">
        <div className={'row g-5'}>
          <div className={'col-md-3'}>
            <FloatingSelectField
              id="receiptCopy"
              label="Receipt Copy Require"
              value={values.receiptCopy}
              options={withCurrentOption(receiptCopyOptions, values.receiptCopy)}
              disabled={isReadOnly}
              onChange={value => updateField('receiptCopy', value as string)}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingSelectField
              id="proofType"
              label="Proof Type"
              value={values.proofType}
              options={withCurrentOption(proofTypeOptions, values.proofType)}
              disabled={isReadOnly}
              onChange={value => updateField('proofType', value as string)}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingSelectField
              id="receiveEvent"
              label={
                <>
                  Receive In Event <span className={'text-danger'}>*</span>
                </>
              }
              value={values.receiveEvent}
              options={withCurrentOption(receiveEventOptions, values.receiveEvent)}
              disabled={isReadOnly}
              onChange={value => updateField('receiveEvent', value as string)}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingSelectField
              id="protocolSadhak"
              label={
                <>
                  Protocol Sadhak <span className={'text-danger'}>*</span>
                </>
              }
              value={values.protocolSadhak}
              options={withCurrentOption(selectOnlyOptions, values.protocolSadhak)}
              disabled={isReadOnly}
              onChange={value => updateField('protocolSadhak', value as string)}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingInputField
              id="ProNo"
              label="Provisional No."
              value={values.provisionalNo}
              onChange={value => updateField('provisionalNo', value)}
              placeholder="Enter Provisional No."
              readOnly={isReadOnly}
            />
          </div>

          <div className={'col-md-3'}>
            <FloatingDatePicker
              id="provisionalDate"
              label="Provisional Date"
              value={values.provisionalDate}
              onChange={value => updateField('provisionalDate', value)}
              placeholder="Enter Provisional Date"
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className={'separator separator-dashed my-6'}></div>

        <div className={'border rounded p-5 d-none'} id="magCollapse">
          <div className={'mb-4'}>
            <h5 className={'fw-bold mb-1'}>Receipt Magazine Details</h5>
            <div className={'text-muted fs-8'}>
              Auto-hidden if address present; show when address missing
            </div>
          </div>

          <div className={'notice d-flex bg-light-info rounded border-info border border-dashed p-4 mb-5'}>
            <div className={'fw-semibold fs-6 text-gray-700'}>
              Magazine section is only needed when Donor address is missing/incomplete.
            </div>
          </div>

          <div className={'row g-5'}>
            <div className={'col-md-4'}>
              <FloatingSelectField
                id="magPref"
                label="Magazine Preference"
                value={values.magazinePreference}
                options={withCurrentOption(
                  magazinePreferenceOptions,
                  values.magazinePreference,
                )}
                disabled={isReadOnly}
                onChange={value => updateField('magazinePreference', value as string)}
              />
            </div>

            <div className={'col-md-4'}>
              <FloatingInputField
                id="magNote"
                label="Dispatch Address Note"
                value={values.dispatchAddressNote}
                onChange={value => updateField('dispatchAddressNote', value)}
                placeholder="Optional"
                readOnly={isReadOnly}
              />
            </div>

            <div className={'col-md-4'}>
              <FloatingInputField
                id="magReceiver"
                label="Receiver Name"
                value={values.receiverName}
                onChange={value => updateField('receiverName', value)}
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
