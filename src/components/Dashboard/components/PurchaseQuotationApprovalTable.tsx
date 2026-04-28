import React, { useEffect, useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
import { PurchaseQuotationItem } from './types';

interface PurchaseQuotationApprovalTableProps {
  quotations: PurchaseQuotationItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

interface PurchaseQuotationModalProps {
  quotation: PurchaseQuotationItem | null;
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

const getStageBadgeClass = (stage: string) => {
  const normalizedStage = stage.toLowerCase();

  if (['a', 'approve', 'approved'].includes(normalizedStage)) {
    return 'badge-light-success';
  }

  if (['c', 'close', 'closed'].includes(normalizedStage)) {
    return 'badge-light-dark';
  }

  return 'badge-light-warning';
};

export const PurchaseQuotationApprovalTable = ({
  quotations,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: PurchaseQuotationApprovalTableProps) => {
  const [selectedQuotation, setSelectedQuotation] =
    useState<PurchaseQuotationItem | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredQuotations = useMemo(() => {
    if (!isSearchActive) {
      return quotations;
    }

    return quotations.filter(quotation =>
      [
        quotation.qcsId,
        quotation.qcsDate,
        quotation.vendorName1,
        quotation.vendorName2,
        quotation.vendorName3,
        quotation.location,
        quotation.qcsType,
        quotation.qcsStage,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, normalizedSearch, quotations]);
  const displayTotalCount = isSearchActive
    ? filteredQuotations.length
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
              Purchase Quotation Approval
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
                      <th className='width-10'>Qcs Id</th>
                      <th className='width-12'>Qcs Date</th>
                      <th className='width-22'>Vendor Name 1</th>
                      <th className='width-18'>Vendor Name 2</th>
                      <th className='width-18'>Vendor Name 3</th>
                      <th className='width-14'>Location</th>
                      <th className="text-center width-6%">
                        Stage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredQuotations.map((quotation, index) => (
                      <tr key={`${quotation.qcsId}-${index}`}>
                        <td>{formatValue(quotation.qcsId)}</td>
                        <td>{formatValue(quotation.qcsDate)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(quotation.vendorName1)}
                          </div>
                        </td>
                        <td>{formatValue(quotation.vendorName2)}</td>
                        <td>{formatValue(quotation.vendorName3)}</td>
                        <td>{formatValue(quotation.location)}</td>
                        <td className="text-center">
                          <span
                            className={`badge fs-8 fw-bolder ${getStageBadgeClass(
                              quotation.qcsStage,
                            )}`}
                          >
                            {formatValue(quotation.qcsStage)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredQuotations.length && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted fw-bold">
                          No purchase quotation records found.
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

      <PurchaseQuotationModal
        quotation={selectedQuotation}
        onClose={() => setSelectedQuotation(null)}
      />
    </>
  );
};

const PurchaseQuotationModal = ({
  quotation,
  onClose,
}: PurchaseQuotationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!quotation) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [quotation]);

  if (!quotation) {
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
        aria-label="Purchase quotation detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1 dashboard-panel-title fs-3">
              Purchase Quotation Approval
            </h4>
            <div className="text-primary mt-1 fs-6">
              Qcs Id: {formatValue(quotation.qcsId)}
              <span className="mx-5">
                Date: {formatValue(quotation.qcsDate)}
              </span>
            </div>
            <div className="text-muted mt-1 fw-bold fs-6">
              {formatValue(quotation.location)}
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
                <div className="dashboard-bill-label">Qcs Type</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(quotation.qcsType)}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="dashboard-bill-label">Stage</div>
                <span
                  className={`badge fs-8 fw-bolder ${getStageBadgeClass(
                    quotation.qcsStage,
                  )}`}
                >
                  {formatValue(quotation.qcsStage)}
                </span>
              </div>
              <div className="col-sm-4">
                <div className="dashboard-bill-label">Vendor 1</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(quotation.vendorName1)}
                </div>
                <div className="dashboard-bill-amount-strip rounded mt-3">
                  <span>Net Total 1</span>
                  <strong className="fs-4">
                    {formatValue(quotation.netTotal1)}
                  </strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="dashboard-bill-label">Vendor 2</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(quotation.vendorName2)}
                </div>
                <div className="dashboard-bill-amount-strip rounded mt-3">
                  <span>Net Total 2</span>
                  <strong className="fs-4">
                    {formatValue(quotation.netTotal2)}
                  </strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="dashboard-bill-label">Vendor 3</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(quotation.vendorName3)}
                </div>
                <div className="dashboard-bill-amount-strip rounded mt-3">
                  <span>Net Total 3</span>
                  <strong className="fs-4">
                    {formatValue(quotation.netTotal3)}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-4 mb-3 border table-responsive">
            <h5 className="dashboard-bill-section-title">Line Items</h5>
            <table className="table table-bordered align-middle dashboard-bill-modal-table mb-0">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Rate 1</th>
                  <th>Rate 2</th>
                  <th>Rate 3</th>
                  <th>L</th>
                </tr>
              </thead>
              <tbody>
                {quotation.lineItems.length ? (
                  quotation.lineItems.map(item => (
                    <tr key={`${item.srNo}-${item.itemName}`}>
                      <td>{formatValue(item.srNo)}</td>
                      <td>{formatValue(item.itemName)}</td>
                      <td>
                        {formatValue(item.quantity)} {formatValue(item.unit)}
                      </td>
                      <td>{formatValue(item.rate1)}</td>
                      <td>{formatValue(item.rate2)}</td>
                      <td>{formatValue(item.rate3)}</td>
                      <td>{formatValue(item.greenColor)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
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
              {quotation.paymentTerms.length ? (
                quotation.paymentTerms.map((term, index) => (
                  <article
                    key={`${term.payTerms}-${index}`}
                    className="dashboard-bill-workflow-card is-active"
                  >
                    <span className="dashboard-bill-workflow-dot" />
                    <div className="dashboard-bill-workflow-header">
                      <h6>{formatValue(term.payTerms)}</h6>
                      <span>{formatValue(term.percentage)}%</span>
                    </div>
                    <p>Assign To: {formatValue(term.assignToName)}</p>
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
            <h5 className="dashboard-bill-section-title">Attachments &amp; Links</h5>
            <div className="dashboard-bill-link-list">
              <a
                className="dashboard-bill-link-item"
                href={quotation.qcsFile ? normalizeFileUrl(quotation.qcsFile) : '#'}
                target={quotation.qcsFile ? '_blank' : undefined}
                rel={quotation.qcsFile ? 'noreferrer' : undefined}
              >
                <div className="dashboard-bill-link-icon">
                  <i className="fa fa-file-image-o" aria-hidden="true" />
                </div>
                <div className="dashboard-bill-link-content">
                  <p>QCS File</p>
                  <span>{formatValue(quotation.qcsFile || 'Not Available')}</span>
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
