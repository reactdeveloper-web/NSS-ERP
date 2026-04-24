import React, { useEffect, useMemo, useState } from 'react';
import { PartyAdvanceItem } from './types';

interface PartyAdvanceTableProps {
  advances: PartyAdvanceItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface PartyAdvanceModalProps {
  advance: PartyAdvanceItem | null;
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

export const PartyAdvanceTable = ({
  advances,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PartyAdvanceTableProps) => {
  const [selectedAdvance, setSelectedAdvance] = useState<PartyAdvanceItem | null>(null);
  const filteredAdvances = useMemo(() => advances, [advances]);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startRecord = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRecord = totalCount === 0 ? 0 : Math.min(pageNumber * pageSize, totalCount);
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
    const safeStartPage = Math.max(1, pageNumber - 2);
    const safeEndPage = Math.min(totalPages, safeStartPage + 4);
    const adjustedStartPage = Math.max(1, safeEndPage - 4);

    return adjustedStartPage + index;
  });

  return (
    <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
      <div className="card-header pt-3 pb-3">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder fs-3 mb-1">Party Advance Pending</span>
          <span className="text-muted mt-1 fw-bold fs-7">{totalCount} records</span>
        </h3>
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
                    <th width="18%">Vendor Name</th>
                    <th width="28%">Description</th>
                    <th className="text-center" width="14%">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAdvances.map((advance, index) => (
                    <tr
                      key={`${advance.code}-${advance.entryDate}-${index}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedAdvance(advance)}
                    >
                      <td>{formatValue(advance.code)}</td>
                      <td>{formatValue(advance.entryDate)}</td>
                      <td>{formatValue(advance.billDueDate)}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          {formatValue(advance.vendorName)}
                        </div>
                      </td>
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
                        No party advance records found.
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
              Showing {startRecord} to {endRecord} of {totalCount}
            </span>
            <ul className="pagination pagination-circle pagination-outline mb-0">
              <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
                >
                  &laquo;
                </button>
              </li>
              {pageNumbers.map(page => (
                <li
                  key={page}
                  className={`page-item ${page === pageNumber ? 'active' : ''}`}
                >
                  <button type="button" className="page-link" onClick={() => onPageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${pageNumber >= totalPages ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <PartyAdvanceModal
        advance={selectedAdvance}
        onClose={() => setSelectedAdvance(null)}
      />
    </div>
  );
};

const PartyAdvanceModal = ({ advance, onClose }: PartyAdvanceModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [billingStatus, setBillingStatus] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [hodRecommendation, setHodRecommendation] = useState('');
  const [commRecommendation, setCommRecommendation] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');

  useEffect(() => {
    if (!advance) {
      return;
    }

    setBillingStatus(String(getValueByKeys(advance.raw, ['Aby', 'EntryBy'])));
    setAccountStatus(String(getValueByKeys(advance.raw, ['Aby', 'EntryBy'])));
    setHodRecommendation(
      String(getValueByKeys(advance.raw, ['Audit_Remark', 'AuditRemark'])),
    );
    setCommRecommendation(String(getValueByKeys(advance.raw, ['Emp_Name', 'empName'])));
    setApprovedAmount(
      String(getValueByKeys(advance.raw, ['AppAmt', 'ApprovedAmount', 'RAmount'])),
    );
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
  const entryBy = getValueByKeys(advance.raw, ['Emp_Name', 'empName', 'Aby']);
  const entrySadhak = getValueByKeys(advance.raw, ['DM_NAme', 'DM_Name', 'department']);
  const approvedOn = getValueByKeys(advance.raw, ['Aby', 'ApprovedOn']);
  const orderLink = String(getValueByKeys(advance.raw, ['orderlink', 'OrderLink']));
  const lastAdvance = getValueByKeys(advance.raw, ['LastAdvance']);
  const last15DayAdvance = getValueByKeys(advance.raw, ['Last15DayAdvance']);
  const expDue = getValueByKeys(advance.raw, ['ExpDue']);
  const hodRecomm = String(getValueByKeys(advance.raw, ['hodRecomm']));
  const gHodRecomm = String(getValueByKeys(advance.raw, ['GhodRecomm']));
  const commRecomm = String(getValueByKeys(advance.raw, ['CommRecomm']));

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
        aria-label="Party advance detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1">Party Advance Detail</h4>
            <div className="text-muted fs-7">
              Code: {formatValue(advance.code)} | Vendor: {formatValue(advance.vendorName)}
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

        <div className="dashboard-slide-body">
          <div className="row g-4 mb-5">
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Code</label>
              <div className="fw-bold text-dark">{formatValue(advance.code)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Entry Date</label>
              <div className="fw-bold text-dark">{formatValue(advance.entryDate)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Bill Due Date</label>
              <div className="fw-bold text-dark">{formatValue(advance.billDueDate)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Vendor Name</label>
              <div className="fw-bold text-dark">{formatValue(advance.vendorName)}</div>
            </div>
            <div className="col-12">
              <label className="form-label fs-8 text-muted mb-1">Description</label>
              <textarea
                className="form-control form-control-sm"
                rows={4}
                value={advance.description}
                readOnly
              />
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-sm-6 col-lg-3">
              <label className="form-label fs-8 text-muted mb-1">Billing Status</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={billingStatus}
                onChange={event => setBillingStatus(event.target.value)}
              />
            </div>
            <div className="col-sm-6 col-lg-3">
              <label className="form-label fs-8 text-muted mb-1">Account Status</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={accountStatus}
                onChange={event => setAccountStatus(event.target.value)}
              />
            </div>
            <div className="col-lg-6">
              <label className="form-label fs-8 text-muted mb-1">Particulars</label>
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
                          <td>{formatValue(getValueByKeys(item, ['Adv_Particular']))}</td>
                          <td>{formatValue(getValueByKeys(item, ['ForDays']))}</td>
                          <td>{formatValue(getValueByKeys(item, ['Advance_Amount']))}</td>
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
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-lg-5">
              <label className="form-label fs-8 text-muted mb-1">HOD Recommendation</label>
              <textarea
                className="form-control form-control-sm"
                rows={4}
                value={hodRecommendation}
                onChange={event => setHodRecommendation(event.target.value)}
              />
              <div className="d-flex gap-2 mt-3">
                <span className="badge badge-light-success">
                  HOD: {formatValue(hodRecomm)}
                </span>
                <span className="badge badge-light-primary">
                  GHOD: {formatValue(gHodRecomm)}
                </span>
              </div>
            </div>
            <div className="col-lg-3">
              <label className="form-label fs-8 text-muted mb-1">Comm Recommendation</label>
              <textarea
                className="form-control form-control-sm"
                rows={4}
                value={commRecommendation}
                onChange={event => setCommRecommendation(event.target.value)}
              />
              <div className="mt-3">
                <span className="badge badge-light-info">
                  COMM: {formatValue(commRecomm)}
                </span>
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label fs-8 text-muted mb-1">Entry By</label>
              <div className="fw-bold text-dark">{formatValue(entryBy)}</div>
              <div className="text-muted fs-7 mt-2">{formatValue(entrySadhak)}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label fs-8 text-muted mb-1">Approved</label>
              <input
                type="text"
                className="form-control form-control-sm mb-3"
                value={approvedAmount}
                onChange={event => setApprovedAmount(event.target.value)}
              />
              <div className="d-flex gap-3">
                <label className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={advance.status === 'Yes'}
                    readOnly
                  />
                  <span className="form-check-label fw-bold">Yes</span>
                </label>
                <label className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={advance.status !== 'Yes'}
                    readOnly
                  />
                  <span className="form-check-label fw-bold">No</span>
                </label>
              </div>
              <div className="text-muted fs-7 mt-2">{formatValue(approvedOn)}</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle dashboard-bill-modal-table">
              <tbody>
                <tr>
                  <th>Last Advance</th>
                  <td>{formatValue(lastAdvance)}</td>
                </tr>
                <tr>
                  <th>Last 15 Days Advance</th>
                  <td>{formatValue(last15DayAdvance)}</td>
                </tr>
                <tr>
                  <th>Expense Due</th>
                  <td>{formatValue(expDue)}</td>
                </tr>
                <tr>
                  <th>Order Link</th>
                  <td>
                    {orderLink ? (
                      <a href={orderLink} target="_blank" rel="noreferrer">
                        View Agreement Files
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-slide-footer">
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
