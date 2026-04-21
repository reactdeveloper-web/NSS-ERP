import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ContentTypes } from 'src/constants/content';
import {
  DEFAULT_RECEIVE_ID_HEAD,
  RECEIVE_ID_HEADS,
} from 'src/constants/receiveIdHeads';
import axiosInstance from 'src/redux/interceptor';
import { masterApiHeaders } from 'src/utils/masterApiHeaders';
import { masterApiPaths } from 'src/utils/masterApiPaths';
import {
  extractArrayPayload,
  getFirstValue,
  parseStoredUser,
} from 'src/components/AnnounceMaster/AnnounceMasterContent.helpers';

export interface ReceiveIdListingItem {
  receiveDid: string;
  receiveId: string;
  postId: string;
  receiveHead: string;
  receiveDateDisplay: string;
  receiveUserName: string;
  receiveAmount: string;
  currency: string;
  receiveName: string;
  receiveAddress: string;
  receiveType: string;
  receivePayModeDisplay: string;
  receiveCheque: string;
  forwardedTo: string;
  callRemark: string;
  receiveMob: string;
  detailsNotComplete: string;
  letterId: string;
  fileCount: string;
}

interface ReceiveIdListFilters {
  postId: string;
  receiveId: string;
  receiveHead: string;
  donorName: string;
  amount: string;
  chequeNo: string;
  receivePayMode: string;
  material: string;
  receiveDate: string;
}

interface ReceiveIdListingProps {
  onAdd: () => void;
  onEdit: (receiveId: string) => void;
  onView: (receiveId: string) => void;
}

const receivePayModeOptions = [
  { value: 'All', label: 'All' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Online', label: 'Online' },
  { value: 'UPI', label: 'UPI' },
];

const createInitialFilters = (): ReceiveIdListFilters => ({
  postId: '',
  receiveId: '',
  receiveHead: DEFAULT_RECEIVE_ID_HEAD,
  donorName: '',
  amount: '',
  chequeNo: '',
  receivePayMode: 'All',
  material: '',
  receiveDate: '',
});

const mapReceiveIdListingItem = (
  record: Record<string, unknown>,
): ReceiveIdListingItem => ({
  receiveDid: getFirstValue(record, ['Receive_DID']),
  receiveId: getFirstValue(record, ['Receive_id']),
  postId: getFirstValue(record, ['Post_id']),
  receiveHead: getFirstValue(record, ['Receive_Head']),
  receiveDateDisplay: getFirstValue(record, ['Receive_Date_Display']),
  receiveUserName: getFirstValue(record, ['Receive_User_Name']),
  receiveAmount: getFirstValue(record, ['Receive_Amount']),
  currency: getFirstValue(record, ['Currency']),
  receiveName: getFirstValue(record, ['Receive_Name']),
  receiveAddress: getFirstValue(record, ['Receive_Address']),
  receiveType: getFirstValue(record, ['Receive_Type']),
  receivePayModeDisplay: getFirstValue(record, ['Receive_PayMode_Display']),
  receiveCheque:
    getFirstValue(record, ['Receive_Cheque']) ||
    getFirstValue(record, ['Receive_Cheque2']) ||
    getFirstValue(record, ['Receive_Cheque3']),
  forwardedTo: getFirstValue(record, ['FWD_TO_SS']),
  callRemark: getFirstValue(record, ['Call_Remark']),
  receiveMob: getFirstValue(record, ['Receive_Mob']),
  detailsNotComplete: getFirstValue(record, ['Details_Not_Complete']),
  letterId: getFirstValue(record, ['Letter_Id']),
  fileCount: getFirstValue(record, ['File_Count']),
});

const extractMetaTotalCount = (payload: unknown, fallbackCount: number) => {
  if (!payload || typeof payload !== 'object') {
    return fallbackCount;
  }

  const record = payload as Record<string, unknown>;
  const meta = record.Meta;

  if (meta && typeof meta === 'object') {
    const totalRecords = Number(
      getFirstValue(meta as Record<string, unknown>, ['TotalRecords']),
    );

    if (Number.isFinite(totalRecords) && totalRecords >= 0) {
      return totalRecords;
    }
  }

  const [firstRow] = extractArrayPayload(payload);
  const rowTotal = firstRow
    ? Number(getFirstValue(firstRow, ['TotalRecords', 'TotalRecord']))
    : NaN;

  return Number.isFinite(rowTotal) && rowTotal >= 0
    ? rowTotal
    : fallbackCount;
};

export const ReceiveIdListing = ({
  onAdd,
  onEdit,
  onView,
}: ReceiveIdListingProps) => {
  const location = useLocation();
  const [items, setItems] = useState<ReceiveIdListingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ReceiveIdListFilters>(
    createInitialFilters(),
  );
  const [appliedFilters, setAppliedFilters] = useState<ReceiveIdListFilters>(
    createInitialFilters(),
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const routeReceiveHead = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const head = searchParams.get('HEAD')?.trim().toUpperCase();

    return (
      RECEIVE_ID_HEADS.find(option => option.value === head)?.value ||
      DEFAULT_RECEIVE_ID_HEAD
    );
  }, [location.search]);

  useEffect(() => {
    setItems([]);
    setTotalCount(0);
    setDraftFilters(current => ({
      ...current,
      receiveHead: routeReceiveHead,
    }));
    setAppliedFilters(current => ({
      ...current,
      receiveHead: routeReceiveHead,
    }));
    setPageNumber(1);
  }, [routeReceiveHead]);

  const updateDraftFilter = <K extends keyof ReceiveIdListFilters>(
    field: K,
    value: ReceiveIdListFilters[K],
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
    const initialFilters = {
      ...createInitialFilters(),
      receiveHead: routeReceiveHead,
    };
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSearchText('');
    setPageNumber(1);
  };

  const fetchReceiveIds = useCallback(async () => {
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
      Receive_Id: Number(appliedFilters.receiveId || 0) || null,
      Receive_head:
        appliedFilters.receiveHead.trim() || DEFAULT_RECEIVE_ID_HEAD,
      NGCode: Number(appliedFilters.ngCode || 0) || null,
      Data_Flag:
        currentUser.DataFlag ||
        currentUser.dataFlag ||
        currentUser.Data_Flag ||
        ContentTypes.DataFlag,
      FY_ID:
        Number(
          currentUser.fy_id || currentUser.fyId || currentUser.FY_ID || 21,
        ) || 21,
      User_ID:
        Number(currentUser.user_id || currentUser.UserId || currentUser.id || 0) ||
        null,
      Prov_No: null,
      Receive_PayMode: appliedFilters.receivePayMode || 'All',
      PostType: null,
      Donor_Name: appliedFilters.donorName.trim() || null,
      Cheque_No: appliedFilters.chequeNo.trim() || null,
      State_Id: null,
      City_Id: null,
      Amount: appliedFilters.amount.trim() || null,
      Receive_Date: appliedFilters.receiveDate || null,
      Material: appliedFilters.material.trim() || null,
      PageNumber: pageNumber,
      PageSize: pageSize,
    };

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(
        masterApiPaths.getReceiveIdDetailsByFilter,
        payload,
        {
          headers: masterApiHeaders(),
        },
      );

      const records = extractArrayPayload(response.data);
      const mappedItems = records.map(mapReceiveIdListingItem);

      setItems(mappedItems);
      setTotalCount(extractMetaTotalCount(response.data, mappedItems.length));
    } catch (apiError: any) {
      setItems([]);
      setTotalCount(0);
      setError(
        apiError?.response?.data?.message ||
          apiError?.response?.data?.Message ||
          apiError?.message ||
          'Receive ID list load nahi hui.',
      );
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, pageNumber, pageSize]);

  useEffect(() => {
    void fetchReceiveIds();
  }, [fetchReceiveIds]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter(item =>
      [
        item.receiveId,
        item.postId,
        item.receiveHead,
        item.receiveDateDisplay,
        item.receiveUserName,
        item.receiveAmount,
        item.currency,
        item.receiveName,
        item.receiveAddress,
        item.receiveType,
        item.receivePayModeDisplay,
        item.receiveCheque,
        item.forwardedTo,
        item.callRemark,
        item.receiveMob,
      ].some(field => field.toLowerCase().includes(normalizedSearch)),
    );
  }, [items, searchText]);

  const serverAndClientFilteredItems = useMemo(() => {
    return filteredItems.filter(item => {
      const postIdMatch = appliedFilters.postId.trim()
        ? item.postId
            .toLowerCase()
            .includes(appliedFilters.postId.trim().toLowerCase())
        : true;

      return postIdMatch;
    });
  }, [appliedFilters.postId, filteredItems]);

  const hasClientSearch = Boolean(searchText.trim());
  const hasPostIdFilter = Boolean(appliedFilters.postId.trim());
  const paginatedItems =
    hasClientSearch || hasPostIdFilter ? serverAndClientFilteredItems : items;
  const effectiveTotalCount =
    hasClientSearch || hasPostIdFilter
      ? serverAndClientFilteredItems.length
      : totalCount;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / pageSize));
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
    const safeStartPage = Math.max(1, pageNumber - 2);
    const safeEndPage = Math.min(totalPages, safeStartPage + 4);
    const adjustedStartPage = Math.max(1, safeEndPage - 4);

    return adjustedStartPage + index;
  });
  const startRecord =
    effectiveTotalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRecord =
    effectiveTotalCount === 0
      ? 0
      : hasClientSearch
      ? Math.min(pageNumber * pageSize, effectiveTotalCount)
      : Math.min(startRecord + items.length - 1, effectiveTotalCount);

  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  return (
    <div className="card announce-master-card">
      <div className="card-header announce-master-card-header">
        <div className="card-title p-0">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">
              Receive ID Details
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
            >
              <i className="fas fa-filter fs-4" />
            </button>

            <button
              type="button"
              onClick={onAdd}
              className="btn btn-sm btn-primary btn-active-primary p-3 fs-6"
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
                    id="filterPostId"
                    label="Post ID"
                    value={draftFilters.postId}
                    onChange={value => updateDraftFilter('postId', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterReceiveId"
                    label="Receive ID"
                    value={draftFilters.receiveId}
                    onChange={value => updateDraftFilter('receiveId', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterDonorName"
                    label="Donator Name"
                    value={draftFilters.donorName}
                    onChange={value => updateDraftFilter('donorName', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingDatePicker
                    id="filterReceiveDate"
                    label="Receive Date"
                    value={draftFilters.receiveDate}
                    onChange={value => updateDraftFilter('receiveDate', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterMaterial"
                    label="Material"
                    value={draftFilters.material}
                    onChange={value => updateDraftFilter('material', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterChequeNo"
                    label="Chq No."
                    value={draftFilters.chequeNo}
                    onChange={value => updateDraftFilter('chequeNo', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingSelectField
                    id="filterReceivePayMode"
                    label="Pay Mode"
                    value={draftFilters.receivePayMode}
                    options={receivePayModeOptions}
                    onChange={value =>
                      updateDraftFilter('receivePayMode', value as string)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterAmount"
                    label="Amount"
                    value={draftFilters.amount}
                    onChange={value => updateDraftFilter('amount', value)}
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
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Receive ID
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Post ID
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Receive Head
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Date
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Entry By
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Amount
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Currency
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Donor Name
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Address
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Type
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Payment Mode
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Mobile
                </th>
                <th className="text-center" style={{ background: '#2A2B6B', color: '#ffffff' }}>
                  Forwarded
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="text-center py-10 text-muted">
                    Loading receive IDs...
                  </td>
                </tr>
              ) : paginatedItems.length ? (
                paginatedItems.map((item, index) => (
                  <tr
                    key={`${routeReceiveHead}-${
                      item.receiveDid || item.receiveId || index
                    }-${index}`}
                  >
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-light"
                          onClick={() => onEdit(item.receiveId)}
                          title="Edit"
                        >
                          <i className="fa fa-edit text-info" aria-hidden="true"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-light"
                          onClick={() => onView(item.receiveId)}
                          title="View"
                        >
                          <i className="fa fa-eye text-success" aria-hidden="true"></i>
                        </button>
                      </div>
                    </td>
                    <td className="text-center">{item.receiveId || '-'}</td>
                    <td className="text-center">{item.postId || '-'}</td>
                    <td className="text-center">{item.receiveHead || '-'}</td>
                    <td className="text-center">{item.receiveDateDisplay || '-'}</td>
                    <td className="text-center">{item.receiveUserName || '-'}</td>
                    <td className="text-center">{item.receiveAmount || '-'}</td>
                    <td className="text-center">{item.currency || '-'}</td>
                    <td className="text-center">
                      {item.receiveName.trim() || '-'}
                    </td>
                    <td className="text-start">{item.receiveAddress || '-'}</td>
                    <td className="text-center">{item.receiveType || '-'}</td>
                    <td className="text-center">
                      {item.receivePayModeDisplay || '-'}
                    </td>
                    <td className="text-center">{item.receiveMob || '-'}</td>
                    <td className="text-center">{item.forwardedTo || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} className="text-center py-10 text-muted">
                    No receive ID records found.
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
