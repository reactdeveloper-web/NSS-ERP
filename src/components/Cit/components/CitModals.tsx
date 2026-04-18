import React from 'react';

interface CitSaveResultModalProps {
  open: boolean;
  requestPayload: unknown;
  resultPayload: unknown;
  isSuccess: boolean;
  onClose: () => void;
}

export const CitSaveResultModal = ({
  open,
  requestPayload,
  resultPayload,
  isSuccess,
  onClose,
}: CitSaveResultModalProps) => {
  const payload =
    resultPayload && typeof resultPayload === 'object'
      ? (resultPayload as Record<string, unknown>)
      : null;
  const message =
    typeof payload?.message === 'string' && payload.message.trim()
      ? payload.message
      : 'Call information trait request completed.';
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
              <h4 className="modal-title">Call Information Trait</h4>
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
              <div className="bg-light rounded p-4 mb-4">
                <div className="fw-bold mb-2">Request Payload</div>
                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(requestPayload, null, 2)}
                </pre>
              </div>

              <div
                className={`rounded p-4 ${
                  isSuccess ? 'bg-light-success' : 'bg-light-danger'
                }`}
              >
                <div className="fw-bold mb-2">
                  {isSuccess ? 'Saved successfully' : 'Request could not be completed'}
                </div>
                <div className="mb-0">{message}</div>
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
