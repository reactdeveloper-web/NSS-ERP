import React, { useEffect, useMemo, useState } from 'react';
import { RrsStatusItem } from './types';

interface RrsStatusTableProps {
  items: RrsStatusItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

interface RrsStatusModalProps {
  item: RrsStatusItem | null;
  onClose: () => void;
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

const getValueByKeys = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (value !== null && value !== undefined && value !== '') {
      return value;
    }
  }

  return '';
};

const getRecordsByKeys = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value.filter(
        item => item && typeof item === 'object' && !Array.isArray(item),
      ) as Record<string, unknown>[];
    }
  }

  return [];
};

export const RrsStatusTable = ({
  items,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: RrsStatusTableProps) => {
  const [selectedItem, setSelectedItem] = useState<RrsStatusItem | null>(null);
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
        item.id,
        item.employeeName,
        item.storeName,
        item.itemName,
        item.employeeMobile,
        item.rrsType,
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
    <>
      <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
        <div className="card-header pt-3 pb-3">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">My RRS Status</span>
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
                      <th width="10%">ID</th>
                      <th width="22%">Employee Name</th>
                      <th width="18%">Store Name</th>
                      <th width="28%">Item Name</th>
                      <th width="12%">Mobile</th>
                      <th width="10%">RRS Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={`${item.id}-${index}`}>
                        <td>{formatValue(item.id)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(item.employeeName)}
                          </div>
                        </td>
                        <td>{formatValue(item.storeName)}</td>
                        <td>{formatValue(item.itemName)}</td>
                        <td>{formatValue(item.employeeMobile)}</td>
                        <td>{formatValue(item.rrsType)}</td>
                      </tr>
                    ))}

                    {!filteredItems.length && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted fw-bold">
                          No RRS status records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="d-flex flex-stack flex-wrap pt-5 mt-auto">
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
                <option value={100}>100</option>
              </select>
              <span className="text-muted fs-7">per page</span>
            </div>

            <div className="d-flex align-items-center gap-4">
              <span className="text-muted fs-7">
                Showing {startRecord} to {endRecord} of {displayTotalCount}
              </span>
              <ul className="pagination pagination-circle pagination-outline mb-0">
                <li
                  className={`page-item ${
                    displayPageNumber === 1 ? 'disabled' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      onPageChange(Math.max(1, displayPageNumber - 1))
                    }
                  >
                    &laquo;
                  </button>
                </li>
                {pageNumbers.map(page => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === displayPageNumber ? 'active' : ''
                    }`}
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
        </div>
      </div>

      <RrsStatusModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
};

const FieldBox = ({
  label,
  value,
  required = false,
  icon = 'fa-circle',
}: {
  label: string;
  value: unknown;
  required?: boolean;
  icon?: string;
}) => (
  <div className="dashboard-rrs-field">
    <label className="dashboard-rrs-label">
      {label} {required ? <span>*</span> : null}
    </label>
    <div className="dashboard-rrs-control">
      <i className={`fa ${icon}`} aria-hidden="true" />
      <span>{formatValue(value)}</span>
    </div>
  </div>
);

const RrsStatusModal = ({ item, onClose }: RrsStatusModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!item) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [item]);

  if (!item) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(onClose, 300);
  };

  const raw = item.raw;
  const itemRows = getRecordsByKeys(raw, [
    'Items',
    'ItemList',
    'RRSItemList',
    'RrsItemList',
    'LineItems',
    'Details',
  ]);
  const displayRows = itemRows.length ? itemRows : [raw];

  return (
    <>
      <div
        className={`dashboard-slide-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={handleClose}
      />
      <aside
        className={`dashboard-slide-modal dashboard-rrs-modal ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="RRS status detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1 dashboard-panel-title fs-3">My RRS Status</h4>
            <div className="text-primary mt-1 fs-6">
              RRS No: {formatValue(item.id)}
              <span className="mx-5">Type: {formatValue(item.rrsType)}</span>
            </div>
            <div className="text-muted mt-1 fw-bold fs-6">
              {formatValue(item.employeeName)}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-active-color-primary"
            aria-label="Close"
            onClick={handleClose}
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>
        </div>

        <div className="dashboard-slide-body dashboard-rrs-body">
          <section className="dashboard-rrs-section">
            <div className="dashboard-rrs-type-row">
              {['Issue', 'Deposit', 'Replacement', 'Purchase', 'Service', 'Sample'].map(
                type => (
                  <span
                    key={type}
                    className={`dashboard-rrs-type-pill ${
                      item.rrsType.toLowerCase() === type.toLowerCase()
                        ? 'is-active'
                        : ''
                    }`}
                  >
                    {item.rrsType.toLowerCase() === type.toLowerCase() ? (
                      <i className="fa fa-check" aria-hidden="true" />
                    ) : null}
                    {type}
                  </span>
                ),
              )}
            </div>

            <div className="dashboard-rrs-grid">
              <FieldBox label="RRS No" value={item.id} icon="fa-code" />
              <FieldBox
                label="Date"
                value={getValueByKeys(raw, [
                  'rrsdate',
                  'reqdate',
                  'date',
                  'Date',
                  'rrs_date',
                  'RRS_Date',
                ])}
                required
                icon="fa-calendar"
              />
              <FieldBox
                label="Sadhak Name"
                value={`${formatValue(
                  getValueByKeys(raw, ['empid', 'empnum', 'emp_num', 'EmpNum']),
                )}-${formatValue(item.employeeName)}`}
                required
                icon="fa-user"
              />
              <FieldBox
                label="Store Location"
                value={item.storeName}
                required
                icon="fa-map-marker"
              />
              <FieldBox
                label="Department"
                value={getValueByKeys(raw, [
                  'dm_name',
                  'department',
                  'Department',
                  'dept_name',
                ])}
                required
                icon="fa-university"
              />
              <FieldBox
                label="Designation"
                value={getValueByKeys(raw, ['designation', 'Designation', 'desg'])}
                icon="fa-graduation-cap"
              />
              <div className="dashboard-rrs-field dashboard-rrs-field-wide">
                <label className="dashboard-rrs-label">
                  Remark <span>*</span>
                </label>
                <textarea
                  className="dashboard-rrs-textarea"
                  value={String(
                    getValueByKeys(raw, [
                      'rrs_remark',
                      'rrs_dremark',
                      'remark',
                      'Remark',
                      'remarks',
                      'Remarks',
                    ]),
                  )}
                  readOnly
                />
              </div>
              <FieldBox
                label="RRS Item Group"
                value={getValueByKeys(raw, [
                  'mcat_code',
                  'cm_id',
                  'item_group',
                  'ItemGroup',
                  'rrs_item_group',
                  'RRSItemGroup',
                ])}
                required
                icon="fa-sitemap"
              />
              <FieldBox
                label="Store Gate"
                value={getValueByKeys(raw, ['store_gate', 'StoreGate'])}
                required
                icon="fa-building"
              />
              <FieldBox
                label="Building"
                value={getValueByKeys(raw, ['building', 'Building'])}
                required
                icon="fa-building"
              />
              <FieldBox
                label="Location"
                value={getValueByKeys(raw, ['rrs_location', 'location', 'Location'])}
                required
                icon="fa-map-marker"
              />
              <FieldBox
                label="Sub Location"
                value={getValueByKeys(raw, ['sub_location', 'SubLocation'])}
                required
                icon="fa-map-marker"
              />
              <FieldBox
                label="Building Gate"
                value={getValueByKeys(raw, ['building_gate', 'BuildingGate'])}
                required
                icon="fa-building"
              />
              <FieldBox
                label="Opd Id"
                value={getValueByKeys(raw, ['patient', 'opd_id', 'OpdId', 'OPD_ID'])}
                icon="fa-code"
              />
              <FieldBox
                label="For Vendor"
                value={getValueByKeys(raw, ['vendor', 'Vendor', 'vendor_name'])}
                icon="fa-sitemap"
              />
            </div>
          </section>

          <section className="dashboard-rrs-items">
            {displayRows.map((row, index) => (
              <div
                className="dashboard-rrs-item-grid"
                key={`${formatValue(getValueByKeys(row, ['id', 'srno', 'SrNo']))}-${index}`}
              >
                <FieldBox
                  label="Category"
                  value={getValueByKeys(row, [
                    'cm_id',
                    'mcat_code',
                    'category',
                    'Category',
                    'cm_name',
                  ])}
                />
                <FieldBox
                  label="Item Name"
                  value={getValueByKeys(row, ['imname', 'itemName', 'ItemName']) || item.itemName}
                />
                <FieldBox
                  label="Issue Quantity"
                  value={getValueByKeys(row, [
                    'qty',
                    'quantity',
                    'IssueQty',
                    'issue_quantity',
                  ])}
                />
                <FieldBox
                  label="Issue Date"
                  value={getValueByKeys(row, [
                    'reqdate',
                    'rrsdate',
                    'issue_date',
                    'IssueDate',
                  ])}
                  icon="fa-calendar"
                />
                <FieldBox
                  label="Unit"
                  value={getValueByKeys(row, ['umname', 'unit', 'Unit', 'um_name'])}
                />
                <FieldBox
                  label="Priority"
                  value={getValueByKeys(row, [
                    'routine',
                    'approval',
                    'priority',
                    'Priority',
                  ])}
                />
                <div className="dashboard-rrs-field dashboard-rrs-field-wide">
                  <label className="dashboard-rrs-label">Issue Place</label>
                  <textarea
                    className="dashboard-rrs-textarea"
                    value={String(
                      getValueByKeys(row, [
                        'rrs_dremark',
                        'rrs_location',
                        'issue_place',
                        'IssuePlace',
                      ]),
                    )}
                    readOnly
                  />
                </div>
                <div className="dashboard-rrs-field dashboard-rrs-field-wide">
                  <label className="dashboard-rrs-label">Full Specification</label>
                  <textarea
                    className="dashboard-rrs-textarea"
                    value={String(
                      getValueByKeys(row, [
                        'rrs_compmake',
                        'rrs_remark',
                        'full_specification',
                        'FullSpecification',
                        'specification',
                      ]),
                    )}
                    readOnly
                  />
                </div>
              </div>
            ))}
          </section>

          <section className="dashboard-rrs-section">
            <div className="dashboard-rrs-grid dashboard-rrs-footer-grid">
              <FieldBox
                label="For Ward"
                value={getValueByKeys(raw, ['ward', 'Ward', 'for_ward'])}
                icon="fa-sitemap"
              />
              <FieldBox
                label="For OT"
                value={getValueByKeys(raw, ['ot', 'OT', 'for_ot'])}
                icon="fa-sitemap"
              />
              <FieldBox
                label="For Event"
                value={getValueByKeys(raw, ['event', 'Event', 'for_event'])}
                icon="fa-flag"
              />
            </div>
          </section>
        </div>

        <div className="dashboard-slide-footer dashboard-bill-action-footer">
          <button type="button" className="btn nssBtnColor text-white">
            Save
          </button>
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Back
          </button>
        </div>
      </aside>
    </>
  );
};
