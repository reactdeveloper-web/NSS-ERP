import React, { useEffect, useMemo, useState } from 'react';
import { PaymentTermsVerifyItem } from './types';

interface PaymentTermsVerificationTableProps {
  items: PaymentTermsVerifyItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

interface PaymentTermsVerificationModalProps {
  item: PaymentTermsVerifyItem | null;
  onClose: () => void;
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

const getStatusText = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (['approve', 'approval', 'approved', 'yes', 'y'].includes(normalizedStatus)) {
    return 'Approve';
  }

  if (['close', 'closed', 'c'].includes(normalizedStatus)) {
    return 'Close';
  }

  return 'Pending';
};

const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = getStatusText(status).toLowerCase();

  if (normalizedStatus === 'approve') {
    return 'badge-light-success';
  }

  if (normalizedStatus === 'close') {
    return 'badge-light-dark';
  }

  return 'badge-light-warning';
};

export const PaymentTermsVerificationTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: PaymentTermsVerificationTableProps) => {
  const [selectedItem, setSelectedItem] =
    useState<PaymentTermsVerifyItem | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredItems = useMemo(() => {
    if (!isSearchActive) {
      return items;
    }

    return items.filter(item =>
      [
        item.qcsAppCode,
        item.poId,
        item.quotationNo,
        item.vendorName,
        item.paymentTerm,
        item.payDate,
        item.amount,
        item.status,
        getStatusText(item.status),
        getStatusText(item.status) === 'Approve' ? 'Approval' : '',
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, items, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredItems.length : totalCount;
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
              Payment Terms Verification
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
                      <th width="10%">App. OT. No.</th>
                      <th width="12%">Quotation No.</th>
                      <th width="24%">Vendor Name</th>
                      <th width="18%">Payment Term</th>
                      <th width="12%">Pay Date</th>
                      <th className="text-end" width="12%">
                        Amount
                      </th>
                      <th className="text-center" width="12%">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={`${item.qcsAppCode}-${item.autoId}-${index}`}>
                        <td>{formatValue(item.qcsAppCode)}</td>
                        <td>{formatValue(item.quotationNo)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(item.vendorName)}
                          </div>
                        </td>
                        <td>{formatValue(item.paymentTerm)}</td>
                        <td>{formatValue(item.payDate)}</td>
                        <td className="text-end">{formatValue(item.amount)}</td>
                        <td className="text-center">
                          <span
                            className={`badge fs-8 fw-bolder ${getStatusBadgeClass(
                              item.status,
                            )}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredItems.length && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted fw-bold">
                          No payment terms verification records found.
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

      <PaymentTermsVerificationModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};

const PaymentTermsVerificationModal = ({
  item,
  onClose,
}: PaymentTermsVerificationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [remark, setRemark] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');

  useEffect(() => {
    if (!item) {
      return;
    }

    setStatus(getStatusText(item.status));
    setRemark(item.remark || '');
    setAdvanceAmount('');
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [item]);

  if (!item) {
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
        aria-label="Payment terms verification detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1 dashboard-panel-title fs-3">
              Payment Terms Verification
            </h4>
            <div className="text-primary mt-1 fs-6">
              App. OT. No: {formatValue(item.qcsAppCode)}
              <span className="mx-5">
                PO No: {formatValue(item.poId || item.qcsAppCode)}
              </span>
            </div>
            <div className="text-muted mt-1 fw-bold fs-6">
              {formatValue(item.vendorName)}
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

        <div className="dashboard-slide-body dashboard-bill-panel-body">
          <section className="card p-4 mb-3 border">
            <div className="row g-4">
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Quotation No.</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(item.quotationNo)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Pay Date</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(item.payDate)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Payment Term</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(item.paymentTerm)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Payment Type</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(item.paymentType)}
                </div>
              </div>
              <div className="col-12">
                <div className="dashboard-bill-label">Scope of Work</div>
                <div className="dashboard-bill-text">
                  {formatValue(item.scopeOfWork)}
                </div>
              </div>
              <div className="col-12">
                <div className="dashboard-bill-amount-strip rounded fs-5">
                  <span>Amount</span>
                  <strong className="fs-3">{formatValue(item.amount)}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-bill-workflow">
            <h5 className="dashboard-bill-workflow-title">To Be Verified</h5>
            <div className="dashboard-bill-workflow-line">
              {item.verifyTermsList.length ? (
                item.verifyTermsList.map(term => (
                  <article
                    key={`${term.amcSrno}-${term.srno}`}
                    className="dashboard-bill-workflow-card is-active"
                  >
                    <span className="dashboard-bill-workflow-dot" />
                    <div className="dashboard-bill-workflow-header">
                      <h6>Work / Purchase Dtl.</h6>
                      <span>{formatValue(term.workComplete)}</span>
                    </div>
                    <p>{formatValue(term.maintenanceDesc)}</p>
                    <div className="dashboard-bill-workflow-footer">
                      Remark: {formatValue(term.maintenanceRemark)}
                    </div>
                  </article>
                ))
              ) : (
                <article className="dashboard-bill-workflow-card is-pending">
                  <span className="dashboard-bill-workflow-dot" />
                  <div className="dashboard-bill-workflow-header">
                    <h6>Work / Purchase Dtl.</h6>
                    <span>-</span>
                  </div>
                  <p>No verification terms available.</p>
                </article>
              )}
            </div>
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Over All Status</h5>
            <textarea
              className="form-control mb-3"
              rows={4}
              value={remark}
              onChange={event => setRemark(event.target.value)}
              placeholder="Remark show to account dept in advance"
            />
            <div className="d-flex gap-3 flex-wrap mb-4">
              {['Approve', 'Pending', 'Close'].map(option => (
                <button
                  key={option}
                  type="button"
                  className={`btn ${
                    status === option ? 'btn-secondary' : 'btn-light'
                  }`}
                  onClick={() => setStatus(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="row g-3 align-items-center">
              <div className="col-sm-3">
                <div className="dashboard-bill-label mb-0">Adv. Amount</div>
              </div>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  value={advanceAmount}
                  onChange={event => setAdvanceAmount(event.target.value)}
                />
              </div>
              <div className="col-12">
                <input type="file" className="form-control" />
              </div>
            </div>
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Attachments &amp; Links</h5>
            <div className="dashboard-bill-link-list">
              <a
                className="dashboard-bill-link-item"
                href={item.orderLink || '#'}
                target={item.orderLink ? '_blank' : undefined}
                rel={item.orderLink ? 'noreferrer' : undefined}
              >
                <div className="dashboard-bill-link-icon">
                  <i className="fa fa-file-text-o" aria-hidden="true" />
                </div>
                <div className="dashboard-bill-link-content">
                  <p>Purchase / Work Order</p>
                  <span>{formatValue(item.orderLink || 'Not Available')}</span>
                </div>
                <i className="fa fa-external-link" aria-hidden="true" />
              </a>
              <div className="dashboard-bill-payment-status">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-check-circle" aria-hidden="true" />
                  <span>Current Status</span>
                </div>
                <span className="dashboard-bill-payment-pill">{status}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-slide-footer dashboard-bill-action-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Close
          </button>
          <button type="button" className="btn btn-light-primary">
            WO seal and sign copy
          </button>
          <button type="button" className="btn btn-light-info">
            TS seal and sign copy
          </button>
          <button type="button" className="btn nssBtnColor text-white">
            Account Status
          </button>
        </div>
      </aside>
    </>
  );
};
