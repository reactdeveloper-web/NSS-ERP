import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
import { ChargeAcceptItem } from './types';

interface ChargeAcceptTableProps {
  items: ChargeAcceptItem[];
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

type ChargeAcceptStatus = 'Yes' | 'No';

export const ChargeAcceptTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: ChargeAcceptTableProps) => {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedStatusById, setSelectedStatusById] = useState<
    Record<string, ChargeAcceptStatus | ''>
  >({});
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    rowId: string;
    status: ChargeAcceptStatus;
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
        item.employeeName,
        item.department,
        item.dayType,
        item.category,
        item.fromDate,
        item.toDate,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [items, isSearchActive, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredItems.length : totalCount;
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

  const setRowStatus = (rowId: string, status: ChargeAcceptStatus) => {
    setSelectedStatusById(current => ({
      ...current,
      [rowId]: current[rowId] === status ? '' : status,
    }));
  };
  const handleStatusChange = (
    rowId: string,
    status: ChargeAcceptStatus,
    selectedStatus: ChargeAcceptStatus | '',
  ) => {
    if (selectedStatus === status) {
      setRowStatus(rowId, status);
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
      ? 'Are you sure you want to accept this charge?'
      : 'Are you sure you are not accept charge?';
  const confirmationButtonText =
    pendingConfirmation?.status === 'Yes' ? 'Accept' : 'Reject';
  const confirmationButtonClass =
    pendingConfirmation?.status === 'Yes'
      ? 'swal2-confirm swal2-styled'
      : 'swal2-confirm swal2-styled btn-danger';

  return (
    <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
      <div className="card-header pt-3 pb-3">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder fs-3 mb-1">
            Charge Accept Pending
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
                    <th className="width-24">EName</th>
                    <th className="width-16">Department</th>
                    <th className="width-16">Category</th>
                    <th className="width-12">Day</th>
                    <th className="width-12">From Date</th>
                    <th className="width-12">To Date</th>
                    <th className="text-center width-18">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => {
                    const rowId = String(item.id || `${item.employeeName}-${index}`);
                    const selectedStatus = selectedStatusById[rowId] || '';

                    return (
                      <tr key={rowId}>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(item.employeeName)}
                          </div>
                        </td>
                        <td>{formatValue(item.department)}</td>
                        <td>{formatValue(item.category)}</td>
                        <td>{formatValue(item.dayType)}</td>
                        <td>{formatValue(item.fromDate)}</td>
                        <td>{formatValue(item.toDate)}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-4">
                            <label className="form-check form-check-sm form-check-custom form-check-solid mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedStatus === 'Yes'}
                                onChange={() =>
                                  handleStatusChange(rowId, 'Yes', selectedStatus)
                                }
                              />
                              <span className="form-check-label fw-bold">Yes</span>
                            </label>
                            <label className="form-check form-check-sm form-check-custom form-check-solid mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedStatus === 'No'}
                                onChange={() =>
                                  handleStatusChange(rowId, 'No', selectedStatus)
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
                      <td colSpan={7} className="text-center text-muted fw-bold">
                        No charge accept records found.
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
            aria-labelledby="charge-accept-confirm-title"
            aria-describedby="charge-accept-confirm-message"
          >
            <div className="swal2-icon swal2-warning swal2-icon-show d-flex align-items-center justify-content-center">
              <div className="swal2-icon-content">!</div>
            </div>
            <h2 id="charge-accept-confirm-title" className="swal2-title">
              {confirmationTitle}
            </h2>
            <div id="charge-accept-confirm-message" className="swal2-html-container">
              {confirmationMessage}
            </div>
            <div className="swal2-actions">
              <button
                type="button"
                className={confirmationButtonClass}
                onClick={() => {
                  setRowStatus(
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
    </div>
  );
};
