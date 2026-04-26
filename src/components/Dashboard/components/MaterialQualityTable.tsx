import React, { useEffect, useMemo, useState } from 'react';
import { MaterialQualityItem } from './types';

interface MaterialQualityTableProps {
  items: MaterialQualityItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

interface MaterialQualityModalProps {
  item: MaterialQualityItem | null;
  onClose: () => void;
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

export const MaterialQualityTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: MaterialQualityTableProps) => {
  const [selectedItem, setSelectedItem] = useState<MaterialQualityItem | null>(null);
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
        item.rmId,
        item.poNo,
        item.date,
        item.vendorName,
        item.mobile,
        item.sadhakName,
        item.storeName,
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
              Material Quality
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
                      <th width="10%">RM ID</th>
                      <th width="12%">PO No.</th>
                      <th width="16%">Date</th>
                      <th width="24%">Vendor Name</th>
                      <th width="14%">Mobile</th>
                      <th width="24%">Sadhak Name</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={`${item.rmId}-${index}`}>
                        <td>{formatValue(item.rmId)}</td>
                        <td>{formatValue(item.poNo)}</td>
                        <td>{formatValue(item.date)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(item.vendorName)}
                          </div>
                        </td>
                        <td>{formatValue(item.mobile)}</td>
                        <td>{formatValue(item.sadhakName)}</td>
                      </tr>
                    ))}

                    {!filteredItems.length && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted fw-bold">
                          No material quality records found.
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

      <MaterialQualityModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};

const MaterialQualityModal = ({ item, onClose }: MaterialQualityModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!item) {
      return;
    }

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
        aria-label="Material quality detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1 dashboard-panel-title fs-3">
              Material Quality
            </h4>
            <div className="text-primary mt-1 fs-6">
              RM ID: {formatValue(item.rmId)}
              <span className="mx-5">PO No: {formatValue(item.poNo)}</span>
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
              <div className="col-sm-4">
                <div className="dashboard-bill-label">Date</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(item.date)}
                </div>
              </div>
              <div className="col-sm-4">
                <div className="dashboard-bill-label">Mobile</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(item.mobile)}
                </div>
              </div>
              <div className="col-sm-4">
                <div className="dashboard-bill-label">Store</div>
                <div className="dashboard-bill-text fw-bold">
                  {formatValue(item.storeName)}
                </div>
              </div>
            </div>
          </section>

          <section className="card p-4 mb-3 border table-responsive">
            <h5 className="dashboard-bill-section-title">Line Items</h5>
            <table className="table table-bordered align-middle dashboard-bill-modal-table mb-0">
              <thead>
                <tr>
                  <th>PO Sr No</th>
                  <th>Sadhak Name</th>
                  <th>Item Name</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Company</th>
                  <th>Amount</th>
                  <th>QM Status</th>
                </tr>
              </thead>
              <tbody>
                {item.lineItems.length ? (
                  item.lineItems.map((line, index) => (
                    <tr key={`${line.qmCode}-${index}`}>
                      <td>{formatValue(line.poSrNo)}</td>
                      <td>{formatValue(line.sadhakName)}</td>
                      <td>{formatValue(line.itemName)}</td>
                      <td>{formatValue(line.pendingQuantity)}</td>
                      <td>{formatValue(line.unit)}</td>
                      <td>{formatValue(line.companyName)}</td>
                      <td>{formatValue(line.amount)}</td>
                      <td>{formatValue(line.qmStatus)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      No line items available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <div className="dashboard-slide-footer dashboard-bill-action-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Close
          </button>
        </div>
      </aside>
    </>
  );
};
