import React, { useEffect, useMemo, useState } from 'react';
import { IssueVerificationItem } from './types';

interface IssueVerificationTableProps {
  issues: IssueVerificationItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface IssueVerificationModalProps {
  issue: IssueVerificationItem | null;
  onClose: () => void;
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

const getStatusBadgeClass = (status: string) =>
  status.toLowerCase() === 'yes' ? 'badge-light-success' : 'badge-light-warning';

export const IssueVerificationTable = ({
  issues,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: IssueVerificationTableProps) => {
  const [selectedIssue, setSelectedIssue] =
    useState<IssueVerificationItem | null>(null);
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredIssues = useMemo(() => {
    if (!isSearchActive) {
      return issues;
    }

    return issues.filter(issue =>
      [
        issue.srNo,
        issue.issueDate,
        issue.sadhakName,
        issue.category,
        issue.itemName,
        issue.quantityIssued,
        issue.status,
      ]
        .map(value => String(value ?? ''))
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, issues, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredIssues.length : totalCount;
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
              Issue Verification
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
              onChange={event => setSearch(event.target.value)}
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
                      <th width="8%">Sr No.</th>
                      <th width="12%">Issue Date</th>
                      <th width="18%">Sadhak Name</th>
                      <th width="18%">Category</th>
                      <th width="24%">Item Name</th>
                      <th width="10%">Quantity Issued</th>
                      <th className="text-center" width="10%">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredIssues.map((issue, index) => (
                      <tr
                        key={`${issue.issueId}-${issue.srNo}-${index}`}
                        className="cursor-pointer"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <td>{formatValue(issue.srNo)}</td>
                        <td>{formatValue(issue.issueDate)}</td>
                        <td>{formatValue(issue.sadhakName)}</td>
                        <td>{formatValue(issue.category)}</td>
                        <td>{formatValue(issue.itemName)}</td>
                        <td>
                          {formatValue(issue.quantityIssued)}{' '}
                          {formatValue(issue.unit)}
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge fs-8 fw-bolder ${getStatusBadgeClass(
                              issue.status,
                            )}`}
                          >
                            {formatValue(issue.status)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredIssues.length && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted fw-bold">
                          No issue verification records found.
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

      <IssueVerificationModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </>
  );
};

const IssueVerificationModal = ({
  issue,
  onClose,
}: IssueVerificationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('No');

  useEffect(() => {
    if (!issue) {
      return;
    }

    setStatus(issue.status || 'No');
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [issue]);

  if (!issue) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(onClose, 300);
  };

  return (
    <>
      <div
        className={`dashboard-slide-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={handleClose}
      />
      <aside
        className={`dashboard-slide-modal ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Issue verification detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1">Issue Verification Detail</h4>
            <div className="text-muted fs-7">
              Issue ID: {formatValue(issue.issueId)} | Sr No:{' '}
              {formatValue(issue.srNo)}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-icon btn-active-color-primary"
            aria-label="Close"
            onClick={handleClose}
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>
        </div>

        <div className="dashboard-slide-body">
          <div className="row g-4 mb-5">
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Item Name</label>
              <div className="fw-bold text-dark">{formatValue(issue.itemName)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Issue Date</label>
              <div className="fw-bold text-dark">
                {formatValue(issue.issueDate)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Sadhak Name
              </label>
              <div className="fw-bold text-dark">
                {formatValue(issue.sadhakName)}
              </div>
              <div className="text-muted fs-8">
                Emp ID: {formatValue(issue.empId)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                HandOver / OPD ID
              </label>
              <div className="fw-bold text-dark">
                {formatValue(issue.handedOver)} {formatValue(issue.handOverOpdId)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Category</label>
              <div className="fw-bold text-dark">{formatValue(issue.category)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Quantity Issued
              </label>
              <div className="fw-bold text-dark">
                {formatValue(issue.quantityIssued)} {formatValue(issue.unit)}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="form-label fs-8 text-muted mb-2">
              Issue Verification
            </label>
            <div className="text-dark mb-3">
              Take this item form store to {formatValue(issue.sadhakName)}
            </div>
            <div className="d-flex gap-4">
              <label className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  name="issue-verification-status"
                  checked={status.toLowerCase() === 'yes'}
                  onChange={() => setStatus('Yes')}
                />
                <span className="form-check-label fw-bold">Yes</span>
              </label>
              <label className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  name="issue-verification-status"
                  checked={status.toLowerCase() !== 'yes'}
                  onChange={() => setStatus('No')}
                />
                <span className="form-check-label fw-bold">No</span>
              </label>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle dashboard-bill-modal-table">
              <tbody>
                <tr>
                  <th>Item ID</th>
                  <td>{formatValue(issue.itemId)}</td>
                </tr>
                <tr>
                  <th>RRS ID</th>
                  <td>{formatValue(issue.rrsId)}</td>
                </tr>
                <tr>
                  <th>CM ID</th>
                  <td>{formatValue(issue.raw.CM_ID)}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{formatValue(status)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-slide-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary">
            Save
          </button>
        </div>
      </aside>
    </>
  );
};
