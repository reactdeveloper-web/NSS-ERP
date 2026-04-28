import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
import { EmployeeApplicationItem } from './types';

interface EmployeeApplicationTableProps {
  items: EmployeeApplicationItem[];
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

export const EmployeeApplicationTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: EmployeeApplicationTableProps) => {
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
        item.code,
        item.name,
        item.department,
        item.designation,
        item.type,
        item.amount,
        item.statusRemark,
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
            Employee Application Pending
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
                    <th className="width-10">Code</th>
                    <th className="width-20">Name</th>
                    <th className="width-15">Department</th>
                    <th className="width-18">Designation</th>
                    <th className="width-15">Type</th>
                    <th className="text-end width-10">Amount</th>
                    <th className="width-12">Status Remark</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={`${item.code}-${index}`}>
                      <td>{formatValue(item.code)}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          {formatValue(item.name)}
                        </div>
                      </td>
                      <td>{formatValue(item.department)}</td>
                      <td>{formatValue(item.designation)}</td>
                      <td>{formatValue(item.type)}</td>
                      <td className="text-end">{formatValue(item.amount)}</td>
                      <td>{formatValue(item.statusRemark)}</td>
                    </tr>
                  ))}

                  {!filteredItems.length && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted fw-bold">
                        No employee application records found.
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
