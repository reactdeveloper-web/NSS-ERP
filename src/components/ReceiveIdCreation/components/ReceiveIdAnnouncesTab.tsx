import React from 'react';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

export const ReceiveIdAnnouncesTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_announces" role="tabpanel">
      <div className={'row g-6'}>
        <div className={'col-12 px-4'}>
          <div className={'alert alert-info d-flex align-items-center p-4'}>
            <i className={'fa fa-info-circle fs-2 me-3 text-primary'}></i>
            <div>
              When donation is received through a <b>Family Group (WOH)</b>, enter the{' '}
              <b>Main Member Donor ID</b> as reference in all Receive IDs.
            </div>
          </div>
        </div>

        <div className={'col-12 px-4'}>
          <div className={'card shadow-sm'}>
            <div className={'card-header'}>
              <h3 className={'card-title fw-bold text-primary'}>
                <i className={'fa fa-user me-2'}></i> Family Reference Details
              </h3>
            </div>

            <div className={'card-body'}>
              <div className={'row g-5'}>
                <div className={'col-md-4'}>
                  <FloatingInputField
                    id="announceMainMemberDonorId"
                    label="Main Member Donor ID"
                    value={values.mainMemberDonorId}
                    onChange={value => updateField('mainMemberDonorId', value)}
                    placeholder="Enter Main Member Donor ID"
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={'col-12 px-4'}>
          <div className={'card shadow-sm'}>
            <div className={'card-header'}>
              <h3 className={'card-title fw-bold text-success'}>
                <i className={'fa fa-money-bill-wave me-2'}></i> Due Amount Details
              </h3>
            </div>

            <div className={'card-body'}>
              <div className={'file-row row g-5 align-items-end'}>
                <div className={'col-md-4'}>
                  <FloatingInputField
                    id="totalDueAmount"
                    label="Total Due Amount"
                    value={values.totalDueAmount}
                    onChange={value => updateField('totalDueAmount', value)}
                    placeholder="Enter Total Due Amount"
                    readOnly={isReadOnly}
                  />
                </div>

                <div className={'col-md-4'}>
                  <label className={'form-label d-block'}>&nbsp;</label>
                  <div className={'d-flex gap-3'}>
                    <button type="button" className={'btn btn-primary'} disabled={isReadOnly}>
                      <i className={'fa fa-plus'}></i> Add
                    </button>
                    <button type="button" className={'btn btn-light-danger d-none'} disabled={isReadOnly}>
                      <i className={'fa fa-trash'}></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={'col-12 px-4'}>
          <div className={'card shadow-sm'}>
            <div className={'card-header'}>
              <h3 className={'card-title fw-bold text-danger'}>
                <i className={'fa fa-history me-2'}></i> Old Announce History
              </h3>
            </div>

            <div className={'card-body pt-0'}>
              <div className={'table-responsive mt-6'}>
                <table className={'table table-rounded table-striped border gy-5 gs-5 align-middle'}>
                  <thead className={'bg-light'}>
                    <tr className={'fw-bold text-gray-800'}>
                      <th>Donor Bank</th>
                      <th>Cheque/Draft Date</th>
                      <th>Cheque/Draft No.</th>
                      <th>Deposit Bank</th>
                      <th>Deposit Date</th>
                      <th>PDC</th>
                      <th className={'text-center'}>Action</th>
                    </tr>
                  </thead>
                  <tbody id="chequeTbody">
                    <tr className={'text-center text-muted'}>
                      <td colSpan={7}>No history available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
