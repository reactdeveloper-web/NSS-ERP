import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
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
                      <th className='width-10'>App. OT. No.</th>
                      <th className='width-12'>Quotation No.</th>
                      <th className='width-24'>Vendor Name</th>
                      <th className='width-18'>Payment Term</th>
                      <th className='width-12'>Pay Date</th>
                      <th className="text-end width-12%">
                        Amount
                      </th>
                      <th className="text-center width-12%">
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
