import React from 'react';

export const ReceiveIdPurposeTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_purpose" role="tabpanel">
      <div id="purposeBlock">
        <div className={'row g-5 align-items-end'}>
          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>
              Head <span className={'text-danger'}>*</span>
            </label>
            <select id="pHead" className={'form-select'}>
              <option value="">Select</option>
              <option value="construction">Construction</option>
              <option value="limb">Artificial Limb</option>
              <option value="surgery">Corrective Surgery</option>
              <option value="food">Food/Seva</option>
              <option value="general">General Donation</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>
              Sub Head <span className={'text-danger'}>*</span>
            </label>
            <select id="pSub" className={'form-select'}>
              <option value="">Select</option>
              <option>General</option>
              <option>Project Specific</option>
              <option>Campaign</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Purpose Details</label>
            <input type="text" id="pDesc" className={'form-control'} placeholder="Optional description" />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>
              Quantity <span className={'text-danger'}>*</span>
            </label>
            <div className={'d-flex gap-3'}>
              <input type="text" id="pQty" className={'form-control'} value="1" inputMode="numeric" />
              <button className={'btn btn-primary'} type="button" id="addPurposeBtn">
                Add
              </button>
            </div>
          </div>
        </div>

        <div className={'table-responsive mt-6'}>
          <table className={'table table-rounded table-striped border gy-5 gs-5'}>
            <thead>
              <tr className={'fw-bold fs-6 text-gray-800'}>
                <th>Head</th>
                <th>Sub Head</th>
                <th>Details</th>
                <th>Qty</th>
                <th className={'text-center'}>Action</th>
              </tr>
            </thead>
            <tbody id="purposeTbody">
              <tr>
                <td colSpan={5} className={'text-muted'}>
                  No purpose added.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Critical Disease</label>
          <select id="proofType" className={'form-select'}>
            <option value="">Select</option>
          </select>
        </div>

        <div className={'separator separator-dashed my-6'}></div>

        <div id="familyRefWrap" className={'d-none'}>
          <div className={'notice d-flex bg-light-warning rounded border-warning border border-dashed p-4 mb-5'}>
            <div className={'fw-semibold fs-6 text-gray-700'}>
              Construction donations: ek family ke multiple log donate kar sakte hain. Main Member Donor ID as reference.
            </div>
          </div>

          <div className={'row g-5'}>
            <div className={'col-md-6'}>
              <label className={'form-label fw-semibold'}>Main Member Donor ID (Reference)</label>
              <input type="text" id="mainMemberDonorId" className={'form-control'} placeholder="Enter main donor id (optional)" />
            </div>

            <div className={'col-md-6'}>
              <label className={'form-label fw-semibold'}>Reference Note</label>
              <input type="text" id="familyRefNote" className={'form-control'} placeholder="Optional" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
