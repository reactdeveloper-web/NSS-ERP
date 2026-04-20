import React from 'react';

export const ReceiveIdInstructionTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_instruction" role="tabpanel">
      <div className={'row g-5 align-items-end'}>
        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Instruction</label>
          <select id="instType" className={'form-select'}>
            <option value="">Select</option>
            <option>AADHAAR CARD UPDATED</option>
            <option>ADDRESS UPDATED</option>
            <option>PAN UPDATED</option>
            <option>MOBILE UPDATED</option>
          </select>
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Update In</label>
          <select id="instUpdateIn" className={'form-select'}>
            <option value="">Select</option>
            <option>Donor Master</option>
            <option>Receive Master</option>
            <option>Both</option>
          </select>
        </div>

        <div className={'col-md-4'}>
          <label className={'form-label fw-semibold'}>Details</label>
          <input type="text" id="instDetails" className={'form-control'} placeholder="e.g., Aadhaar No." />
        </div>

        <div className={'col-md-2'}>
          <button className={'btn btn-primary'} type="button" id="addInstBtn">
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
