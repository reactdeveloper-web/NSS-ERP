import React from 'react';

interface DashboardPaginationProps {
  displayTotalCount: number;
  displayPageNumber: number;
  pageSize: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const DashboardPagination = ({
  displayTotalCount,
  displayPageNumber,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DashboardPaginationProps) => {
  if (displayTotalCount < pageSize) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(displayTotalCount / pageSize));
  const startRecord =
    displayTotalCount === 0 ? 0 : (displayPageNumber - 1) * pageSize + 1;
  const endRecord =
    displayTotalCount === 0
      ? 0
      : Math.min(displayPageNumber * pageSize, displayTotalCount);
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
    const safeStartPage = Math.max(1, displayPageNumber - 2);
    const safeEndPage = Math.min(totalPages, safeStartPage + 4);
    const adjustedStartPage = Math.max(1, safeEndPage - 4);

    return adjustedStartPage + index;
  });

  return (
    <div className="d-flex flex-stack flex-wrap mt-auto">
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
          <li className={`page-item ${displayPageNumber === 1 ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(Math.max(1, displayPageNumber - 1))}
            >
              &laquo;
            </button>
          </li>
          {pageNumbers.map(page => (
            <li
              key={page}
              className={`page-item ${page === displayPageNumber ? 'active' : ''}`}
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
  );
};
