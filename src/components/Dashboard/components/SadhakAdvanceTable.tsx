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
}: SadhakAdvanceTableProps) => {
  const [selectedAdvance, setSelectedAdvance] = useState<SadhakAdvanceItem | null>(null);
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
          <span className="card-label fw-bolder fs-3 mb-1">Sadhak Advance Pending</span>
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
                    <th width="20%">Employee Name</th>
                    <th width="26%">Description</th>
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
            <h4 className="mb-1">Sadhak Advance Detail</h4>
            <div className="text-muted fs-7">
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

        <div className="dashboard-slide-body">
          <div className="row g-4 mb-5">
            <div className="col-lg-2 col-md-6">
              <label className="form-label fs-8 text-muted mb-1">Code</label>
              <div className="fw-bold text-dark mb-3">{formatValue(advance.code)}</div>
              <label className="form-label fs-8 text-muted mb-1">Event / Ashram</label>
              <div className="fw-bold text-dark">{formatValue(eventName)}</div>
              <div className="fw-bold text-dark">{formatValue(ashramName)}</div>
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label fs-8 text-muted mb-1">Incharge Name</label>
              <div className="fw-bold text-dark">{formatValue(inchargeName)}</div>
              <div className="text-muted fs-7 mb-2">{formatValue(departmentName)}</div>
              <label className="form-label fs-8 text-muted mb-1">Advance For</label>
              <div className="fw-bold text-dark">{formatValue(advanceFor)}</div>
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
              <label className="form-label fs-8 text-muted mb-1">Entry Date / Due Date</label>
              <div className="fw-bold text-dark">{formatValue(advance.entryDate)}</div>
              <div className="fw-bold text-dark">{formatValue(advance.billDueDate)}</div>
              <label className="form-label fs-8 text-muted mb-1 mt-4">From &amp; To Date</label>
              <div className="fw-bold text-dark">{formatValue(fromToDate)}</div>
            </div>
            <div className="col-lg-5 col-md-12">
              <label className="form-label fs-8 text-muted mb-1">Description</label>
              <textarea
                className="form-control form-control-sm"
                rows={8}
                value={advance.description}
                readOnly
              />
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-lg-2 col-md-6">
              <label className="form-label fs-8 text-muted mb-1">Status</label>
              <div className="mb-3">
                <div className="text-muted fs-8">Billing</div>
                <div className="fw-bold text-dark">{formatValue(hodRemark)}</div>
                <div className="form-control form-control-sm mt-1">
                  {formatValue(billAmount)}
                </div>
              </div>
              <div>
                <div className="text-muted fs-8">Account</div>
                <div className="fw-bold text-dark">{formatValue(commRecommendation)}</div>
                <div className="form-control form-control-sm mt-1">
                  {formatValue(accountPendingAmount)}
                </div>
                <div className="fw-bold text-dark mt-2">{formatValue(requestAmount)}</div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
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
            <div className="col-lg-3 col-md-6">
              <label className="form-label fs-8 text-muted mb-1">HOD Recommendation</label>
              <textarea
                className="form-control form-control-sm"
                rows={5}
                value={formatValue(hodRemark)}
                readOnly
              />
              <div className="form-control form-control-sm mt-2">
                {formatValue(requestAmount)}
              </div>
              <div className="d-flex gap-2 mt-2">
                <span className="badge badge-light-success">Yes</span>
                <span className="badge badge-light-secondary">No</span>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <label className="form-label fs-8 text-muted mb-1">GHOD Recommendation</label>
              <textarea
                className="form-control form-control-sm"
                rows={5}
                value={formatValue(ghodRemark || 'OK')}
                readOnly
              />
              <div className="form-control form-control-sm mt-2">
                {formatValue(getValueByKeys(advance.raw, ['AppAmt', 'RAmount']))}
              </div>
              <div className="d-flex gap-2 mt-2">
                <span className="badge badge-light-success">
                  {formatValue(ghodRecomm || 'Yes')}
                </span>
                <span className="badge badge-light-secondary">No</span>
              </div>
            </div>
            <div className="col-lg-1 col-md-6">
              <label className="form-label fs-8 text-muted mb-1">Approved</label>
              <div className="form-control form-control-sm">
                {formatValue(getValueByKeys(advance.raw, ['AppAmt']))}
              </div>
              <div className="d-flex gap-2 mt-3">
                <span className="badge badge-light-success">
                  {formatValue(commRecomm || 'Yes')}
                </span>
                <span className="badge badge-light-secondary">No</span>
              </div>
              <div className="text-muted fs-7 mt-2">{formatValue(approvedOn)}</div>
            </div>
          </div>

          <div className="table-responsive">
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
