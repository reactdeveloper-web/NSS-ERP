import React, { useEffect, useMemo, useState } from 'react';
import { WorkOrderItem } from './types';

interface WorkOrderApprovalTableProps {
  orders: WorkOrderItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

interface WorkOrderModalProps {
  order: WorkOrderItem | null;
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

const VendorStack = ({ order }: { order: WorkOrderItem }) => (
  <div className="d-flex flex-column gap-1">
    <span>{formatValue(order.vendorName1)}</span>
    {order.vendorName2 ? <span>{formatValue(order.vendorName2)}</span> : null}
    {order.vendorName3 ? <span>{formatValue(order.vendorName3)}</span> : null}
  </div>
);

const AmountStack = ({ order }: { order: WorkOrderItem }) => (
  <div className="d-flex flex-column gap-1 text-end">
    <span>{formatValue(order.netAmount1)}</span>
    {Number(order.netAmount2 || 0) ? <span>{formatValue(order.netAmount2)}</span> : null}
    {Number(order.netAmount3 || 0) ? <span>{formatValue(order.netAmount3)}</span> : null}
  </div>
);

export const WorkOrderApprovalTable = ({
  orders,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: WorkOrderApprovalTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<WorkOrderItem | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredOrders = useMemo(() => {
    if (!isSearchActive) {
      return orders;
    }

    return orders.filter(order =>
      [
        order.orderNo,
        order.date,
        order.createdBy,
        order.vendorName1,
        order.vendorName2,
        order.vendorName3,
        order.netAmount1,
        order.netAmount2,
        order.netAmount3,
        order.closeRenewed,
        order.contractType,
        order.place,
        order.status,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, normalizedSearch, orders]);
  const displayTotalCount = isSearchActive ? filteredOrders.length : totalCount;
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
              Work Order Approval
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
                      <th width="10%">Order No</th>
                      <th width="12%">Date</th>
                      <th width="16%">Created By</th>
                      <th width="30%">Vendor Name</th>
                      <th className="text-end" width="16%">
                        Net Amount
                      </th>
                      <th width="16%">Close / Renewed</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={`${order.orderNo}-${index}`}>
                        <td>{formatValue(order.orderNo)}</td>
                        <td>{formatValue(order.date)}</td>
                        <td>{formatValue(order.createdBy)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            <VendorStack order={order} />
                          </div>
                        </td>
                        <td>
                          <AmountStack order={order} />
                        </td>
                        <td>{formatValue(order.closeRenewed)}</td>
                      </tr>
                    ))}

                    {!filteredOrders.length && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted fw-bold">
                          No work order records found.
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

      <WorkOrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
};

const WorkOrderModal = ({ order, onClose }: WorkOrderModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!order) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [order]);

  if (!order) {
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
        aria-label="Work order detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1 dashboard-panel-title fs-3">
              Work Order Approval
            </h4>
            <div className="text-primary mt-1 fs-6">
              Order No: {formatValue(order.orderNo)}
              <span className="mx-5">Date: {formatValue(order.date)}</span>
            </div>
            <div className="text-muted mt-1 fw-bold fs-6">
              {formatValue(order.vendorName1)}
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
                <div className="dashboard-bill-label">Created By</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(order.createdBy)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Contract Type</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(order.contractType)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Place</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(order.place)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Close / Renewed</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(order.closeRenewed)}
                </div>
              </div>
              <div className="col-12">
                <div className="dashboard-bill-label">Scope of Work</div>
                <div className="dashboard-bill-text">
                  {formatValue(order.scopeOfWork)}
                </div>
              </div>
            </div>
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Vendor & Amount</h5>
            <div className="row g-4">
              {[1, 2, 3].map(index => {
                const vendor = order[`vendorName${index}` as keyof WorkOrderItem];
                const amount = order[`netAmount${index}` as keyof WorkOrderItem];

                return (
                  <div className="col-sm-4" key={index}>
                    <div className="dashboard-bill-label">Vendor {index}</div>
                    <div className="dashboard-bill-text fw-bold">
                      {formatValue(vendor)}
                    </div>
                    <div className="dashboard-bill-amount-strip rounded mt-3">
                      <span>Net Amount</span>
                      <strong className="fs-4">{formatValue(amount)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card p-4 mb-3 border table-responsive">
            <h5 className="dashboard-bill-section-title">Work Order Line Items</h5>
            <table className="table table-bordered align-middle dashboard-bill-modal-table mb-0">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Work Scope</th>
                  <th>Total Price 1</th>
                  <th>Insurance</th>
                  <th>Date From</th>
                  <th>Date To</th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems.length ? (
                  order.lineItems.map(item => (
                    <tr key={`${item.srNo}-${item.totalPrice1}`}>
                      <td>{formatValue(item.srNo)}</td>
                      <td>{formatValue(item.workScope)}</td>
                      <td>{formatValue(item.totalPrice1)}</td>
                      <td>{formatValue(item.insurance)}</td>
                      <td>{formatValue(item.dateFrom)}</td>
                      <td>{formatValue(item.dateTo)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No line items available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="dashboard-bill-workflow">
            <h5 className="dashboard-bill-workflow-title">Payment Terms</h5>
            <div className="dashboard-bill-workflow-line">
              {order.paymentTerms.length ? (
                order.paymentTerms.map((term, index) => (
                  <article
                    key={`${term.payTerms}-${index}`}
                    className="dashboard-bill-workflow-card is-active"
                  >
                    <span className="dashboard-bill-workflow-dot" />
                    <div className="dashboard-bill-workflow-header">
                      <h6>{formatValue(term.payTerms)}</h6>
                      <span>{formatValue(term.percentage)}%</span>
                    </div>
                    <div className="dashboard-bill-workflow-meta">
                      <span>Amount: {formatValue(term.amount)}</span>
                    </div>
                    <p>Pay Type: {formatValue(term.payType)}</p>
                    <div className="dashboard-bill-workflow-footer">
                      Assign To: {formatValue(term.assignToName)} | PT Verify:{' '}
                      {formatValue(term.ptVerificationRequired)}
                    </div>
                  </article>
                ))
              ) : (
                <article className="dashboard-bill-workflow-card is-pending">
                  <span className="dashboard-bill-workflow-dot" />
                  <div className="dashboard-bill-workflow-header">
                    <h6>Payment Terms</h6>
                    <span>-</span>
                  </div>
                  <p>No payment terms available.</p>
                </article>
              )}
            </div>
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Attachments & Links</h5>
            <div className="dashboard-bill-link-list">
              <a
                className="dashboard-bill-link-item"
                href={order.filePath ? normalizeFileUrl(order.filePath) : '#'}
                target={order.filePath ? '_blank' : undefined}
                rel={order.filePath ? 'noreferrer' : undefined}
              >
                <div className="dashboard-bill-link-icon">
                  <i className="fa fa-file-pdf-o" aria-hidden="true" />
                </div>
                <div className="dashboard-bill-link-content">
                  <p>Work Order File</p>
                  <span>{formatValue(order.filePath || 'Not Available')}</span>
                </div>
                <i className="fa fa-external-link" aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        <div className="dashboard-slide-footer dashboard-bill-action-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Close
          </button>
          <button type="button" className="btn nssBtnColor text-white">
            Approve
          </button>
        </div>
      </aside>
    </>
  );
};
