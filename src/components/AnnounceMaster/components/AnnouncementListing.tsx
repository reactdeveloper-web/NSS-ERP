import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axiosInstance from 'src/redux/interceptor';
import { ContentTypes } from 'src/constants/content';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  extractArrayPayload,
  getFirstValue,
  normalizeApiDate,
  parseStoredUser,
} from '../AnnounceMasterContent.helpers';
import { EventOption } from '../types';

export interface AnnouncementListingItem {
  announceId: string;
  announcerCode: string;
  announcerName: string;
  donorCity: string;
  bhagwatCity: string;
  announceAmount: string;
  announceDate: string;
  remark: string;
  cause: string;
  receive: string;
  userName: string;
  lastEditBy: string;
}

interface AnnouncementListFilters {
  announceId: string;
  mobileNo: string;
  emailId: string;
  donorId: string;
  fromDate: string;
  toDate: string;
  causeHeadId: string;
  causeId: string;
  purposeId: string;
  eventId: string;
  howToDonateId: string;
  completed: boolean | null;
}

interface AnnouncementListingProps {
  deletingId: string | null;
  causeHeadOptions: EventOption[];
  howToDonateOptions: EventOption[];
  onAdd: () => void;
  onEdit: (announceId: string) => void;
  onView: (announceId: string) => void;
  onDelete: (announceId: string) => void;
}

const createInitialFilters = (): AnnouncementListFilters => ({
  announceId: '',
  mobileNo: '',
  emailId: '',
  donorId: '',
  fromDate: '',
  toDate: '',
  causeHeadId: '',
  causeId: '',
  purposeId: '',
  eventId: '',
  howToDonateId: '',
  completed: null,
});

const formatDisplayDate = (value: string) => {
  const trimmedValue = value.trim();
  const normalizedValue = normalizeApiDate(trimmedValue);

  if (normalizedValue) {
    return normalizedValue.split('-').reverse().join('/');
  }

  return trimmedValue || '-';
};

const formatDisplayDateTime = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '-';
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    const fallbackDate = normalizeApiDate(trimmedValue);

    return fallbackDate
      ? fallbackDate.split('-').reverse().join('/')
      : trimmedValue;
  }

  const datePart = parsedDate.toLocaleDateString('en-GB');
  const timePart = parsedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return `${datePart} ${timePart}`;
};

const formatCombinedText = (
  record: Record<string, unknown>,
  fieldGroups: string[][],
) =>
  fieldGroups
    .map(fieldNames => getFirstValue(record, fieldNames))
    .filter(part => part.trim() !== '')
    .join(', ');

const mapAnnouncementListItem = (
  record: Record<string, unknown>,
): AnnouncementListingItem => {
  const announceId = getFirstValue(record, [
    'announce_id',
    'AnnounceID',
    'AnnounceId',
    'announceId',
    'ReceiveID',
    'ReceiveId',
  ]);
  const announcerCode = getFirstValue(record, [
    'AnnouncerCode',
    'announcer_code',
    'ReceiveID',
    'ReceiveId',
    'receive_id',
    'RecieveID',
    'RecieveId',
    'announce_id',
    'AnnounceID',
  ]);
  const announceDate = getFirstValue(record, [
    'announce_date',
    'AnnounceDate',
    'Date',
    'date',
    'crt_datetime',
    'edit_datetime',
  ]);
  const lastEditValue = getFirstValue(record, [
    'edit_datetime',
    'EditDateTime',
    'last_edit_datetime',
    'LastEditDateTime',
    'modified_on',
    'updated_at',
    'crt_datetime',
  ]);

  return {
    announceId,
    announcerCode: announcerCode || announceId,
    announcerName: getFirstValue(record, [
      'announcer_name',
      'AnnouncerName',
      'DonorName',
      'donor_name',
      'DName',
      'name',
    ]),
    donorCity: getFirstValue(record, [
      'DonorCity',
      'donor_city',
      'CityName',
      'city_name',
      'City',
      'city',
    ]),
    bhagwatCity: getFirstValue(record, [
      'BhagwatCity',
      'bhagwat_city',
      'BhagwatCityName',
      'bhagwat_city_name',
      'Bhagwat_City',
    ]),
    announceAmount: getFirstValue(record, [
      'announce_amount',
      'AnnounceAmount',
      'amount',
      'Amount',
    ]),
    announceDate: formatDisplayDateTime(announceDate),
    remark: formatCombinedText(record, [
      ['remark', 'Remark', 'remark1', 'Remark1'],
      ['remark2', 'Remark2', 'occasion_remark'],
      ['second_remark', 'SecondRemark'],
      ['third_remark', 'ThirdRemark'],
    ]),
    cause:
      formatCombinedText(record, [
        ['cause_name', 'CauseName', 'purpose_name', 'PurposeName'],
        ['purpose', 'Purpose', 'cause_head_name', 'CauseHeadName'],
        ['event_name', 'EventName'],
        ['city_name', 'CityName'],
        ['state_name', 'StateName'],
      ]) ||
      getFirstValue(record, [
        'cause',
        'Cause',
        'cause_details',
        'CauseDetails',
      ]),
    receive: getFirstValue(record, [
      'receive_id_by',
      'ReceiveIdBy',
      'ReceiveBy',
      'receive_by',
      'receive_head_by',
    ]),
    userName: getFirstValue(record, [
      'user_name',
      'UserName',
      'entry_by',
      'EntryBy',
      'crt_name',
      'created_by_name',
    ]),
    lastEditBy:
      [
        getFirstValue(record, [
          'edit_user_name',
          'EditUserName',
          'last_edit_by',
          'LastEditBy',
          'crt_name',
        ]),
        formatDisplayDateTime(lastEditValue),
      ]
        .filter(part => part.trim() !== '' && part !== '-')
        .join(' ')
        .trim() || '-',
  };
};

const extractTotalCount = (payload: unknown, fallbackCount: number): number => {
  if (!payload || typeof payload !== 'object') {
    return fallbackCount;
  }

  const record = payload as Record<string, unknown>;
  const totalCount = Number(
    getFirstValue(record, [
      'TotalCount',
      'totalCount',
      'total_count',
      'RecordCount',
      'recordCount',
    ]),
  );

  return Number.isFinite(totalCount) && totalCount > 0
    ? totalCount
    : fallbackCount;
};

export const AnnouncementListing = ({
  deletingId,
  causeHeadOptions,
  howToDonateOptions,
  onAdd,
  onEdit,
  onView,
  onDelete,
}: AnnouncementListingProps) => {
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

  const updateDraftFilter = <K extends keyof AnnouncementListFilters>(
    field: K,
    value: AnnouncementListFilters[K],
  ) => {
    setDraftFilters(current => ({
      ...current,
      [field]: value,
    }));
  };

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
      email_id: appliedFilters.emailId.trim() || null,
      purpose: Number(appliedFilters.causeHeadId || 0) || null,
      completed:
        appliedFilters.completed === null
          ? null
          : appliedFilters.completed
          ? 1
          : 0,
      remark1: Number(appliedFilters.howToDonateId || 0) || null,
      user_id:
        Number(
          currentUser.user_id || currentUser.UserId || currentUser.id || 0,
        ) || null,
      ngcode: appliedFilters.donorId.trim() || null,
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
      cause_id: Number(appliedFilters.causeId || 0) || null,
      purpose_id: Number(appliedFilters.purposeId || 0) || null,
      ash_event_id: Number(appliedFilters.eventId || 0) || null,
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

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter(item =>
      [
        item.announcerCode,
        item.announcerName,
        item.donorCity,
        item.bhagwatCity,
        item.announceDate,
        item.announceAmount,
        item.remark,
        item.cause,
        item.receive,
        item.userName,
        item.lastEditBy,
      ].some(field => field.toLowerCase().includes(normalizedSearch)),
    );
  }, [items, searchText]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startRecord = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRecord =
    totalCount === 0 ? 0 : Math.min(pageNumber * pageSize, totalCount);
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const safeStartPage = Math.max(1, pageNumber - 2);
      const safeEndPage = Math.min(totalPages, safeStartPage + 4);
      const adjustedStartPage = Math.max(1, safeEndPage - 4);

      return adjustedStartPage + index;
    },
  );

  return (
    <div className="card card-xl-stretch mb-5 mb-xl-8">
      <div className="card-header border-0 p-4 pt-2 pb-0">
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
              <span className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle-y ms-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    opacity="0.5"
                    x="17.0365"
                    y="15.1223"
                    width="8.15546"
                    height="2"
                    rx="1"
                    transform="rotate(45 17.0365 15.1223)"
                    fill="currentColor"
                  ></rect>
                  <path
                    d="M11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 15.4183 15.4183 19 11 19Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
              <input
                type="text"
                className="form-control w-250px ps-12"
                placeholder="Search records..."
                value={searchText}
                onChange={event => setSearchText(event.target.value)}
              />
            </div>

            <button
              id="toggleFilter"
              className="btn btn-sm btn-flex btn-light btn-active-primary fw-bolder p-3"
              type="button"
              onClick={() => setIsFilterOpen(current => !current)}
            >
              <i className="fas fa-filter fs-4" />
            </button>

            <button
              className="btn btn-sm btn-primary btn-active-primary p-3"
              type="button"
              onClick={onAdd}
            >
              <span className="svg-icon svg-icon-3 me-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    opacity="0.5"
                    x="11.364"
                    y="20.364"
                    width="16"
                    height="2"
                    rx="1"
                    transform="rotate(-90 11.364 20.364)"
                    fill="black"
                  ></rect>
                  <rect
                    x="4.36396"
                    y="11.364"
                    width="16"
                    height="2"
                    rx="1"
                    fill="black"
                  ></rect>
                </svg>
              </span>
              Add
            </button>
          </div>
        </div>
      </div>

      {isFilterOpen ? (
        <div className="px-5 pb-5">
          <div className="card card-bordered bg-light">
            <div className="card-body">
              <div className="row g-5">
                <div className="col-md-3">
                  <label className="fw-bold mb-2">Announce ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={draftFilters.announceId}
                    onChange={event =>
                      updateDraftFilter('announceId', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">Donor ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={draftFilters.donorId}
                    onChange={event =>
                      updateDraftFilter('donorId', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">Mobile No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={draftFilters.mobileNo}
                    onChange={event =>
                      updateDraftFilter('mobileNo', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">Email ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={draftFilters.emailId}
                    onChange={event =>
                      updateDraftFilter('emailId', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={draftFilters.fromDate}
                    onChange={event =>
                      updateDraftFilter('fromDate', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={draftFilters.toDate}
                    onChange={event =>
                      updateDraftFilter('toDate', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">Cause Head</label>
                  <select
                    className="form-select"
                    value={draftFilters.causeHeadId}
                    onChange={event =>
                      updateDraftFilter('causeHeadId', event.target.value)
                    }
                  >
                    <option value="">All</option>
                    {causeHeadOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">How To Donate</label>
                  <select
                    className="form-select"
                    value={draftFilters.howToDonateId}
                    onChange={event =>
                      updateDraftFilter('howToDonateId', event.target.value)
                    }
                  >
                    <option value="">All</option>
                    {howToDonateOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">Cause ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={draftFilters.causeId}
                    onChange={event =>
                      updateDraftFilter('causeId', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">Purpose ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={draftFilters.purposeId}
                    onChange={event =>
                      updateDraftFilter('purposeId', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="fw-bold mb-2">Event ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={draftFilters.eventId}
                    onChange={event =>
                      updateDraftFilter('eventId', event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <label className="form-check form-check-custom form-check-solid mb-2">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={Boolean(draftFilters.completed)}
                      onChange={event =>
                        updateDraftFilter('completed', event.target.checked)
                      }
                    />
                    <span className="form-check-label fw-bold">
                      Completed Only
                    </span>
                  </label>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-6">
                <button
                  className="btn btn-light me-3"
                  type="button"
                  onClick={() => {
                    const initialFilters = createInitialFilters();
                    setDraftFilters(initialFilters);
                    setAppliedFilters(initialFilters);
                    setPageNumber(1);
                    setSearchText('');
                  }}
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setAppliedFilters(draftFilters);
                    setPageNumber(1);
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="card-body p-3">
        {error ? <div className="alert alert-warning m-3">{error}</div> : null}

        <div className="table-responsive" style={{ maxHeight: '550px' }}>
          <table
            id="receiveTable"
            className="table table-row-bordered align-middle gs-0 gy-2 mb-0"
          >
            <thead>
              <tr
                className="fw-bolder text-uppercase text-nowrap"
                style={{ backgroundColor: '#22b8ad', color: '#ffffff' }}
              >
                <th className="min-w-40px text-center text-white"></th>
                <th className="min-w-40px text-center text-white"></th>
                <th className="min-w-40px text-center text-white"></th>
                <th className="min-w-140px text-white">Announce ID</th>
                <th className="min-w-140px text-white">Announcer Name</th>
                <th className="min-w-110px text-white">Donor City</th>
                <th className="min-w-110px text-white">Bhagwat City</th>
                <th className="min-w-110px text-white">Amount</th>
                <th className="min-w-160px text-white">Announce Date</th>
                <th className="min-w-250px text-white">Remark</th>
                <th className="min-w-350px text-white">Cause</th>
                <th className="min-w-90px text-white">Receive</th>
                <th className="min-w-120px text-white">User Name</th>
                <th className="min-w-190px text-white">Last Edit By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="text-center py-10 text-muted">
                    Loading announcements...
                  </td>
                </tr>
              ) : filteredItems.length ? (
                filteredItems.map(item => (
                  <tr
                    key={`${item.announceId}-${item.announcerCode}`}
                    valign="top"
                  >
                    <td className="text-center">
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
                    </td>
                    <td className="text-center">
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
                    </td>
                    <td className="text-center">
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
                    <td>
                      <div className="fw-semibold text-dark">
                        {item.announceId || '-'}
                      </div>
                      <div className="text-muted fs-8">
                        {item.announcerCode || '-'}
                      </div>
                    </td>
                    <td>{item.announcerName || '-'}</td>
                    <td>{item.donorCity || '-'}</td>
                    <td>{item.bhagwatCity || '-'}</td>
                    <td>{item.announceAmount || '-'}</td>
                    <td>{item.announceDate || '-'}</td>
                    <td className="mw-250px">{item.remark || '-'}</td>
                    <td className="mw-350px">{item.cause || '-'}</td>
                    <td>{item.receive || '-'}</td>
                    <td>{item.userName || '-'}</td>
                    <td>{item.lastEditBy || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} className="text-center py-10 text-muted">
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
              Showing {startRecord} to {endRecord} of{' '}
              {totalCount || filteredItems.length}
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
