import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { ContentTypes } from 'src/constants/content';
import axiosInstance from 'src/redux/interceptor';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  extractArrayPayload,
  getFirstValue,
  normalizeApiDate,
  parseStoredUser,
} from '../AnnounceMasterContent.helpers';

export interface AnnouncementListingItem {
  announceId: string;
  announcerName: string;
  mobileNo: string;
  announceAmount: string;
  announceDate: string;
}

interface AnnouncementListFilters {
  announceId: string;
  announcerName: string;
  mobileNo: string;
  amount: string;
  fromDate: string;
  toDate: string;
}

interface AnnouncementListingProps {
  deletingId: string | null;
  onAdd: () => void;
  onEdit: (announceId: string) => void;
  onView: (announceId: string) => void;
  onDelete: (announceId: string) => void;
}

type SortField =
  | 'announceId'
  | 'announcerName'
  | 'mobileNo'
  | 'announceAmount'
  | 'announceDate';

type SortDirection = 'asc' | 'desc' | null;

interface TableColumnFilters {
  announcerName: string;
  mobileNo: string;
}

const createInitialFilters = (): AnnouncementListFilters => ({
  announceId: '',
  announcerName: '',
  mobileNo: '',
  amount: '',
  fromDate: '',
  toDate: '',
});

const createInitialTableColumnFilters = (): TableColumnFilters => ({
  announcerName: '',
  mobileNo: '',
});

const formatDisplayDate = (value: string) => {
  const trimmedValue = value.trim();
  const normalizedValue = normalizeApiDate(trimmedValue);

  if (normalizedValue) {
    return normalizedValue.split('-').reverse().join('/');
  }

  return trimmedValue || '-';
};

const formatAmount = (value: string) => {
  const trimmedValue = value.trim();
  const numericValue = Number(trimmedValue);

  if (!Number.isFinite(numericValue)) {
    return trimmedValue || '-';
  }

  return numericValue.toFixed(2);
};

const getSortValue = (
  item: AnnouncementListingItem,
  field: SortField,
): number | string => {
  if (field === 'announceId') {
    const numericId = Number(item.announceId);
    return Number.isFinite(numericId) ? numericId : item.announceId.toLowerCase();
  }

  if (field === 'announceAmount') {
    const numericAmount = Number(item.announceAmount);
    return Number.isFinite(numericAmount)
      ? numericAmount
      : item.announceAmount.toLowerCase();
  }

  if (field === 'announceDate') {
    return normalizeApiDate(item.announceDate) || '';
  }

  return item[field].toLowerCase();
};

const mapAnnouncementListItem = (
  record: Record<string, unknown>,
): AnnouncementListingItem => ({
  announceId: getFirstValue(record, ['announce_id']),
  announcerName: getFirstValue(record, ['announcer_name']),
  mobileNo: getFirstValue(record, ['mob_no']),
  announceAmount: formatAmount(getFirstValue(record, ['announce_amount'])),
  announceDate: formatDisplayDate(getFirstValue(record, ['announce_date'])),
});

const extractTotalCount = (payload: unknown, fallbackCount: number): number => {
  if (!payload || typeof payload !== 'object') {
    return fallbackCount;
  }

  const record = payload as Record<string, unknown>;
  const countKeys = [
    'TotalCount',
    'totalCount',
    'total_count',
    'RecordCount',
    'recordCount',
    'TotalRecord',
    'totalRecord',
    'total_record',
    'TotalRecords',
    'totalRecords',
    'total_records',
    'Total_Row',
    'total_row',
    'RowsCount',
    'rowsCount',
  ];
  const topLevelCount = Number(getFirstValue(record, countKeys));

  if (Number.isFinite(topLevelCount) && topLevelCount > 0) {
    return topLevelCount;
  }

  const [firstRow] = extractArrayPayload(payload);
  const rowLevelCount = firstRow ? Number(getFirstValue(firstRow, countKeys)) : NaN;

  return Number.isFinite(rowLevelCount) && rowLevelCount > 0
    ? rowLevelCount
    : fallbackCount;
};

export const AnnouncementListing = ({
  deletingId,
  onAdd,
  onEdit,
  onView,
  onDelete,
}: AnnouncementListingProps) => {
  const listingRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<AnnouncementListingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<AnnouncementListFilters>(
    createInitialFilters(),
  );
  const [appliedFilters, setAppliedFilters] = useState<AnnouncementListFilters>(
    createInitialFilters(),
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [tableColumnFilters, setTableColumnFilters] =
    useState<TableColumnFilters>(createInitialTableColumnFilters());

  const updateDraftFilter = <K extends keyof AnnouncementListFilters>(
    field: K,
    value: AnnouncementListFilters[K],
  ) => {
    setDraftFilters(current => ({
      ...current,
      [field]: value,
    }));
  };

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setPageNumber(1);
  }, [draftFilters]);

  const handleResetFilters = useCallback(() => {
    const initialFilters = createInitialFilters();
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPageNumber(1);
    setSearchText('');
    setTableColumnFilters(createInitialTableColumnFilters());
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField !== field) {
        setSortField(field);
        setSortDirection('asc');
        return;
      }

      if (sortDirection === null) {
        setSortDirection('asc');
        return;
      }

      if (sortDirection === 'asc') {
        setSortDirection('desc');
        return;
      }

      setSortField(null);
      setSortDirection(null);
    },
    [sortDirection, sortField],
  );

  const updateTableColumnFilter = useCallback(
    (field: keyof TableColumnFilters, value: string) => {
      setTableColumnFilters(current => ({
        ...current,
        [field]: value,
      }));
      setPageNumber(1);
    },
    [],
  );

  const fetchAnnouncements = useCallback(async () => {
    const currentUser = parseStoredUser() as Partial<IUser> & {
      DataFlag?: string;
      dataFlag?: string;
      Data_Flag?: string;
      fy_id?: number | string;
      fyId?: number | string;
      FY_ID?: number | string;
      user_id?: number | string;
      UserId?: number | string;
    };

    const payload = {
      announce_id: Number(appliedFilters.announceId || 0) || null,
      mob_no: appliedFilters.mobileNo.trim() || null,
      user_id:
        Number(
          currentUser.user_id || currentUser.UserId || currentUser.id || 0,
        ) || null,
      data_flag:
        currentUser.DataFlag ||
        currentUser.dataFlag ||
        currentUser.Data_Flag ||
        ContentTypes.DataFlag,
      fy_id:
        Number(
          currentUser.fy_id || currentUser.fyId || currentUser.FY_ID || 21,
        ) || 21,
      PostType: 'WebReact',
      from_date: appliedFilters.fromDate || null,
      to_date: appliedFilters.toDate || null,
      PageNumber: pageNumber,
      PageSize: pageSize,
    };

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(
        masterApiPaths.getAnnounceList,
        payload,
      );
      // console.log('CRM/GetAnnounceList response:', response.data);
      // console.log(
      //   'CRM/GetAnnounceList first 100 result rows:',
      //   extractArrayPayload(response.data).slice(0, 100),
      // );
      const records = extractArrayPayload(response.data);
      const mappedItems = records.map(mapAnnouncementListItem);

      setItems(mappedItems);
      setTotalCount(extractTotalCount(response.data, mappedItems.length));
    } catch (apiError: any) {
      setItems([]);
      setTotalCount(0);
      setError(
        apiError?.response?.data?.message ||
          apiError?.message ||
          'Announcement list load nahi hui.',
      );
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, pageNumber, pageSize]);

  useEffect(() => {
    void fetchAnnouncements();
  }, [fetchAnnouncements]);

  useEffect(() => {
    const bootstrap = (window as Window & {
      bootstrap?: {
        Tooltip?: new (element: Element, options?: Record<string, unknown>) => {
          dispose?: () => void;
        };
      };
    }).bootstrap;

    if (!bootstrap?.Tooltip || !listingRef.current) {
      return;
    }

    const tooltipElements = Array.from(
      listingRef.current.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    const tooltips = tooltipElements.map(
      element => new bootstrap.Tooltip!(element, { trigger: 'hover' }),
    );

    return () => {
      tooltips.forEach(tooltip => tooltip.dispose?.());
    };
  }, [isFilterOpen, loading, items.length, pageNumber, pageSize, searchText]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    const normalizedAnnouncerName = appliedFilters.announcerName
      .trim()
      .toLowerCase();
    const normalizedColumnAnnouncerName = tableColumnFilters.announcerName
      .trim()
      .toLowerCase();
    const normalizedColumnMobileNo = tableColumnFilters.mobileNo
      .trim()
      .toLowerCase();
    const normalizedAmount = appliedFilters.amount.trim().toLowerCase();
    const normalizedFromDate = normalizeApiDate(appliedFilters.fromDate);
    const normalizedToDate = normalizeApiDate(appliedFilters.toDate);

    return items.filter(item => {
      const normalizedItemDate = normalizeApiDate(item.announceDate);
      const matchesSearch =
        !normalizedSearch ||
        [
          item.announceId,
          item.announcerName,
          item.mobileNo,
          item.announceAmount,
          item.announceDate,
        ].some(field => field.toLowerCase().includes(normalizedSearch));
      const matchesAnnouncerName =
        !normalizedAnnouncerName ||
        item.announcerName.toLowerCase().includes(normalizedAnnouncerName);
      const matchesColumnAnnouncerName =
        !normalizedColumnAnnouncerName ||
        item.announcerName.toLowerCase().includes(normalizedColumnAnnouncerName);
      const matchesColumnMobileNo =
        !normalizedColumnMobileNo ||
        item.mobileNo.toLowerCase().includes(normalizedColumnMobileNo);
      const matchesAmount =
        !normalizedAmount ||
        item.announceAmount.toLowerCase().includes(normalizedAmount);
      const matchesFromDate =
        !normalizedFromDate ||
        (!!normalizedItemDate && normalizedItemDate >= normalizedFromDate);
      const matchesToDate =
        !normalizedToDate ||
        (!!normalizedItemDate && normalizedItemDate <= normalizedToDate);

      return (
        matchesSearch &&
        matchesAnnouncerName &&
        matchesColumnAnnouncerName &&
        matchesColumnMobileNo &&
        matchesAmount &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [
    appliedFilters.amount,
    appliedFilters.announcerName,
    appliedFilters.fromDate,
    appliedFilters.toDate,
    items,
    searchText,
    tableColumnFilters.announcerName,
    tableColumnFilters.mobileNo,
  ]);

  const sortedItems = useMemo(() => {
    if (!sortField || !sortDirection) {
      return filteredItems;
    }

    return [...filteredItems].sort((leftItem, rightItem) => {
      const leftValue = getSortValue(leftItem, sortField);
      const rightValue = getSortValue(rightItem, sortField);

      if (leftValue === rightValue) {
        return 0;
      }

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return sortDirection === 'asc'
          ? leftValue - rightValue
          : rightValue - leftValue;
      }

      return sortDirection === 'asc'
        ? String(leftValue).localeCompare(String(rightValue), undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        : String(rightValue).localeCompare(String(leftValue), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
    });
  }, [filteredItems, sortDirection, sortField]);

  const hasClientSideFilters = Boolean(
    searchText.trim() ||
      appliedFilters.announcerName.trim() ||
      tableColumnFilters.announcerName.trim() ||
      tableColumnFilters.mobileNo.trim() ||
      appliedFilters.amount.trim() ||
      appliedFilters.fromDate.trim() ||
      appliedFilters.toDate.trim(),
  );

  const paginatedItems = useMemo(() => {
    if (!hasClientSideFilters) {
      return sortedItems;
    }

    const startIndex = Math.max(0, (pageNumber - 1) * pageSize);
    return sortedItems.slice(startIndex, startIndex + pageSize);
  }, [hasClientSideFilters, pageNumber, pageSize, sortedItems]);

  const effectiveTotalCount = hasClientSideFilters
    ? sortedItems.length
    : Math.max(totalCount, items.length);
  const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / pageSize));
  const startRecord = effectiveTotalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRecord = effectiveTotalCount === 0
    ? 0
    : hasClientSideFilters
      ? Math.min(pageNumber * pageSize, effectiveTotalCount)
      : Math.min(startRecord + items.length - 1, effectiveTotalCount);
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const safeStartPage = Math.max(1, pageNumber - 2);
      const safeEndPage = Math.min(totalPages, safeStartPage + 4);
      const adjustedStartPage = Math.max(1, safeEndPage - 4);

      return adjustedStartPage + index;
    },
  );

  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  const getSortStateClass = (field: SortField) => {
    if (sortField !== field || !sortDirection) {
      return 'sorting';
    }

    return sortDirection === 'asc' ? 'sorting_asc' : 'sorting_desc';
  };

  const getSortIconClass = (field: SortField) => {
    if (sortField !== field || !sortDirection) {
      return 'fa-sort text-white-50';
    }

    return sortDirection === 'asc'
      ? 'fa-sort-up text-white'
      : 'fa-sort-down text-white';
  };

  const renderSortableHeader = (
    label: string,
    field: SortField,
    input?: React.ReactNode,
  ) => (
    <div className="d-flex gap-2 justify-content-center align-items-center">
      {input}
      <button
        type="button"
        className="btn btn-link btn-color-white btn-active-color-white p-0 text-decoration-none d-inline-flex align-items-center justify-content-center gap-2"
        onClick={() => handleSort(field)}
      >
        <span>{label}</span>
        <i className={`fas ${getSortIconClass(field)}`} aria-hidden="true"></i>
      </button>
      
    </div>
  );

  return (
    <div className="card announce-master-card" ref={listingRef}>
      <div className="card-header announce-master-card-header">
        <div className="card-title p-0">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">
              Announcement Details
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
              id="toggleFilter"
              className="btn btn-sm btn-flex btn-light btn-active-primary fw-bolder p-6"
              type="button"
              onClick={() => setIsFilterOpen(current => !current)}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-trigger="hover"
              data-bs-title="Open filters"
              title="Open filters"
              aria-pressed={isFilterOpen}
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
        <div className="0 announce-listing-filter-inner">
          <div className="card card-bordered bg-light">
            <div
              className="card-body p-6"
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleApplyFilters();
                }
              }}
            >
              <div className="row g-3">
                <div className="col-md-2">
                  <FloatingInputField
                    id="filterAnnounceId"
                    label="Announce ID"
                    value={draftFilters.announceId}
                    onChange={value => updateDraftFilter('announceId', value)}
                  />
                </div>

                <div className="col-md-2">
                  <FloatingInputField
                    id="filterAnnouncerName"
                    label="Announcer Name"
                    value={draftFilters.announcerName}
                    onChange={value =>
                      updateDraftFilter('announcerName', value)
                    }
                  />
                </div>

                <div className="col-md-2">
                  <FloatingInputField
                    id="filterMobileNo"
                    label="Mobile No."
                    value={draftFilters.mobileNo}
                    onChange={value => updateDraftFilter('mobileNo', value)}
                  />
                </div>

                <div className="col-md-2">
                  <FloatingInputField
                    id="filterAmount"
                    label="Amount"
                    value={draftFilters.amount}
                    onChange={value => updateDraftFilter('amount', value)}
                  />
                </div>

                <div className="col-md-2">
                  <FloatingDatePicker
                    id="filterFromDate"
                    label="From Date"
                    value={draftFilters.fromDate}
                    onChange={value => updateDraftFilter('fromDate', value)}
                  />
                </div>

                <div className="col-md-2">
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
            id="receiveTable"
            className="table table-row-bordered align-middle gs-0 gy-2 mb-0"
          >
            <thead>
              <tr className="fw-bolder text-uppercase text-nowrap">
                <th
                  className="min-w-100px text-center"
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                ></th>
                <th
                  className={`text-center ${getSortStateClass('announceId')}`}
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  {renderSortableHeader('Announce ID', 'announceId')}
                </th>
                <th
                  className={`text-center ${getSortStateClass('announcerName')}`}
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  {renderSortableHeader(
                    '',
                    'announcerName',
                    <input
                      type="text"
                      className="border-0 bg-transparent text-white text-end p-0 fs-6 placeholder-white w-125px"
                      placeholder="Announce Name"
                      value={tableColumnFilters.announcerName}
                      onChange={event =>
                        updateTableColumnFilter(
                          'announcerName',
                          event.target.value,
                        )
                      }
                      onClick={event => event.stopPropagation()}
                    />,
                  )}
                </th>
                <th
                  className={`text-center ${getSortStateClass('mobileNo')}`}
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  {renderSortableHeader(
                    '',
                    'mobileNo',
                    <input
                      type="text"
                       className="border-0 bg-transparent text-white text-end p-0 fs-6 placeholder-white w-125px"
                      placeholder="Search mobile"
                      value={tableColumnFilters.mobileNo}
                      onChange={event =>
                        updateTableColumnFilter('mobileNo', event.target.value)
                      }
                      onClick={event => event.stopPropagation()}
                    />,
                  )}
                </th>
                <th
                  className={`text-center ${getSortStateClass('announceAmount')}`}
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  {renderSortableHeader('Amount', 'announceAmount')}
                </th>
                <th
                  className={`text-center ${getSortStateClass('announceDate')}`}
                  style={{ background: '#2A2B6B', color: '#ffffff' }}
                >
                  {renderSortableHeader('Announce Date', 'announceDate')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted">
                    Loading announcements...
                  </td>
                </tr>
              ) : paginatedItems.length ? (
                paginatedItems.map(item => (
                  <tr key={item.announceId} valign="top">
                    <td className="d-flex gap-6">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-light"
                        onClick={() => onEdit(item.announceId)}
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
                        onClick={() => onView(item.announceId)}
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
                        onClick={() => onDelete(item.announceId)}
                        disabled={deletingId === item.announceId}
                        title="Delete"
                      >
                        <i
                          className="fa fa-trash text-danger"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </td>
                    <td className="text-center">{item.announceId || '-'}</td>
                    <td className="text-center">{item.announcerName || '-'}</td>
                    <td className="text-center">{item.mobileNo || '-'}</td>
                    <td className="text-center">
                      {item.announceAmount || '-'}
                    </td>
                    <td className="text-center">{item.announceDate || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted">
                    No announcements found.
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
              Showing {startRecord} to {endRecord} of {effectiveTotalCount}
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
