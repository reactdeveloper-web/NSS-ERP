import React, { useEffect, useMemo, useState } from 'react';
import { BranchApprovalItem } from './types';

interface BranchApprovalTableProps {
  approvals: BranchApprovalItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface BranchApprovalModalProps {
  approval: BranchApprovalItem | null;
  onClose: () => void;
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

const normalizeFileUrl = (path: string) =>
  path
    .replace(/\\/g, '/')
    .replace(/^http:\/*/i, 'http://')
    .replace(/^https:\/*/i, 'https://');

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
}: BranchApprovalTableProps) => {
  const [selectedApproval, setSelectedApproval] =
    useState<BranchApprovalItem | null>(null);
  const [search, setSearch] = useState('');
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
                      <th width="10%">Code</th>
                      <th width="12%">Sadhak ID</th>
                      <th width="12%">Letter ID</th>
                      <th width="20%">Name</th>
                      <th width="34%">Details</th>
                      <th className="text-center" width="12%">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApprovals.map((approval, index) => (
                      <tr
                        key={`${approval.letterId}-${approval.sadhakId}-${index}`}
                        className="cursor-pointer"
                        onClick={() => setSelectedApproval(approval)}
                      >
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

      <BranchApprovalModal
        approval={selectedApproval}
        onClose={() => setSelectedApproval(null)}
      />
    </>
  );
};

const BranchApprovalModal = ({
  approval,
  onClose,
}: BranchApprovalModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('N');
  const [amount, setAmount] = useState('0');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (!approval) {
      return;
    }

    setStatus(approval.status || 'N');
    setAmount(String(approval.amountApproved || '0'));
    setRemark(approval.remark || '');
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [approval]);

  if (!approval) {
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
        aria-label="Branch approval detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1">Branch Approval Detail</h4>
            <div className="text-muted fs-7">
              Code: {formatValue(approval.code)} | Letter ID:{' '}
              {formatValue(approval.letterId)}
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
              <label className="form-label fs-8 text-muted mb-1">Code</label>
              <div className="fw-bold text-dark">
                {formatValue(approval.code)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Sadhak ID / Letter ID
              </label>
              <div className="fw-bold text-dark">
                {formatValue(approval.sadhakId)} /{' '}
                {formatValue(approval.letterId)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Name</label>
              <div className="fw-bold text-dark">
                {formatValue(approval.name)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Detail</label>
              <div className="fw-bold text-dark">
                {formatValue(approval.detail)}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="form-label fs-8 text-muted mb-2">View Files</label>
            {approval.fileList.length ? (
              <div className="d-flex flex-column gap-2">
                {approval.fileList.map((file, index) => (
                  <a
                    key={`${file.imagePath}-${index}`}
                    href={normalizeFileUrl(file.imagePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-hover-primary"
                  >
                    View File {index + 1}
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-muted fs-7">No files available.</div>
            )}
          </div>

          <div className="mb-5">
            <label className="form-label fs-8 text-muted mb-2">Approval</label>
            <div className="d-flex gap-3 flex-wrap">
              <label className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  name="branch-approval-status"
                  checked={status === 'N'}
                  onChange={() => setStatus('N')}
                />
                <span className="form-check-label fw-bold">No</span>
              </label>
              <label className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  name="branch-approval-status"
                  checked={status === 'Y'}
                  onChange={() => setStatus('Y')}
                />
                <span className="form-check-label fw-bold">Yes</span>
              </label>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Amount</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={amount}
                onChange={event => setAmount(event.target.value)}
              />
            </div>
            <div className="col-sm-12">
              <label className="form-label fs-8 text-muted mb-1">Remark</label>
              <textarea
                className="form-control form-control-sm"
                rows={4}
                value={remark}
                onChange={event => setRemark(event.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle dashboard-bill-modal-table">
              <tbody>
                <tr>
                  <th>Approve By</th>
                  <td>
                    {formatValue(approval.approveByName)} (
                    {formatValue(approval.approveBy)})
                  </td>
                </tr>
                <tr>
                  <th>Voucher Code</th>
                  <td>{formatValue(approval.voucherCode)}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{formatValue(getStatusText(status))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-slide-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save
          </button>
        </div>
      </aside>
    </>
  );
};
