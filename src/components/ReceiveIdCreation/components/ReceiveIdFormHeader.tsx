import React from 'react';
import { useLocation } from 'react-router-dom';

export const ReceiveIdFormHeader: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const receiveId = searchParams.get('RID') || '';
  const operation = searchParams.get('Operation')?.toUpperCase() || '';
  const shouldShowReceiveId =
    Boolean(receiveId) && ['EDIT', 'VIEW'].includes(operation);

  return (
    <div className={'card-header border-bottom mb-4'}>
      <div className={'card-title w-100 justify-content-between'}>
        <div className={'d-flex gap-5'}>
          <h3 className={'fw-bold mb-0'}>Donor / Receipt Details</h3>
          {shouldShowReceiveId ? (
            <span className={'badge badge-light-primary fs-6 fw-semibold px-4 py-2'}>
              <i className={'fas fa-receipt text-primary me-2'}></i>
              Receive ID : {receiveId}
            </span>
          ) : null}
          <span className={'badge badge-light-info fs-6 fw-semibold px-4 py-2'}>
            <i className={'fas fa-calendar-alt text-info me-2'}></i>
            28/04/2026
          </span>
        </div>
        <div className={'d-flex gap-5'}>
          <div className={'col-md-4'}>
            <select id="eventName" className={'form-select'}>
              <option value="">Select</option>
              <option value="donor">Donor ID</option>
              <option value="mobile">Mobile</option>
              <option value="email">Email</option>
              <option value="aadhar">Aadhar</option>
              <option value="pan">Pan Number</option>
            </select>
          </div>
          <div className={'col-md-8'}>
            <div className={'d-flex gap-3'}>
              <div className={'input-group'}>
                <input
                  type="text"
                  id="donorId"
                  className={'form-control'}
                  placeholder="Donor ID"
                />

                <span className={'input-group-text'}>
                  <i className={'bi bi-search'}></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
