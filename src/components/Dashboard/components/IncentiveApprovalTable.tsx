import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
import { IncentiveApprovalItem } from './types';

interface IncentiveApprovalTableProps {
  approvals: IncentiveApprovalItem[];
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

export const IncentiveApprovalTable = ({
  approvals,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: IncentiveApprovalTableProps) => {
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
        approval.autoId,
        approval.employeeName,
        approval.type,
        approval.revertTo,
        approval.doe,
        approval.remark,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [approvals, isSearchActive, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredApprovals.length : totalCount;
  const displayPageNumber = isSearchActive ? 1 : pageNumber;
  const totalPages = Math.max(1, Math.ceil(displayTotalCount / pageSize));
  const startRecord =
    displayTotalCount === 0 ? 0 : (displayPageNumber - 1) * pageSize + 1;
  const endRecord =
    displayTotalCount === 0
      ? 0
      : Math.min(displayPageNumber * pageSize, displayTotalCount);
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
    const safeStartPage = Math.max(1, displayPageNumber - 2);
    const safeEndPage = Math.min(totalPages, safeStartPage + 4);
    const adjustedStartPage = Math.max(1, safeEndPage - 4);

    return adjustedStartPage + index;
  });

  return (
    <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
      <div className="card-header pt-3 pb-3">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder fs-3 mb-1">
            Incentive Approval Pending
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
                    <th className="width-10">Auto ID</th>
                    <th className="width-24">Emp Name</th>
                    <th className="width-18">Type</th>
                    <th className="width-14">Revert To</th>
                    <th className="width-18">DOE</th>
                    <th className="width-16">Remark</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApprovals.map((approval, index) => (
                    <tr key={`${approval.autoId}-${approval.employeeName}-${index}`}>
                      <td>{formatValue(approval.autoId)}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          {formatValue(approval.employeeName)}
                        </div>
                      </td>
                      <td>{formatValue(approval.type)}</td>
                      <td>{formatValue(approval.revertTo)}</td>
                      <td>{formatValue(approval.doe)}</td>
                      <td>{formatValue(approval.remark)}</td>
                    </tr>
                  ))}

                  {!filteredApprovals.length && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted fw-bold">
                        No incentive approval records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DashboardPagination
          displayTotalCount={displayTotalCount}
          displayPageNumber={displayPageNumber}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};
