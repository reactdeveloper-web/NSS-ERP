import React, { useMemo, useState } from 'react';
import { BranchApprovalItem } from './types';

interface BranchApprovalTableProps {
  approvals: BranchApprovalItem[];
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

const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'y' || normalizedStatus === 'yes') {
    return 'badge-light-success';
  }

  if (normalizedStatus === 'n' || normalizedStatus === 'pending') {
    return 'badge-light-warning';
  }

  return 'badge-light-secondary';
};

const getStatusText = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'y') {
    return 'Yes';
  }

  if (normalizedStatus === 'n') {
    return 'Pending';
  }

  return status || '-';
};

export const BranchApprovalTable = ({
  approvals,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: BranchApprovalTableProps) => {
  const [localSearch, setLocalSearch] = useState('');
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredApprovals = useMemo(() => {
    if (!isSearchActive) {
      return approvals;
    }

    return approvals.filter(approval =>
      [
        approval.code,
        approval.sadhakId,
        approval.letterId,
        approval.name,
        approval.detail,
        getStatusText(approval.status),
      ]
        .map(value => String(value ?? ''))
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [approvals, isSearchActive, normalizedSearch]);
  const displayTotalCount = isSearchActive
    ? filteredApprovals.length
    : totalCount;
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
              Branch Approval Pending
            </span>
            <span className="text-muted mt-1 fw-bold fs-7">
              {displayTotalCount} records
            </span>
          </h3>
          <div className="card-toolbar  m-0">
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
                      <th className='width-10'>Code</th>
                      <th className='width-12'>Sadhak ID</th>
                      <th className='width-12'>Letter ID</th>
                      <th className='width-20'>Name</th>
                      <th className='width-34'>Details</th>
                      <th className="text-center width-12">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApprovals.map((approval, index) => (
                      <tr key={`${approval.letterId}-${approval.sadhakId}-${index}`}>
                        <td>{formatValue(approval.code)}</td>
                        <td>{formatValue(approval.sadhakId)}</td>
                        <td>{formatValue(approval.letterId)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(approval.name)}
                          </div>
                        </td>
                        <td>{formatValue(approval.detail)}</td>
                        <td className="text-center">
                          <span
                            className={`badge fs-8 fw-bolder ${getStatusBadgeClass(
                              approval.status,
                            )}`}
                          >
                            {formatValue(getStatusText(approval.status))}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredApprovals.length && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted fw-bold">
                          No branch approval records found.
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
                onChange={event => {
                  onPageSizeChange(Number(event.target.value));
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
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
