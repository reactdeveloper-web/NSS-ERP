import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FloatingDatePicker } from 'src/components/Common/FloatingDatePicker';
import { FloatingInputField } from 'src/components/Common/FloatingInputField';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { MetronicDropdown } from 'src/components/Common/MetronicDropdown';
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
  city: string;
  state: string;
  provisionalNo: string;
  orderType: string;
}

interface ReceiveIdListingProps {
  onAdd: () => void;
  onEdit: (receiveId: string) => void;
  onView: (receiveId: string) => void;
}

type ReceiveIdColumnKey =
  | 'actions'
  | 'receiveId'
  | 'postId'
  | 'receiveHead'
  | 'receiveDateDisplay'
  | 'receiveUserName'
  | 'receiveAmount'
  | 'currency'
  | 'receiveName'
  | 'receiveAddress'
  | 'receiveType'
  | 'receivePayModeDisplay'
  | 'receiveMob'
  | 'forwardedTo';

interface ReceiveIdColumnConfig {
  key: ReceiveIdColumnKey;
  label: string;
  headerLabel?: string;
  headerClassName?: string;
  cellClassName?: string;
}

const receivePayModeOptions = [
  { value: 'All', label: 'All' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Online', label: 'Online' },
  { value: 'UPI', label: 'UPI' },
];

const cityOptions = [
  { value: '', label: 'Select City' },
  { value: 'Udaipur', label: 'Udaipur' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Ahmedabad', label: 'Ahmedabad' },
];

const stateOptions = [
  { value: '', label: 'Select State' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Gujarat', label: 'Gujarat' },
];

const orderTypeOptions = [
  { value: 'All', label: 'All' },
  { value: 'N.A.', label: 'N.A.' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Online', label: 'Online' },
];

const receiveIdColumns: ReceiveIdColumnConfig[] = [
  {
    key: 'actions',
    label: 'Actions',
    headerLabel: '',
    headerClassName: 'min-w-100px w-100px text-center position-sticky start-0',
    cellClassName: 'text-center position-sticky start-0 bg-white',
  },
  { key: 'receiveId', label: 'Receive ID', cellClassName: 'text-center' },
   { key: 'receiveName', label: 'Donor Name', cellClassName: 'text-center' },  
   { key: 'receiveMob', label: 'Mobile', cellClassName: 'text-center' },
   { key: 'receiveAmount', label: 'Amount', cellClassName: 'text-center' },
  { key: 'receiveUserName', label: 'Entry By', cellClassName: 'text-center' },
  { key: 'postId', label: 'Post ID', cellClassName: 'text-center' },
  { key: 'receiveHead', label: 'Receive Head', cellClassName: 'text-center' },
  { key: 'receiveDateDisplay', label: 'Date', cellClassName: 'text-center' },
  
  
  { key: 'currency', label: 'Currency', cellClassName: 'text-center' },
 
  { key: 'receiveType', label: 'Type', cellClassName: 'text-center' },  
  { key: 'receiveAddress', label: 'Address', cellClassName: 'text-start' },
  {
    key: 'receivePayModeDisplay',
    label: 'Payment Mode',
    cellClassName: 'text-center',
  },
  
  { key: 'forwardedTo', label: 'Forwarded', cellClassName: 'text-center' },
];

const receiveIdColumnConfigByKey = receiveIdColumns.reduce(
  (columnsByKey, column) => ({
    ...columnsByKey,
    [column.key]: column,
  }),
  {} as Record<ReceiveIdColumnKey, ReceiveIdColumnConfig>,
);

const defaultColumnOrderKeys = receiveIdColumns.map(column => column.key);

const defaultVisibleColumnKeys: ReceiveIdColumnKey[] = [
  'actions',
  'receiveId',
  'receiveName',
  'receiveMob',
  'receiveAmount', 
  'receiveUserName',
];

const tableHeaderStyle = {
  // background: '#2A2B6B',
  // color: '#ffffff',
};

const stickyActionHeaderStyle = {
  ...tableHeaderStyle,
  left: 0,
  zIndex: 4,
};

const stickyActionCellStyle = {
  left: 0,
  minWidth: '100px',
  width: '100px',
  zIndex: 3,
};

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
  city: '',
  state: '',
  provisionalNo: '',
  orderType: 'All',
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
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<
    ReceiveIdColumnKey[]
  >(defaultVisibleColumnKeys);
  const [columnOrderKeys, setColumnOrderKeys] = useState<
    ReceiveIdColumnKey[]
  >(defaultColumnOrderKeys);
  const [draggedColumnKey, setDraggedColumnKey] =
    useState<ReceiveIdColumnKey | null>(null);
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
      Prov_No: appliedFilters.provisionalNo.trim() || null,
      Receive_PayMode: appliedFilters.receivePayMode || 'All',
      PostType:
        appliedFilters.orderType && appliedFilters.orderType !== 'All'
          ? appliedFilters.orderType
          : null,
      Donor_Name: appliedFilters.donorName.trim() || null,
      Cheque_No: appliedFilters.chequeNo.trim() || null,
      State_Id: appliedFilters.state.trim() || null,
      City_Id: appliedFilters.city.trim() || null,
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
  const visibleColumns = useMemo(
    () =>
      ['actions' as ReceiveIdColumnKey, ...columnOrderKeys.filter(columnKey => columnKey !== 'actions')]
        .filter(columnKey => columnKey === 'actions' || visibleColumnKeys.includes(columnKey))
        .map(columnKey => receiveIdColumnConfigByKey[columnKey]),
    [columnOrderKeys, visibleColumnKeys],
  );
  const visibleColumnCount = Math.max(visibleColumns.length, 1);

  const toggleColumnVisibility = (columnKey: ReceiveIdColumnKey) => {
    if (columnKey === 'actions') {
      return;
    }

    setVisibleColumnKeys(current => {
      if (current.includes(columnKey)) {
        return current.length === 1
          ? current
          : current.filter(key => key !== columnKey);
      }

      return [...current, columnKey];
    });
  };

  const handleColumnDragStart = (
    event: React.DragEvent<HTMLSpanElement>,
    columnKey: ReceiveIdColumnKey,
  ) => {
    if (columnKey === 'actions') {
      return;
    }

    setDraggedColumnKey(columnKey);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', columnKey);
  };

  const handleColumnDrop = (
    event: React.DragEvent<HTMLLabelElement>,
    targetColumnKey: ReceiveIdColumnKey,
  ) => {
    event.preventDefault();

    if (targetColumnKey === 'actions') {
      setDraggedColumnKey(null);
      return;
    }

    const sourceColumnKey = (event.dataTransfer.getData('text/plain') ||
      draggedColumnKey) as ReceiveIdColumnKey | null;

    if (
      !sourceColumnKey ||
      sourceColumnKey === 'actions' ||
      sourceColumnKey === targetColumnKey
    ) {
      setDraggedColumnKey(null);
      return;
    }

    setColumnOrderKeys(current => {
      const nextOrder = current.filter(columnKey => columnKey !== sourceColumnKey);
      const targetIndex = nextOrder.indexOf(targetColumnKey);

      if (targetIndex < 0) {
        return current;
      }

      nextOrder.splice(targetIndex, 0, sourceColumnKey);

      return nextOrder;
    });
    setDraggedColumnKey(null);
  };

  const renderColumnCell = (
    item: ReceiveIdListingItem,
    columnKey: ReceiveIdColumnKey,
  ) => {
    if (columnKey === 'actions') {
      return (
        <div className="d-flex gap-2 justify-content-center">
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
      );
    }

    const value = item[columnKey];

    return value.trim() || '-';
  };

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
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-trigger="hover"
              data-bs-title="Open filters"
              title="Open filters"
              aria-pressed={isFilterOpen}
            >
              <i className="fas fa-filter fs-4" />
            </button>

            <MetronicDropdown
              wrapperClassName="position-relative"
              menuClassName="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 fw-bold py-3 w-250px show-dropdown-menu end-0"
              trigger={
                <button
                  className="btn btn-sm btn-flex btn-light btn-active-primary fw-bolder p-6"
                  type="button"
                  title="Show/hide columns"
                >
                  <i className="fas fa-columns fs-4" />
                </button>
              }
            >
              <div className="menu-item px-3">
                <div className="menu-content text-muted pb-2 px-0 fs-8 text-uppercase">
                  Columns
                </div>
              </div>
              {columnOrderKeys.map(columnKey => {
                const column = receiveIdColumnConfigByKey[columnKey];
                const isLockedColumn = column.key === 'actions';

                return (
                <label
                  key={column.key}
                  className="menu-item px-3 py-2 d-flex align-items-center gap-3 cursor-pointer"
                  onDragOver={event => {
                    if (!isLockedColumn) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={event => handleColumnDrop(event, column.key)}
                  style={{
                    opacity: draggedColumnKey === column.key ? 0.55 : 1,
                  }}
                >
                  <span
                    draggable={!isLockedColumn}
                    className={isLockedColumn ? 'text-gray-400' : 'text-muted'}
                    title={
                      isLockedColumn ? 'Fixed column' : 'Drag to reorder'
                    }
                    onDragStart={event =>
                      handleColumnDragStart(event, column.key)
                    }
                    onDragEnd={() => setDraggedColumnKey(null)}
                    style={{ cursor: isLockedColumn ? 'not-allowed' : 'move' }}
                  >
                    <i
                      className={
                        isLockedColumn ? 'fas fa-lock' : 'fas fa-grip-vertical'
                      }
                      aria-hidden="true"
                    ></i>
                  </span>
                  <input
                    type="checkbox"
                    className="form-check-input m-0"
                    checked={
                      isLockedColumn || visibleColumnKeys.includes(column.key)
                    }
                    disabled={isLockedColumn}
                    onChange={() => toggleColumnVisibility(column.key)}
                  />
                  <span className="menu-title">{column.label}</span>
                </label>
                );
              })}
            </MetronicDropdown>

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
                    id="filterDonorName"
                    label="Donator Name"
                    value={draftFilters.donorName}
                    onChange={value => updateDraftFilter('donorName', value)}
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

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterReceiveId"
                    label="Received ID"
                    value={draftFilters.receiveId}
                    onChange={value => updateDraftFilter('receiveId', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingInputField
                    id="filterChequeNo"
                    label="Cheque No."
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
                  <FloatingSelectField
                    id="filterCity"
                    label="City"
                    value={draftFilters.city}
                    options={cityOptions}
                    onChange={value =>
                      updateDraftFilter('city', value as string)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <FloatingSelectField
                    id="filterState"
                    label="State"
                    value={draftFilters.state}
                    options={stateOptions}
                    onChange={value =>
                      updateDraftFilter('state', value as string)
                    }
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
                    id="filterProvisionalNo"
                    label="Prov. No."
                    value={draftFilters.provisionalNo}
                    onChange={value =>
                      updateDraftFilter('provisionalNo', value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <FloatingDatePicker
                    id="filterReceiveDate"
                    label="Date"
                    value={draftFilters.receiveDate}
                    onChange={value => updateDraftFilter('receiveDate', value)}
                  />
                </div>

                <div className="col-md-3">
                  <FloatingSelectField
                    id="filterOrderType"
                    label="Order Type"
                    value={draftFilters.orderType}
                    options={orderTypeOptions}
                    onChange={value =>
                      updateDraftFilter('orderType', value as string)
                    }
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
<div className="dashboard-listing-content">
        <div className="table-responsive stickyTable dashboard-listing-table" style={{ maxHeight: '550px' }}>
          <table
            id="receiveTable"
            className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4 dashboard-task-detail-table"
          >
            <thead>
              <tr className="fw-bolder text-uppercase text-nowrap">
                {visibleColumns.map(column => (
                  <th
                    key={column.key}
                    className={column.headerClassName || 'text-center'}
                    style={
                      column.key === 'actions'
                        ? stickyActionHeaderStyle
                        : tableHeaderStyle
                    }
                  >
                    {column.headerLabel ?? column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={visibleColumnCount}
                    className="text-center py-10 text-muted"
                  >
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
                    {visibleColumns.map(column => (
                      <td
                        key={column.key}
                        className={column.cellClassName || 'text-center'}
                        style={
                          column.key === 'actions'
                            ? stickyActionCellStyle
                            : undefined
                        }
                      >
                        {renderColumnCell(item, column.key)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleColumnCount}
                    className="text-center py-10 text-muted"
                  >
                    No receive ID records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
