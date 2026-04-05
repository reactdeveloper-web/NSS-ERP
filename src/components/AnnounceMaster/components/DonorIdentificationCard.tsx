import React from 'react';
import { DonorIdentificationForm, DonorSearchResult } from '../types';

const donorSearchOptions = [
  { value: 'donorId', label: 'Donor ID' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'email', label: 'Email' },
  { value: 'aadhaar', label: 'Aadhaar' },
  { value: 'pan', label: 'PAN Number' },
];

interface DonorIdentificationCardProps {
  form: DonorIdentificationForm;
  isSearching: boolean;
  searchError: string;
  donorOptions: DonorSearchResult[];
  showDonorModal: boolean;
  onChange: <K extends keyof DonorIdentificationForm>(
    field: K,
    value: DonorIdentificationForm[K],
  ) => void;
  onSelectDonor: (donor: DonorSearchResult) => void;
  onCloseDonorModal: () => void;
}

export const DonorIdentificationCard = ({
  form,
  isSearching,
  searchError,
  donorOptions,
  showDonorModal,
  onChange,
  onSelectDonor,
  onCloseDonorModal,
}: DonorIdentificationCardProps) => {
  return (
    <>
      <div className="card card-flush h-xl-100">
        <div className="card-header border-bottom mb-4">
          <div className="card-title d-flex w-100 justify-content-between">
            <h3 className="fw-bold mb-0">Donor Identification</h3>
          </div>
        </div>

        <div className="card-body pt-2">
          <input type="hidden" value="" />

          <div className="row g-5">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  id="announceDate"
                  type="date"
                  className="form-control form-control-solid"
                  placeholder=" "
                  value={form.announceDate}
                  readOnly
                />
                <label htmlFor="announceDate">Date</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <input
                  id="callingSadhak"
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=" "
                  value={form.callingSadhak}
                  readOnly
                />
                <label htmlFor="callingSadhak">Calling Sadhak</label>
              </div>
            </div>

            <div className="col-md-12 position-relative">
              <div className="d-flex gap-3">
                <div className="form-floating" style={{ maxWidth: '170px', minWidth: '170px' }}>
                  <select
                    id="donorSearchType"
                    className="form-select"
                    value={form.donorSearchType}
                    onChange={(event) =>
                      onChange('donorSearchType', event.target.value)
                    }
                  >
                    {donorSearchOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="donorSearchType">Search By</label>
                </div>
                <div className="form-floating flex-grow-1">
                  <input
                    id="donorSearchValue"
                    type="text"
                    className="form-control"
                    placeholder=" "
                    value={form.donorId}
                    onChange={(event) => onChange('donorId', event.target.value)}
                  />
                  <label htmlFor="donorSearchValue">
                    {`Type ${
                      donorSearchOptions.find(
                        (option) => option.value === form.donorSearchType,
                      )?.label ?? 'Donor ID'
                    }`}
                  </label>
                </div>
                {isSearching ? (
                  <div className="d-flex align-items-center px-2 flex-shrink-0">
                    <span
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                      aria-label="Searching donor"
                    />
                  </div>
                ) : null}
              </div>
              {searchError ? (
                <div className="text-danger fs-7 mt-0 position-absolute e-0">{searchError}</div>
              ) : null}
            </div>

          
          </div>

          <div className="separator separator-dashed my-6"></div>

          <div className="d-flex flex-wrap gap-5">
            <label className="form-check form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={form.urgentFollowup}
                onChange={(event) =>
                  onChange('urgentFollowup', event.target.checked)
                }
              />
              <span className="form-check-label fw-semibold">
                Urgent Follow-up Needed
              </span>
            </label>

            <label className="form-check form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={form.followupNotRequired}
                onChange={(event) =>
                  onChange('followupNotRequired', event.target.checked)
                }
              />
              <span className="form-check-label fw-semibold">
                Follow-up Not Required
              </span>
            </label>
          </div>
        </div>
      </div>
      {showDonorModal ? (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header p-4">
                  <h4 className="modal-title">Multiple Donor IDs Found</h4>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onCloseDonorModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="text-muted fs-7 mb-4">
                    Select the donor ID you want to use for this mobile number.
                  </div>
                  <div className="table-responsive" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    <table className="table table-row-bordered align-middle">
                      <thead>
                        <tr className="fw-bold text-gray-800">
                          <th>Donor ID</th>
                          <th>Name</th>
                          <th>Mobile</th>
                          <th>Email</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donorOptions.map((donor) => (
                          <tr key={`${donor.donorId}-${donor.mobileNo}`}>
                            <td>{donor.donorId || '-'}</td>
                            <td>{donor.donorName || '-'}</td>
                            <td>{donor.mobileNo || '-'}</td>
                            <td>{donor.email || '-'}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => onSelectDonor(donor)}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={onCloseDonorModal} />
        </>
      ) : null}
    </>
  );
};
