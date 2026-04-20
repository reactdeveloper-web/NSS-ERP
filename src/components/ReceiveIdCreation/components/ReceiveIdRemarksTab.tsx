import React from 'react';

export const ReceiveIdRemarksTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_remarks" role="tabpanel">
      <textarea id="remarks" className={'form-control'} rows={6} placeholder="Write remarks..."></textarea>
    </div>
  );
};
