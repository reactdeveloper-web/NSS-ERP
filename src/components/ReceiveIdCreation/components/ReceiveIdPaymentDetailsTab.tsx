import React from 'react';

export const ReceiveIdPaymentDetailsTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_payment" role="tabpanel">
      <div id="paymentBlock">
        <div className={'row g-5'}>
          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>
              Payment Mode <span className={'text-danger'}>*</span>
            </label>
            <select className={'form-select'}>
              <option>Select</option>
            </select>
          </div>

          <div className={'col-md-3 d-flex justify-content-between'}>
            <div className={'form-check mt-12'}>
              <input className={'form-check-input'} type="checkbox" />
              <label className={'form-check-label fw-semibold'}>Pay-In-Slip Cash</label>
            </div>
            <div className={'d-flex flex-column'}>
              <label className={'form-label fw-semibold'}>
                Currency <span className={'text-danger'}>*</span>
              </label>
              <input type="text" className={'form-control'} value="Indian Rupee (INR)" />
            </div>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>
              Amount <span className={'text-danger'}>*</span>
            </label>
            <input type="text" className={'form-control'} />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Material Deposit Id</label>
            <input type="text" className={'form-control'} />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Material</label>
            <input type="text" className={'form-control'} />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Bank Name 1</label>
            <select className={'form-select'}>
              <option>Select</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Cheque/Draft Date</label>
            <input type="date" className={'form-control'} />
          </div>
          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Cheque/Draft No</label>
            <input type="text" className={'form-control'} />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Deposit Bank &amp; Date</label>
            <select className={'form-select'}>
              <option>All</option>
            </select>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Deposit Date</label>
            <input type="date" className={'form-control'} />
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>PDC Cheque-1</label>

            <div className={'btn-group w-100 mt-2'} role="group">
              <input type="radio" className={'btn-check'} name="pdc" id="pdcYes" autoComplete="off" />
              <label className={'btn btn-outline-secondary w-50'} htmlFor="pdcYes">
                Yes
              </label>

              <input type="radio" className={'btn-check'} name="pdc" id="pdcNo" autoComplete="off" checked={true} />
              <label className={'btn btn-outline-secondary w-50'} htmlFor="pdcNo">
                No
              </label>
            </div>
          </div>

          <div className={'col-md-3'}>
            <label className={'form-label fw-semibold'}>Manual Bank Id</label>
            <input type="text" id="manualBankId" className={'form-control'} placeholder="Optional" />
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
