import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
import { TourApprovalItem } from './types';

interface TourApprovalTableProps {
  items: TourApprovalItem[];
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

type TourApprovalRemark = 'Yes' | 'No';

export const TourApprovalTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: TourApprovalTableProps) => {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedRemarkById, setSelectedRemarkById] = useState<
    Record<string, TourApprovalRemark | ''>
  >({});
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    rowId: string;
    remark: TourApprovalRemark;
  } | null>(null);
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredItems = useMemo(() => {
    if (!isSearchActive) {
      return items;
    }

    return items.filter(item =>
      [
        item.tourId,
        item.empId,
        item.empName,
        item.chargesTo,
        item.department,
        item.fromDate,
        item.toDate,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, items, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredItems.length : totalCount;
  const displayPageNumber = isSearchActive ? 1 : pageNumber;

  const setRowRemark = (rowId: string, remark: TourApprovalRemark) => {
    setSelectedRemarkById(current => ({
      ...current,
      [rowId]: current[rowId] === remark ? '' : remark,
    }));
  };
  const handleRemarkChange = (
    rowId: string,
    remark: TourApprovalRemark,
    selectedRemark: TourApprovalRemark | '',
  ) => {
    if (selectedRemark === remark) {
      setRowRemark(rowId, remark);
      return;
    }

    setPendingConfirmation({ rowId, remark });
  };
  const confirmationTitle =
    pendingConfirmation?.remark === 'Yes'
      ? 'Confirm accept'
      : 'Confirm reject';
  const confirmationMessage =
    pendingConfirmation?.remark === 'Yes'
      ? 'Are you sure you want to accept this tour approval?'
      : 'Are you sure you are not accept tour approval?';
  const confirmationButtonText =
    pendingConfirmation?.remark === 'Yes' ? 'Accept' : 'Reject';
  const confirmationButtonClass =
    pendingConfirmation?.remark === 'Yes'
      ? 'swal2-confirm swal2-styled'
      : 'swal2-confirm swal2-styled btn-danger';

  return (
    <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
      <div className="card-header pt-3 pb-3">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder fs-3 mb-1">
            Tour Approval Pending
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
                    <th className="width-10">Tour Id</th>
                    <th className="width-10">Emp Id</th>
                    <th className="width-18">Emp Name</th>
                    <th className="width-16">Charges To</th>
                    <th className="width-14">Department</th>
                    <th className="width-12">From Date</th>
                    <th className="width-12">To Date</th>
                    <th className="text-center width-14">Remark</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => {
                    const rowId = String(item.tourId || `${item.empId}-${index}`);
                    const selectedRemark = selectedRemarkById[rowId] || '';

                    return (
                      <tr key={rowId}>
                        <td>{formatValue(item.tourId)}</td>
                        <td>{formatValue(item.empId)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(item.empName)}
                          </div>
                        </td>
                        <td>{formatValue(item.chargesTo)}</td>
                        <td>{formatValue(item.department)}</td>
                        <td>{formatValue(item.fromDate)}</td>
                        <td>{formatValue(item.toDate)}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-4">
                            <label className="form-check form-check-sm form-check-custom form-check-solid mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedRemark === 'Yes'}
                                onChange={() =>
                                  handleRemarkChange(rowId, 'Yes', selectedRemark)
                                }
                              />
                              <span className="form-check-label fw-bold">Yes</span>
                            </label>
                            <label className="form-check form-check-sm form-check-custom form-check-solid mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedRemark === 'No'}
                                onChange={() =>
                                  handleRemarkChange(rowId, 'No', selectedRemark)
                                }
                              />
                              <span className="form-check-label fw-bold">No</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {!filteredItems.length && (
                    <tr>
                      <td colSpan={8} className="text-center text-muted fw-bold">
                        No tour approval records found.
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
      {pendingConfirmation && (
        <div className="swal2-container swal2-center swal2-backdrop-show">
          <div
            className="swal2-popup swal2-modal login-error-popup swal2-show"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-approval-confirm-title"
            aria-describedby="tour-approval-confirm-message"
          >
            <div className="swal2-icon swal2-warning swal2-icon-show d-flex align-items-center justify-content-center">
              <div className="swal2-icon-content">!</div>
            </div>
            <h2 id="tour-approval-confirm-title" className="swal2-title">
              {confirmationTitle}
            </h2>
            <div id="tour-approval-confirm-message" className="swal2-html-container">
              {confirmationMessage}
            </div>
            <div className="swal2-actions">
              <button
                type="button"
                className={confirmationButtonClass}
                onClick={() => {
                  setRowRemark(
                    pendingConfirmation.rowId,
                    pendingConfirmation.remark,
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
    </div>
  );
};
