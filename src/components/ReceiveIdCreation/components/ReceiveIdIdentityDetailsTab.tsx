import React from 'react';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

export const ReceiveIdIdentityDetailsTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_identity" role="tabpanel">
      <div className={'row g-5 align-items-end'}>
        <div className={'col-md-4'}>
          <FloatingInputField
            id="AadharNumber"
            label="Aadhar Number"
            value={values.aadharNumber}
            onChange={value => updateField('aadharNumber', value)}
            placeholder="Enter AADHAR Number"
            readOnly={isReadOnly}
          />
        </div>

        <div className={'col-md-4'}>
          <FloatingInputField
            id="PanNumber"
            label="PAN Number"
            value={values.panNumber}
            onChange={value => updateField('panNumber', value)}
            placeholder="Enter PAN Number"
            readOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};
