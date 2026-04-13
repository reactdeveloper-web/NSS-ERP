import React from 'react';
import { DepositBank } from '../types';

interface BankDetailsTabProps {
  banks: DepositBank[];
  isLoading: boolean;
  error: string;
  validationError?: string;
  selectedBankIds: string[];
  isViewMode?: boolean;
  onToggleBank: (bankId: string) => void;
}

export const BankDetailsTab = ({
  banks,
  isLoading,
  error,
  validationError,
  selectedBankIds,
  isViewMode = false,
  onToggleBank,
}: BankDetailsTabProps) => {
  return (
    <div>
      <div className="text-muted fs-7 mb-4">
        Choose minimum bank(s) for sharing to donor
      </div>
      <div
        className="table-responsive"
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      >
        <table className="table table-rounded table-striped border gy-4 gs-4 align-middle">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800">
              <th className="sticky-top bg-white">Select</th>
              <th className="sticky-top bg-white">Bank Name</th>
              <th className="sticky-top bg-white">Account No.</th>
              <th className="sticky-top bg-white">Account Type</th>
              <th className="sticky-top bg-white">IFSC</th>
              <th className="sticky-top bg-white">Branch</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-8">
                  Loading bank list...
                </td>
              </tr>
            ) : null}
            {!isLoading && error ? (
              <tr>
                <td colSpan={6} className="text-center text-danger py-8">
                  {error}
                </td>
              </tr>
            ) : null}
            {!isLoading && !error && banks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-8">
                  No banks found.
                </td>
              </tr>
            ) : null}
            {!isLoading && !error
              ? banks.map(bank => (
                  <tr key={bank.id}>
                    <td>
                      <div className="form-check form-check-custom">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedBankIds.includes(bank.id)}
                          disabled={isViewMode}
                          onChange={() => onToggleBank(bank.id)}
                        />
                      </div>
                    </td>
                    <td>{bank.bankName}</td>
                    <td>{bank.accountNo}</td>
                    <td>{bank.accountType}</td>
                    <td>{bank.ifsc}</td>
                    <td>{bank.branch}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className="text-muted fs-8 mt-3">
        Selected banks count: <strong>{selectedBankIds.length}</strong>
      </div>
      {validationError ? (
        <div className="announce-master-field-error mt-2">
          {validationError}
        </div>
      ) : null}
    </div>
  );
};
