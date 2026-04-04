import React from 'react';
import { bankOptions } from '../data';

interface BankDetailsTabProps {
  selectedBankIds: string[];
  onToggleBank: (bankId: string) => void;
}

export const BankDetailsTab = ({
  selectedBankIds,
  onToggleBank,
}: BankDetailsTabProps) => {
  return (
    <div>
      <div className="text-muted fs-7 mb-4">
        Choose minimum bank(s) for sharing to donor
      </div>
      <div className="table-responsive">
        <table className="table table-rounded table-striped border gy-4 gs-4 align-middle">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800">
              <th>Select</th>
              <th>Bank Name</th>
              <th>Account No.</th>
              <th>Account Type</th>
              <th>IFSC</th>
              <th>Branch</th>
            </tr>
          </thead>
          <tbody>
            {bankOptions.map((bank) => (
              <tr key={bank.id}>
                <td>
                  <div className="form-check form-check-custom">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedBankIds.includes(bank.id)}
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-muted fs-8 mt-3">
        Selected banks count: <strong>{selectedBankIds.length}</strong>
      </div>
    </div>
  );
};
