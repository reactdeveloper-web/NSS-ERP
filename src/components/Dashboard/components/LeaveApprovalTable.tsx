import React, { useMemo, useState } from 'react';
import { LeaveApprovalItem } from './types';

interface LeaveApprovalTableProps {
  leaves: LeaveApprovalItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

const getSanctionText = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  if (['y', 'yes', 'approve', 'approved', 'a'].includes(normalizedValue)) {
    return 'Yes';
  }

  return 'No';
};

export const LeaveApprovalTable = ({
  leaves,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: LeaveApprovalTableProps) => {
  const [localSearch, setLocalSearch] = useState('');
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredLeaves = useMemo(() => {
    if (!isSearchActive) {
      return leaves;
    }

    return leaves.filter(leave =>
      [
        leave.sadhakName,
        leave.applyDate,
        leave.fromDate,
        leave.toDate,
        leave.applied,
        leave.leaveType,
        leave.leaveDay,
        leave.chargeGiven,
        getSanctionText(leave.sanction),
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, leaves, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredLeaves.length : totalCount;
  const displayPageNumber = isSearchActive ? 1 : pageNumber;
  const totalPages = Math.max(1, Math.ceil(displayTotalCount / pageSize));
  const startRecord =
    displayTotalCount === 0 ? 0 : (displayPageNumber - 1) * pageSize + 1;
  const endRecord =
    displayTotalCount === 0
      ? 0
      : Math.min(displayPageNumber * pageSize, displayTotalCount);
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const safeStartPage = Math.max(1, displayPageNumber - 2);
      const safeEndPage = Math.min(totalPages, safeStartPage + 4);
      const adjustedStartPage = Math.max(1, safeEndPage - 4);

      return adjustedStartPage + index;
    },
  );

  return (
    <>
      <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
        <div className="card-header pt-3 pb-3">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">
              Leave or Tour Records
            </span>
            <span className="text-muted mt-1 fw-bold fs-7">
              {displayTotalCount} records
            </span>
          </h3>
          <div className="card-toolbar m-0">
            <input
              type="text"
              className="form-control form-control-sm form-control-solid w-250px"
              placeholder="Advance Search"
              value={search}
              onChange={event => {
                setLocalSearch(event.target.value);
                onSearchChange?.(event.target.value);
              }}
            />
          </div>
        </div>

        <div className="card-body py-3 dashboard-listing-body">
          {loading ? (
            <div className="text-muted fw-bold">Loading...</div>
          ) : (
            <div className="dashboard-listing-content">
              <div className="table-responsive stickyTable dashboard-listing-table">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4 dashboard-task-detail-table">
                  <thead>
                    <tr className="fw-bolder text-muted">
                      <th className='width-18'>Sadhak Name</th>
                      <th className='width-12'>Apply Date</th>
                      <th className='width-16'>Apply From - To</th>
                      <th className='width-9'>Applied</th>
                      <th className='width-14'>Leave Type</th>
                      <th className='width-11'>Leave Day</th>
                      <th className='width-14'>Charge Given</th>
                      <th className='width-6'>Sanction</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeaves.map((leave, index) => (
                      <tr key={`${leave.leaveId}-${index}`}>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(leave.sadhakName)}
                          </div>
                        </td>
                        <td>{formatValue(leave.applyDate)}</td>
                        <td>
                          {formatValue(leave.fromDate)} To {formatValue(leave.toDate)}
                        </td>
                        <td>{formatValue(leave.applied)}</td>
                        <td>{formatValue(leave.leaveType)}</td>
                        <td>{formatValue(leave.leaveDay)}</td>
                        <td>{formatValue(leave.chargeGiven)}</td>
                        <td>
                          <span
                            className={`badge fs-8 fw-bolder ${
                              getSanctionText(leave.sanction) === 'Yes'
                                ? 'badge-light-success'
                                : 'badge-light-warning'
                            }`}
                          >
                            {getSanctionText(leave.sanction)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredLeaves.length && (
                      <tr>
                        <td colSpan={8} className="text-center text-muted fw-bold">
                          No leave records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="d-flex flex-stack flex-wrap pt-5 mt-auto">
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted fs-7">Show</span>
              <select
                className="form-select form-select-sm form-select-solid w-100px"
                value={pageSize}
                onChange={event => onPageSizeChange(Number(event.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-muted fs-7">per page</span>
            </div>

            <div className="d-flex align-items-center gap-4">
              <span className="text-muted fs-7">
                Showing {startRecord} to {endRecord} of {displayTotalCount}
              </span>
              <ul className="pagination pagination-circle pagination-outline mb-0">
                <li
                  className={`page-item ${
                    displayPageNumber === 1 ? 'disabled' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      onPageChange(Math.max(1, displayPageNumber - 1))
                    }
                  >
                    &laquo;
                  </button>
                </li>
                {pageNumbers.map(page => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === displayPageNumber ? 'active' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    displayPageNumber >= totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      onPageChange(Math.min(totalPages, displayPageNumber + 1))
                    }
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
