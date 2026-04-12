import React from 'react';

export interface AnnouncementListingItem {
  announceId: string;
  announceDate: string;
  announcerName: string;
  mobileNo: string;
  eventName: string;
  occasionType: string;
  announceAmount: string;
  source: 'api' | 'cache';
}

interface AnnouncementListingProps {
  items: AnnouncementListingItem[];
  loading: boolean;
  error: string;
  deletingId: string | null;
  onAdd: () => void;
  onEdit: (announceId: string) => void;
  onView: (announceId: string) => void;
  onDelete: (announceId: string) => void;
}

export const AnnouncementListing = ({
  items,
  loading,
  error,
  deletingId,
  onAdd,
  onEdit,
  onView,
  onDelete,
}: AnnouncementListingProps) => {
  return (
    <div className="card shadow-sm">
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          <div>
            <h3 className="mb-1">Announcement Listing</h3>
            <div className="text-muted fs-7">
              Saved announce records with quick actions
            </div>
          </div>
        </div>
        <div className="card-toolbar">
          <button className="btn btn-primary" type="button" onClick={onAdd}>
            Add Announce
          </button>
        </div>
      </div>

      <div className="card-body pt-0">
        {error ? <div className="alert alert-warning mb-6">{error}</div> : null}

        <div className="table-responsive">
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted">
                <th>Announce ID</th>
                <th>Announce Date</th>
                <th>Announcer Name</th>
                <th>Mobile No</th>
                <th>Event</th>
                <th>Occasion Type</th>
                <th className="text-end">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted">
                    Loading announcements...
                  </td>
                </tr>
              ) : items.length ? (
                items.map(item => (
                  <tr key={`${item.source}-${item.announceId}`}>
                    <td className="fw-semibold">{item.announceId}</td>
                    <td>{item.announceDate || '-'}</td>
                    <td>{item.announcerName || '-'}</td>
                    <td>{item.mobileNo || '-'}</td>
                    <td>{item.eventName || '-'}</td>
                    <td>{item.occasionType || '-'}</td>
                    <td className="text-end">{item.announceAmount || '0'}</td>
                    <td className="text-center">
                      <div className="d-inline-flex gap-2 flex-wrap justify-content-center">
                        <button
                          className="btn btn-sm btn-light-primary"
                          type="button"
                          onClick={() => onEdit(item.announceId)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-light-info"
                          type="button"
                          onClick={() => onView(item.announceId)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-light-danger"
                          type="button"
                          onClick={() => onDelete(item.announceId)}
                          disabled={deletingId === item.announceId}
                        >
                          {deletingId === item.announceId
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </td>
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
      </div>
    </div>
  );
};
