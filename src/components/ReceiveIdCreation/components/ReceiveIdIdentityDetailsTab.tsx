import React from 'react';

export const ReceiveIdIdentityDetailsTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_identity" role="tabpanel">
      <div className={'row g-5 align-items-end'}>
        <div className={'col-md-4'}>
          <label className={'form-label fw-semibold'}>Aadhar Number</label>
          <input type="text" id="AadharNumber" className={'form-control'} placeholder="Enter AADHAR Number" />
        </div>

        <div className={'col-md-4'}>
          <label className={'form-label fw-semibold'}>PAN Number</label>
          <input type="text" id="PanNumber" className={'form-control'} placeholder="Enter PAN Number" />
        </div>
      </div>
    </div>
  );
};
