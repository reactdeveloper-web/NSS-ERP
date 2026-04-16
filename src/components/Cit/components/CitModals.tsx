import React from 'react';

interface CitSaveResultModalProps {
  open: boolean;
  resultPayload: unknown;
  onClose: () => void;
}

export const CitSaveResultModal = ({
  open,
  resultPayload,
  onClose,
}: CitSaveResultModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h4 className="modal-title">CIT Response</h4>
              <button
                type="button"
                className="btn btn-sm btn-icon btn-active-color-primary"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="fa fa-times fs-1" />
              </button>
            </div>

            <div className="modal-body">
              <div className="bg-light rounded p-4">
                <div className="fw-bold mb-2">API Response</div>
                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(resultPayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
};
