import React from 'react';

export const ReceiveIdReceiptDetailsTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_receipt" role="tabpanel">
      <div id="receiptBlock">
        <div className={'row g-5'}>
          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Receipt Copy Require</label>
            <select id="receiptCopy" className={'form-select'}>
              <option>Soft Copy</option>
              <option>Hard Copy</option>
              <option>Both</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Proof Type</label>
            <select id="proofType" className={'form-select'}>
              <option value="">Select</option>
              <option>PAN</option>
              <option>Aadhaar</option>
              <option>Passport</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>
              Receive In Event <span className={'text-danger'}>*</span>
            </label>
            <select id="receiveEvent" className={'form-select'}>
              <option value="">Select</option>
              <option>Apno Se Apni Baat (Live)</option>
              <option>Hospital Visit</option>
              <option>Donation Drive</option>
              <option>Rathyatra Event</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>
              Protocol Sadhak <span className={'text-danger'}>*</span>
            </label>
            <select id="receiveEvent" className={'form-select'}>
              <option value="">Select</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Provisional No.</label>
            <input type="text" id="ProNo" className={'form-control'} placeholder="Enter Provisional No." />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Provisional Date</label>
            <input type="date" className={'form-control'} placeholder="Enter Provisional Date" />
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
              <label className={'form-label fw-semibold'}>Magazine Preference</label>
              <select id="magPref" className={'form-select'}>
                <option value="">Select</option>
                <option>Hindi</option>
                <option>English</option>
              </select>
            </div>

            <div className={'col-md-4'}>
              <label className={'form-label fw-semibold'}>Dispatch Address Note</label>
              <input type="text" id="magNote" className={'form-control'} placeholder="Optional" />
            </div>

            <div className={'col-md-4'}>
              <label className={'form-label fw-semibold'}>Receiver Name</label>
              <input type="text" id="magReceiver" className={'form-control'} placeholder="Optional" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
