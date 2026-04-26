import React, { useEffect, useMemo, useState } from 'react';
import { MeetingPointItem } from './types';

interface MeetingPointTableProps {
  meetings: MeetingPointItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (search: string) => void;
}

interface MeetingPointModalProps {
  meeting: MeetingPointItem | null;
  onClose: () => void;
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
};

const getCompleteText = (complete: string) =>
  complete.toLowerCase() === 'y' || complete.toLowerCase() === 'yes'
    ? 'Yes'
    : 'No';

const getStatusBadgeClass = (complete: string) =>
  getCompleteText(complete) === 'Yes' ? 'badge-light-success' : 'badge-light-warning';

export const MeetingPointTable = ({
  meetings,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}: MeetingPointTableProps) => {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPointItem | null>(
    null,
  );
  const [localSearch, setLocalSearch] = useState('');
  const search = searchValue ?? localSearch;
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredMeetings = useMemo(() => {
    if (!isSearchActive) {
      return meetings;
    }

    return meetings.filter(meeting =>
      [
        meeting.srNo,
        meeting.code,
        meeting.date,
        meeting.assignName,
        meeting.priority,
        meeting.dueDate,
        meeting.title,
        getCompleteText(meeting.complete),
      ]
        .map(value => String(value ?? ''))
        .some(value => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [isSearchActive, meetings, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredMeetings.length : totalCount;
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
            <span className="card-label fw-bolder fs-3 mb-1">
              Meeting Points
            </span>
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
                      <th width="7%">Sr No.</th>
                      <th width="10%">Code</th>
                      <th width="12%">Date</th>
                      <th width="16%">Assign Name</th>
                      <th width="10%">Priority</th>
                      <th width="12%">Due Date</th>
                      <th width="23%">Title</th>
                      <th className="text-center" width="10%">
                        Complete
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMeetings.map((meeting, index) => (
                      <tr key={`${meeting.code}-${meeting.srNo}-${index}`}>
                        <td>{formatValue(meeting.srNo)}</td>
                        <td>{formatValue(meeting.code)}</td>
                        <td>{formatValue(meeting.date)}</td>
                        <td>{formatValue(meeting.assignName)}</td>
                        <td className="fw-bold text-dark">
                          {formatValue(meeting.priority)}
                        </td>
                        <td>{formatValue(meeting.dueDate)}</td>
                        <td>{formatValue(meeting.title)}</td>
                        <td className="text-center">
                          <span
                            className={`badge fs-8 fw-bolder ${getStatusBadgeClass(
                              meeting.complete,
                            )}`}
                          >
                            {getCompleteText(meeting.complete)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredMeetings.length && (
                      <tr>
                        <td colSpan={8} className="text-center text-muted fw-bold">
                          No meeting point records found.
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

      <MeetingPointModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </>
  );
};

const MeetingPointModal = ({ meeting, onClose }: MeetingPointModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [remark, setRemark] = useState('');
  const [forwardedTo, setForwardedTo] = useState('ALL');

  useEffect(() => {
    if (!meeting) {
      return;
    }

    setComplete(getCompleteText(meeting.complete) === 'Yes');
    setRemark(meeting.remark || '');
    setForwardedTo('ALL');
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [meeting]);

  if (!meeting) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(onClose, 300);
  };

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
        aria-label="Meeting point detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1 dashboard-panel-title fs-3">
              Meeting Point Detail
            </h4>
            <div className="text-primary mt-1 fs-6">
              Code: {formatValue(meeting.code)} | Sr No:{' '}
              {formatValue(meeting.srNo)}
            </div>
            <div className="text-muted mt-1 fw-bold fs-6">
              {formatValue(meeting.title)}
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
            <div className="col-sm-6">
              <div className="dashboard-bill-label">Assign Name</div>
              <div className="dashboard-bill-text fw-bold">
                {formatValue(meeting.assignName)}
              </div>
              <div className="text-muted fs-8">
                Assign ID: {formatValue(meeting.assignId)}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="dashboard-bill-label">Owner</div>
              <div className="dashboard-bill-text fw-bold">
                {formatValue(meeting.employeeName)}
              </div>
              <div className="text-muted fs-8">
                {formatValue(meeting.designation)} |{' '}
                {formatValue(meeting.department)}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="dashboard-bill-label">Priority</div>
              <div className="dashboard-bill-text fw-bold">
                {formatValue(meeting.priority)}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="dashboard-bill-label">Due Date</div>
              <input
                type="text"
                className="form-control form-control-sm"
                value={meeting.dueDate || ''}
                readOnly
              />
            </div>
            <div className="col-sm-6">
              <div className="dashboard-bill-label">Date</div>
              <div className="dashboard-bill-text fw-bold">
                {formatValue(meeting.date)}
              </div>
            </div>
          </div>
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Meeting Detail</h5>
            <textarea
              className="form-control form-control-sm"
              rows={4}
              value={meeting.detail || ''}
              readOnly
            />
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Remark</h5>
            <textarea
              className="form-control form-control-sm"
              rows={4}
              value={remark}
              onChange={event => setRemark(event.target.value)}
            />
          </section>

          <section className="dashboard-bill-flag-grid gap-2">
            <label className="dashboard-bill-flag-item rounded-pill fs-6 fw-normal p-2 px-4">
              <i className={`fa ${complete ? 'fa-check-circle' : 'fa-circle-o'} fs-3`} aria-hidden="true" />
              <span>Complete</span>
            </label>
            <label className="form-check form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={complete}
                onChange={event => setComplete(event.target.checked)}
              />
              <span className="form-check-label fw-bold">Yes</span>
            </label>
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Complete Proof</h5>
            <input type="file" className="form-control form-control-sm mb-2" />
            {meeting.completeProof ? (
              <a href={meeting.completeProof} target="_blank" rel="noreferrer">
                View proof
              </a>
            ) : (
              <div className="text-muted fs-8">No proof</div>
            )}
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Forward To</h5>
            <select
              className="form-select form-select-sm"
              value={forwardedTo}
              onChange={event => setForwardedTo(event.target.value)}
            >
              <option value="ALL">ALL</option>
            </select>
          </section>

          <section className="card p-4 mb-3 border table-responsive">
            <table className="table table-bordered align-middle dashboard-bill-modal-table">
              <tbody>
                <tr>
                  <th>Previous Comments</th>
                  <td>{formatValue(meeting.previousComments)}</td>
                </tr>
                <tr>
                  <th>Auto ID</th>
                  <td>{formatValue(meeting.autoId)}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{complete ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <div className="dashboard-slide-footer dashboard-bill-action-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary">
            Save
          </button>
        </div>
      </aside>
    </>
  );
};
