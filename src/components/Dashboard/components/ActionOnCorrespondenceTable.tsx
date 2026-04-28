import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
import { ActionOnCorrespondenceItem } from './types';

interface ActionOnCorrespondenceTableProps {
  items: ActionOnCorrespondenceItem[];
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

const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'yes' || normalizedStatus === 'y') {
    return 'badge-light-success';
  }

  if (normalizedStatus === 'no' || normalizedStatus === 'n') {
    return 'badge-light-warning';
  }

  return 'badge-light-secondary';
};

export const ActionOnCorrespondenceTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: ActionOnCorrespondenceTableProps) => {
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
        item.letterId,
        item.letterFrom,
        item.subject,
        item.letterDate,
        item.receiveDate,
        item.categoryDescription,
        item.status,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, items, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredItems.length : totalCount;
  const displayPageNumber = isSearchActive ? 1 : pageNumber;

  return (
    <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
      <div className="card-header pt-3 pb-3">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder fs-3 mb-1">
            Action On Correspondence Pending
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
                    <th className="width-10">Letter ID</th>
                    <th className="width-16">Letter From</th>
                    <th className="width-22">Subject</th>
                    <th className="width-13">Date</th>
                    <th className="width-13">Receive Date</th>
                    <th className="width-16">Category Description</th>
                    <th className="text-center width-10">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={`${item.letterId}-${index}`}>
                      <td>{formatValue(item.letterId)}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          {formatValue(item.letterFrom)}
                        </div>
                      </td>
                      <td>{formatValue(item.subject)}</td>
                      <td>{formatValue(item.letterDate)}</td>
                      <td>{formatValue(item.receiveDate)}</td>
                      <td>{formatValue(item.categoryDescription)}</td>
                      <td className="text-center">
                        <span
                          className={`badge fs-8 fw-bolder ${getStatusBadgeClass(
                            item.status,
                          )}`}
                        >
                          {formatValue(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!filteredItems.length && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted fw-bold">
                        No correspondence records found.
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
