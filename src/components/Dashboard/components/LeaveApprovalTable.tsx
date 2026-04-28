import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
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

type LeaveSanctionStatus = 'Yes' | 'No';

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
  const [selectedSanctionById, setSelectedSanctionById] = useState<
    Record<string, LeaveSanctionStatus | ''>
  >({});
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    rowId: string;
    status: LeaveSanctionStatus;
  } | null>(null);
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredLeaves = useMemo(() => {
    if (!isSearchActive) {
      return leaves;
    }

    return leaves.filter(leave =>
      [
        leave.leaveId,
        leave.empNum,
        leave.sadhakName,
        leave.department,
        leave.leaveDay,
        leave.chargeGiven,
        leave.applied,
        leave.fromDate,
        leave.toDate,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, leaves, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredLeaves.length : totalCount;
  const displayPageNumber = isSearchActive ? 1 : pageNumber;
  const setRowSanction = (rowId: string, status: LeaveSanctionStatus) => {
    setSelectedSanctionById(current => ({
      ...current,
      [rowId]: current[rowId] === status ? '' : status,
    }));
  };
  const handleSanctionChange = (
    rowId: string,
    status: LeaveSanctionStatus,
    selectedSanction: LeaveSanctionStatus | '',
  ) => {
    if (selectedSanction === status) {
      setRowSanction(rowId, status);
      return;
    }

    setPendingConfirmation({ rowId, status });
  };
  const confirmationTitle =
    pendingConfirmation?.status === 'Yes'
      ? 'Confirm accept'
      : 'Confirm reject';
  const confirmationMessage =
    pendingConfirmation?.status === 'Yes'
      ? 'Are you sure you want to accept this leave?'
      : 'Are you sure you are not accept leave?';
  const confirmationButtonText =
    pendingConfirmation?.status === 'Yes' ? 'Accept' : 'Reject';
  const confirmationButtonClass =
    pendingConfirmation?.status === 'Yes'
      ? 'swal2-confirm swal2-styled'
      : 'swal2-confirm swal2-styled btn-danger';

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
                      <th className="width-10">Leave Id</th>
                      <th className="width-22">Sadhak Detail</th>
                      <th className="width-14">Department</th>
                      <th className="width-10">Day</th>
                      <th className="width-16">ChargesTo</th>
                      <th className="width-10">Apply</th>
                      <th className="text-center width-18">Leave Sanction</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeaves.map((leave, index) => {
                      const rowId = String(leave.leaveId || `${leave.empNum}-${index}`);
                      const selectedSanction = selectedSanctionById[rowId] || '';

                      return (
                        <tr key={rowId}>
                          <td>{formatValue(leave.leaveId)}</td>
                          <td>
                            <div className="fw-bold text-dark">
                              {formatValue(leave.sadhakName)}
                            </div>
                            <span className="text-muted fs-7">
                              {formatValue(leave.empNum)}
                            </span>
                          </td>
                          <td>{formatValue(leave.department)}</td>
                          <td>{formatValue(leave.leaveDay)}</td>
                          <td>{formatValue(leave.chargeGiven)}</td>
                          <td>{formatValue(leave.applied)}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-4">
                              <label className="form-check form-check-sm form-check-custom form-check-solid mb-0">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedSanction === 'Yes'}
                                  onChange={() =>
                                    handleSanctionChange(
                                      rowId,
                                      'Yes',
                                      selectedSanction,
                                    )
                                  }
                                />
                                <span className="form-check-label fw-bold">Yes</span>
                              </label>
                              <label className="form-check form-check-sm form-check-custom form-check-solid mb-0">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedSanction === 'No'}
                                  onChange={() =>
                                    handleSanctionChange(
                                      rowId,
                                      'No',
                                      selectedSanction,
                                    )
                                  }
                                />
                                <span className="form-check-label fw-bold">No</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {!filteredLeaves.length && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted fw-bold">
                          No leave records found.
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

      {pendingConfirmation && (
        <div className="swal2-container swal2-center swal2-backdrop-show">
          <div
            className="swal2-popup swal2-modal login-error-popup swal2-show"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-confirm-title"
            aria-describedby="leave-confirm-message"
          >
            <div className="swal2-icon swal2-warning swal2-icon-show d-flex align-items-center justify-content-center">
              <div className="swal2-icon-content">!</div>
            </div>
            <h2 id="leave-confirm-title" className="swal2-title">
              {confirmationTitle}
            </h2>
            <div id="leave-confirm-message" className="swal2-html-container">
              {confirmationMessage}
            </div>
            <div className="swal2-actions">
              <button
                type="button"
                className={confirmationButtonClass}
                onClick={() => {
                  setRowSanction(
                    pendingConfirmation.rowId,
                    pendingConfirmation.status,
                  );
                  setPendingConfirmation(null);
                }}
              >
                {confirmationButtonText}
              </button>
              <button
                type="button"
                className="swal2-cancel swal2-styled"
                onClick={() => setPendingConfirmation(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
