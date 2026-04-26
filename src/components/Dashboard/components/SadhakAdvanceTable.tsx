import React, { useEffect, useMemo, useState } from 'react';
import { SadhakAdvanceItem } from './types';

interface SadhakAdvanceTableProps {
  advances: SadhakAdvanceItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

interface SadhakAdvanceModalProps {
  advance: SadhakAdvanceItem | null;
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

const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'yes') {
    return 'badge-light-success';
  }

  if (normalizedStatus === 'no') {
    return 'badge-light-danger';
  }

  if (normalizedStatus === 'closed') {
    return 'badge-light-dark';
  }

  return 'badge-light-warning';
};

export const SadhakAdvanceTable = ({
  advances,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: SadhakAdvanceTableProps) => {
  const [selectedAdvance, setSelectedAdvance] = useState<SadhakAdvanceItem | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredAdvances = useMemo(() => {
    if (!isSearchActive) {
      return advances;
    }

    return advances.filter(advance =>
      [
        advance.code,
        advance.entryDate,
        advance.billDueDate,
        advance.employeeName,
        advance.description,
        advance.status,
      ]
        .map(formatValue)
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [advances, isSearchActive, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredAdvances.length : totalCount;
  const displayPageNumber = isSearchActive ? 1 : pageNumber;
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
    <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
      <div className="card-header pt-3 pb-3">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder fs-3 mb-1">Sadhak Advance Pending</span>
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
                    <th width="10%">Code</th>
                    <th width="12%">Entry Date</th>
                    <th width="18%">Bill Due Date</th>
                    <th width="20%">Employee Name</th>
                    <th width="26%">Description</th>
                    <th className="text-center" width="14%">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAdvances.map((advance, index) => (
                    <tr key={`${advance.code}-${advance.entryDate}-${index}`}>
                      <td>{formatValue(advance.code)}</td>
                      <td>{formatValue(advance.entryDate)}</td>
                      <td>{formatValue(advance.billDueDate)}</td>
                      <td>{formatValue(advance.employeeName)}</td>
                      <td>{formatValue(advance.description)}</td>
                      <td className="text-center">
                        <span
                          className={`badge fs-8 fw-bolder ${getStatusBadgeClass(
                            advance.status,
                          )}`}
                        >
                          {formatValue(advance.status)}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!filteredAdvances.length && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted fw-bold">
                        No sadhak advance records found.
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
                  <button type="button" className="page-link" onClick={() => onPageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${displayPageNumber >= totalPages ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(Math.min(totalPages, displayPageNumber + 1))}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <SadhakAdvanceModal
        advance={selectedAdvance}
        onClose={() => setSelectedAdvance(null)}
      />
    </div>
  );
};

const SadhakAdvanceModal = ({ advance, onClose }: SadhakAdvanceModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!advance) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));
    return () => window.cancelAnimationFrame(animationFrame);
  }, [advance]);

  if (!advance) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(onClose, 300);
  };

  const particulars = Array.isArray(advance.raw.ParticularList)
    ? advance.raw.ParticularList
    : [];
  const eventName = getValueByKeys(advance.raw, ['Event_Name']);
  const ashramName = getValueByKeys(advance.raw, ['Ashram_Name']);
  const inchargeName = getValueByKeys(advance.raw, ['Emp_Name']);
  const departmentName = getValueByKeys(advance.raw, ['DM_NAme', 'DM_Name']);
  const fromToDate = getValueByKeys(advance.raw, ['FTDate']);
  const advanceFor = getValueByKeys(advance.raw, ['Advance_For']);
  const requestAmount = getValueByKeys(advance.raw, ['RAmount']);
  const billAmount = getValueByKeys(advance.raw, ['Bill_Amount']);
  const accountPendingAmount = getValueByKeys(advance.raw, ['Acc_Pen_Amount']);
  const hodRemark = getValueByKeys(advance.raw, ['Aby']);
  const ghodRemark = getValueByKeys(advance.raw, ['GhodRemark', 'Ghod_Recomm_Remark']);
  const approvedOn = getValueByKeys(advance.raw, ['FinalUserName', 'Aby']);
  const commRecommendation = getValueByKeys(advance.raw, [
    'FinalUserName',
    'Aby',
    'Emp_Name',
  ]);
  const hodRecomm = String(getValueByKeys(advance.raw, ['hodRecomm']));
  const ghodRecomm = String(getValueByKeys(advance.raw, ['GhodRecomm']));
  const commRecomm = String(getValueByKeys(advance.raw, ['CommRecomm']));
  const lastAdvance = getValueByKeys(advance.raw, ['LastAdvance']);
  const last15DayAdvance = getValueByKeys(advance.raw, ['Last15DayAdvance']);
  const expDue = getValueByKeys(advance.raw, ['ExpDue']);
  const approvedAmount = getValueByKeys(advance.raw, ['AppAmt', 'RAmount']);

  return (
    <>
      <div
        className={`dashboard-slide-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={handleClose}
      />
      <aside
        className={`dashboard-slide-modal ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Sadhak advance detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1 dashboard-panel-title fs-3">
              Sadhak Advance Detail
            </h4>
            <div className="text-primary mt-1 fs-6">
              Code: {formatValue(advance.code)} | Employee: {formatValue(advance.employeeName)}
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

        <div className="dashboard-slide-body dashboard-bill-panel-body">
          <section className="card p-4 mb-3 border">
            <div className="row g-4">
            <div className="col-lg-2 col-md-6">
              <div className="dashboard-bill-label">Code</div>
              <div className="dashboard-bill-text fw-bold mb-3">{formatValue(advance.code)}</div>
              <div className="dashboard-bill-label">Event / Ashram</div>
              <div className="dashboard-bill-text fw-bold">{formatValue(eventName)}</div>
              <div className="dashboard-bill-text fw-bold">{formatValue(ashramName)}</div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="dashboard-bill-label">Incharge Name</div>
              <div className="dashboard-bill-text fw-bold">{formatValue(inchargeName)}</div>
              <div className="text-muted fs-7 mb-2">{formatValue(departmentName)}</div>
              <div className="dashboard-bill-label">Advance For</div>
              <div className="dashboard-bill-text fw-bold">{formatValue(advanceFor)}</div>
              <div className="mt-3 pt-2 border-top">
                <div className="d-flex justify-content-between fs-7">
                  <span className="fw-bold">Last Advance:</span>
                  <span>{formatValue(lastAdvance)}</span>
                </div>
                <div className="d-flex justify-content-between fs-7">
                  <span className="fw-bold">Last 15 Days Adv.</span>
                  <span>{formatValue(last15DayAdvance)}</span>
                </div>
                <div className="d-flex justify-content-between fs-7">
                  <span className="fw-bold">Exp. Due</span>
                  <span>{formatValue(expDue)}</span>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="dashboard-bill-label">Entry Date / Due Date</div>
              <div className="dashboard-bill-text fw-bold">{formatValue(advance.entryDate)}</div>
              <div className="dashboard-bill-text fw-bold">{formatValue(advance.billDueDate)}</div>
              <div className="dashboard-bill-label mt-4">From &amp; To Date</div>
              <div className="dashboard-bill-text fw-bold">{formatValue(fromToDate)}</div>
            </div>
            <div className="col-lg-5 col-md-12">
              <div className="dashboard-bill-label">Description</div>
              <textarea
                className="form-control form-control-sm"
                rows={8}
                value={advance.description}
                readOnly
              />
            </div>
          </div>
          </section>

          <section className="dashboard-bill-workflow">
            <h5 className="dashboard-bill-workflow-title">
              Approval Workflow Stages
            </h5>
            <div className="dashboard-bill-workflow-line">
              <article className="dashboard-bill-workflow-card is-active">
                <span className="dashboard-bill-workflow-dot" />
                <div className="dashboard-bill-workflow-header">
                  <h6>Status</h6>
                  <span>{formatValue(advance.status)}</span>
                </div>
                <div className="dashboard-bill-workflow-meta">
                  <span>Billing: {formatValue(hodRemark)}</span>
                </div>
                <p>Bill Amount: {formatValue(billAmount)}</p>
                <div className="dashboard-bill-workflow-meta">
                  <span>Account: {formatValue(commRecommendation)}</span>
                </div>
                <p>Account Pending: {formatValue(accountPendingAmount)}</p>
                <div className="dashboard-bill-workflow-footer">
                  Requested Amount: {formatValue(requestAmount)}
                </div>
              </article>

              <article
                className={`dashboard-bill-workflow-card ${
                  particulars.length ? 'is-active' : 'is-pending'
                }`}
              >
                <span className="dashboard-bill-workflow-dot" />
                <div className="dashboard-bill-workflow-header">
                  <h6>Particulars</h6>
                  <span>{particulars.length} item(s)</span>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle dashboard-bill-modal-table mb-0">
                    <thead>
                      <tr>
                        <th>Advance Type</th>
                        <th>Days</th>
                        <th>Expected Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {particulars.length ? (
                        particulars.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {formatValue(getValueByKeys(item, ['Adv_Particular']))}
                            </td>
                            <td>{formatValue(getValueByKeys(item, ['ForDays']))}</td>
                            <td>
                              {formatValue(getValueByKeys(item, ['Advance_Amount']))}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            No particulars available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="dashboard-bill-workflow-footer mt-3">
                  ADVANCE PARTICULARS
                </div>
              </article>

              <article className="dashboard-bill-workflow-card is-active">
                <span className="dashboard-bill-workflow-dot" />
                <div className="dashboard-bill-workflow-header">
                  <h6>HOD Recommendation</h6>
                  <span>{formatValue(hodRecomm || 'Yes')}</span>
                </div>
                <div className="dashboard-bill-workflow-meta">
                  <span>Amt: {formatValue(requestAmount)}</span>
                </div>
                <textarea
                  className="form-control form-control-sm"
                  rows={4}
                  value={formatValue(hodRemark)}
                  readOnly
                />
                <div className="dashboard-bill-tag-row mt-3 mb-0">
                  <span className="dashboard-bill-tag">Yes</span>
                  <span className="dashboard-bill-tag">No</span>
                </div>
              </article>

              <article className="dashboard-bill-workflow-card is-active">
                <span className="dashboard-bill-workflow-dot" />
                <div className="dashboard-bill-workflow-header">
                  <h6>GHOD Recommendation</h6>
                  <span>{formatValue(ghodRecomm || 'Yes')}</span>
                </div>
                <div className="dashboard-bill-workflow-meta">
                  <span>Amt: {formatValue(approvedAmount)}</span>
                </div>
                <textarea
                  className="form-control form-control-sm"
                  rows={4}
                  value={formatValue(ghodRemark || 'OK')}
                  readOnly
                />
                <div className="dashboard-bill-tag-row mt-3 mb-0">
                  <span className="dashboard-bill-tag">
                    {formatValue(ghodRecomm || 'Yes')}
                  </span>
                  <span className="dashboard-bill-tag">No</span>
                </div>
              </article>

              <article className="dashboard-bill-workflow-card is-active">
                <span className="dashboard-bill-workflow-dot" />
                <div className="dashboard-bill-workflow-header">
                  <h6>Approved</h6>
                  <span>{formatValue(approvedOn)}</span>
                </div>
                <div className="dashboard-bill-workflow-meta">
                  <span>Approved Amount: {formatValue(approvedAmount)}</span>
                </div>
                <p>Final recommendation: {formatValue(commRecomm || 'Yes')}</p>
                <div className="dashboard-bill-tag-row mb-0">
                  <span className="dashboard-bill-tag">
                    {formatValue(commRecomm || 'Yes')}
                  </span>
                  <span className="dashboard-bill-tag">No</span>
                </div>
              </article>
            </div>
          </section>

          <section className="card p-4 mb-3 border table-responsive">
            <table className="table table-bordered align-middle dashboard-bill-modal-table">
              <tbody>
                <tr>
                  <th>Budget Detail</th>
                  <td>{formatValue(getValueByKeys(advance.raw, ['Type']))}</td>
                </tr>
                <tr>
                  <th>Requested Amount</th>
                  <td>{formatValue(requestAmount)}</td>
                </tr>
                <tr>
                  <th>Account Pending Amount</th>
                  <td>{formatValue(accountPendingAmount)}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{formatValue(advance.status)}</td>
                </tr>
                <tr>
                  <th>HOD / GHOD</th>
                  <td>
                    {formatValue(hodRecomm)} / {formatValue(ghodRecomm)}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <div className="dashboard-slide-footer dashboard-bill-action-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save
          </button>
        </div>
      </aside>
    </>
  );
};
