import React, { useMemo, useState } from 'react';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';

export interface CitListingItem {
  informationCode: string;
  date: string;
  ngCode: string;
  callCategoryName: string;
  requestBy: string;
  mobileNo1: string;
  callBackDate: string;
  completed: boolean;
}

interface CitListingFilters {
  informationCode: string;
  ngCode: string;
  mobileNo1: string;
  fromDate: string;
  toDate: string;
}

interface CitListingProps {
  deletingId: string | null;
  items: CitListingItem[];
  loading?: boolean;
  error?: string;
  onAdd: () => void;
  onEdit: (informationCode: string) => void;
  onView: (informationCode: string) => void;
  onDelete: (informationCode: string) => void;
}

const createInitialFilters = (): CitListingFilters => ({
  informationCode: '',
  ngCode: '',
  mobileNo1: '',
  fromDate: '',
  toDate: '',
});

const normalizeDate = (value: string) => value.trim();

const formatDisplayDate = (value: string) => {
  const normalizedValue = normalizeDate(value);

  if (!normalizedValue || !normalizedValue.includes('-')) {
    return normalizedValue || '-';
  }

  return normalizedValue.split('-').reverse().join('/');
};

export const CitListing = ({
  deletingId,
  items,
  loading = false,
  error = '',
  onAdd,
  onEdit,
  onView,
  onDelete,
}: CitListingProps) => {
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<CitListingFilters>(
    createInitialFilters(),
  );
  const [appliedFilters, setAppliedFilters] = useState<CitListingFilters>(
    createInitialFilters(),
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateDraftFilter = <K extends keyof CitListingFilters>(
    field: K,
    value: CitListingFilters[K],
  ) => {
    setDraftFilters(current => ({
      ...current,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setPageNumber(1);
  };

  const handleResetFilters = () => {
    const initialFilters = createInitialFilters();
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSearchText('');
    setPageNumber(1);
  };

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    const normalizedInfoCode = appliedFilters.informationCode.trim();
    const normalizedNgCode = appliedFilters.ngCode.trim().toLowerCase();
    const normalizedMobileNo1 = appliedFilters.mobileNo1.trim().toLowerCase();
    const normalizedFromDate = normalizeDate(appliedFilters.fromDate);
    const normalizedToDate = normalizeDate(appliedFilters.toDate);

    return items.filter(item => {
      const matchesSearch =
        !normalizedSearch ||
        [
          item.informationCode,
          item.date,
          item.ngCode,
          item.callCategoryName,
          item.requestBy,
          item.mobileNo1,
          item.callBackDate,
          item.completed ? 'completed' : 'pending',
        ].some(field => field.toLowerCase().includes(normalizedSearch));
      const matchesInfoCode =
        !normalizedInfoCode ||
        item.informationCode.includes(normalizedInfoCode);
      const matchesNgCode =
        !normalizedNgCode ||
        item.ngCode.toLowerCase().includes(normalizedNgCode);
      const matchesMobileNo1 =
        !normalizedMobileNo1 ||
        item.mobileNo1.toLowerCase().includes(normalizedMobileNo1);
      const matchesFromDate =
        !normalizedFromDate || (item.date && item.date >= normalizedFromDate);
      const matchesToDate =
        !normalizedToDate || (item.date && item.date <= normalizedToDate);

      return (
        matchesSearch &&
        matchesInfoCode &&
        matchesNgCode &&
        matchesMobileNo1 &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [appliedFilters, items, searchText]);

  const totalCount = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedItems = filteredItems.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const safeStartPage = Math.max(1, pageNumber - 2);
      const safeEndPage = Math.min(totalPages, safeStartPage + 4);
      const adjustedStartPage = Math.max(1, safeEndPage - 4);

      return adjustedStartPage + index;
    },
  );
  const startRecord = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRecord =
    totalCount === 0 ? 0 : Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="card announce-master-card">
      <div className="card-header announce-master-card-header">
        <div className="card-title p-0">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">
              Call Information Trait Details
            </span>
          </h3>
        </div>

        <div className="card-toolbar p-0">
          <div className="d-flex align-items-center flex-wrap gap-3 justify-content-end">
            <div className="position-relative">
              <span className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle-y ms-3">
                <i className="fas fa-search fs-3" aria-hidden="true"></i>
              </span>
              <input
                type="text"
                className="form-control w-250px ps-10"
                placeholder="Search records..."
                value={searchText}
                onChange={event => setSearchText(event.target.value)}
              />
            </div>

            <button
              className="btn btn-sm btn-flex btn-light btn-active-primary fw-bolder p-6"
              type="button"
              onClick={() => setIsFilterOpen(current => !current)}
            >
              <i className="fas fa-filter fs-4" />
            </button>

            <button
              className="btn btn-sm btn-primary btn-active-primary p-3 fs-6"
              type="button"
              onClick={onAdd}
            >
              <span className="svg-icon svg-icon-3 me-0">
                <i className="fa fa-plus fs-7" aria-hidden="true"></i>
              </span>
              Add
            </button>
          </div>
        </div>
      </div>

      <div
        className={`announce-listing-filter-wrap ${
          isFilterOpen ? 'is-open' : ''
        }`}
      >
        <div className="announce-listing-filter-inner">
          <div className="card card-bordered bg-light">
            <div className="card-body p-6">
              <div className="row g-3">
                <div className="col-md-3">
                  <FloatingInputField
                    id="filterInformationCode"
                    label="Information Code"
                    value={draftFilters.informationCode}
                    onChange={value =>
                      updateDraftFilter('informationCode', value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterNgCode"
                    label="NG Code"
                    value={draftFilters.ngCode}
                    onChange={value => updateDraftFilter('ngCode', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterMobileNo1"
                    label="Mobile No"
                    value={draftFilters.mobileNo1}
                    onChange={value => updateDraftFilter('mobileNo1', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingDatePicker
                    id="filterFromDate"
                    label="From Date"
                    value={draftFilters.fromDate}
                    onChange={value => updateDraftFilter('fromDate', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingDatePicker
                    id="filterToDate"
                    label="To Date"
                    value={draftFilters.toDate}
                    onChange={value => updateDraftFilter('toDate', value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-6">
                <button
                  className="btn btn-light me-3"
                  type="button"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleApplyFilters}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-3">
        {error ? <div className="alert alert-warning m-3">{error}</div> : null}

        <div className="table-responsive" style={{ maxHeight: '550px' }}>
          <table
            id="citListingTable"
            className="table table-row-bordered align-middle gs-0 gy-2 mb-0"
          >
            <thead>
              <tr className="fw-bolder text-uppercase text-nowrap">
                <th
                  className="min-w-100px text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                ></th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  Information Code
                </th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  Date
                </th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  NG Code
                </th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  Call Category
                </th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  Request By
                </th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  Mobile No
                </th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  Call Back Date
                </th>
                <th
                  className="text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-muted">
                    Loading call information traits...
                  </td>
                </tr>
              ) : paginatedItems.length ? (
                paginatedItems.map(item => (
                  <tr key={item.informationCode} valign="top">
                    <td className="d-flex gap-6">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-light"
                        onClick={() => onEdit(item.informationCode)}
                        title="Edit"
                      >
                        <i
                          className="fa fa-edit text-info"
                          aria-hidden="true"
                        ></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-light"
                        onClick={() => onView(item.informationCode)}
                        title="View"
                      >
                        <i
                          className="fa fa-eye text-success"
                          aria-hidden="true"
                        ></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-light"
                        onClick={() => onDelete(item.informationCode)}
                        disabled={deletingId === item.informationCode}
                        title="Delete"
                      >
                        <i
                          className="fa fa-trash text-danger"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </td>
                    <td className="text-center">
                      {item.informationCode || '-'}
                    </td>
                    <td className="text-center">
                      {formatDisplayDate(item.date)}
                    </td>
                    <td className="text-center">{item.ngCode || '-'}</td>
                    <td className="text-center">
                      {item.callCategoryName || '-'}
                    </td>
                    <td className="text-center">{item.requestBy || '-'}</td>
                    <td className="text-center">{item.mobileNo1 || '-'}</td>
                    <td className="text-center">
                      {formatDisplayDate(item.callBackDate)}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          item.completed
                            ? 'badge-light-success'
                            : 'badge-light-warning'
                        }`}
                      >
                        {item.completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-muted">
                    No call information trait records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-stack flex-wrap pt-5">
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted fs-7">Show</span>
            <select
              className="form-select form-select-sm form-select-solid w-100px"
              value={pageSize}
              onChange={event => {
                setPageSize(Number(event.target.value));
                setPageNumber(1);
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
              Showing {startRecord} to {endRecord} of {totalCount}
            </span>
            <ul className="pagination pagination-circle pagination-outline mb-0">
              <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    setPageNumber(current => Math.max(1, current - 1))
                  }
                >
                  &laquo;
                </button>
              </li>
              {pageNumbers.map(page => (
                <li
                  key={page}
                  className={`page-item ${page === pageNumber ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setPageNumber(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  pageNumber >= totalPages ? 'disabled' : ''
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    setPageNumber(current => Math.min(totalPages, current + 1))
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
  );
};
