import React, { useMemo, useState } from 'react';
import { DashboardPagination } from './DashboardPagination';
import { ActionOnRecruitmentItem } from './types';

interface ActionOnRecruitmentTableProps {
  items: ActionOnRecruitmentItem[];
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

export const ActionOnRecruitmentTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: ActionOnRecruitmentTableProps) => {
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
        item.applicationNo,
        item.name,
        item.dob,
        item.sex,
        item.departmentName,
        item.postName,
        item.salary,
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
            Action On Recruitment
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
                    <th className='width-10 text-center'>Application No.</th>
                    <th className='width-18'>Name</th>
                    <th className='width-15'>DOB</th>
                    <th className='width-10 text-center'>Sex</th>
                    <th className='width-20'>Dept Name</th>
                    <th className='width-17'>Post Name</th>
                    <th className="text-end width-8">
                      Salary
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={`${item.applicationNo}-${index}`}>
                      <td className="text-center">{formatValue(item.applicationNo)}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          {formatValue(item.name)}
                        </div>
                      </td>
                      <td>{formatValue(item.dob)}</td>
                      <td className="text-center">{formatValue(item.sex)}</td>
                      <td>{formatValue(item.departmentName)}</td>
                      <td>{formatValue(item.postName)}</td>
                      <td className="text-end">{formatValue(item.salary)}</td>
                    </tr>
                  ))}

                  {!filteredItems.length && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted fw-bold">
                        No recruitment records found.
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
