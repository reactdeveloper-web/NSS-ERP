import React from 'react';
import { FloatingTextareaField } from 'src/components/Common/FloatingTextareaField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

export const ReceiveIdRemarksTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_remarks" role="tabpanel">
      <FloatingTextareaField
        id="remarks"
        label="Remarks"
        value={values.remarks}
        onChange={value => updateField('remarks', value)}
        placeholder="Write remarks..."
        minHeight="150px"
        readOnly={isReadOnly}
      />
    </div>
  );
};
