import React from 'react';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

const instructionOptions = [
  { value: '', label: 'Select' },
  { value: 'AADHAAR CARD UPDATED', label: 'AADHAAR CARD UPDATED' },
  { value: 'ADDRESS UPDATED', label: 'ADDRESS UPDATED' },
  { value: 'PAN UPDATED', label: 'PAN UPDATED' },
  { value: 'MOBILE UPDATED', label: 'MOBILE UPDATED' },
];

const updateInOptions = [
  { value: '', label: 'Select' },
  { value: 'Donor Master', label: 'Donor Master' },
  { value: 'Receive Master', label: 'Receive Master' },
  { value: 'Both', label: 'Both' },
];

export const ReceiveIdInstructionTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_instruction" role="tabpanel">
      <div className={'row g-5 align-items-end'}>
        <div className={'col-md-3'}>
          <FloatingSelectField
            id="instType"
            label="Instruction"
            value={values.instruction}
            options={instructionOptions}
            disabled={isReadOnly}
            onChange={value => updateField('instruction', value as string)}
          />
        </div>

        <div className={'col-md-3'}>
          <FloatingSelectField
            id="instUpdateIn"
            label="Update In"
            value={values.updateIn}
            options={updateInOptions}
            disabled={isReadOnly}
            onChange={value => updateField('updateIn', value as string)}
          />
        </div>

        <div className={'col-md-4'}>
          <FloatingInputField
            id="instDetails"
            label="Details"
            value={values.details}
            onChange={value => updateField('details', value)}
            placeholder="e.g., Aadhaar No."
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-2'}>
          <button className={'btn btn-primary'} type="button" id="addInstBtn" disabled={isReadOnly}>
            Add
          </button>
        </div>
      </div>

      <div className={'table-responsive mt-6'}>
        <table className={'table table-rounded table-striped border gy-5 gs-5'}>
          <thead>
            <tr className={'fw-bold fs-6 text-gray-800'}>
              <th>Instruction</th>
              <th>Update In</th>
              <th>Details</th>
              <th className={'text-center'}>Action</th>
            </tr>
          </thead>
          <tbody id="instTbody">
            <tr>
              <td colSpan={4} className={'text-muted'}>
                No instructions added.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
