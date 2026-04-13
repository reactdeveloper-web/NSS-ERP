import React from 'react';

interface SaveResultModalProps {
  open: boolean;
  requestPayload: unknown;
  resultPayload: unknown;
  onClose: () => void;
}

interface DeleteCauseModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SaveResultModal = ({
  open,
  requestPayload,
  resultPayload,
  onClose,
}: SaveResultModalProps) => {
  if (!open) {
    return null;
  }

  const resultItems = Array.isArray(
    (resultPayload as { result?: unknown[] } | null)?.result,
  )
    ? ((resultPayload as { result: Array<Record<string, unknown>> }).result ??
        [])
    : [];

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h4 className="modal-title">Create Announce Response</h4>
              <button
                type="button"
                className="btn btn-sm btn-icon btn-active-color-primary"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="ki-duotone ki-cross fs-1">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </button>
            </div>

            <div className="modal-body">
              <div className="bg-light-primary rounded p-4 mb-5">
                <div className="fw-bold mb-2">Request Payload</div>
                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(requestPayload, null, 2)}
                </pre>
              </div>

              {resultItems.length ? (
                <div className="mb-5">
                  {resultItems.map((item, index) => (
                    <div
                      key={`${String(item.code ?? index)}-${index}`}
                      className={`alert ${
                        String(item.status || '').toLowerCase() === 'success'
                          ? 'alert-success'
                          : 'alert-danger'
                      } py-3`}
                    >
                      <div className="fw-semibold">
                        {String(item.msg || 'No message returned.')}
                      </div>
                      <div className="fs-8 mt-1 text-muted">
                        Code: {String(item.code ?? '-')} | Status:{' '}
                        {String(item.status ?? '-')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="bg-light rounded p-4">
                <div className="fw-bold mb-2">Raw Response</div>
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

export const DeleteCauseModal = ({
  open,
  onClose,
  onConfirm,
}: DeleteCauseModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h4 className="modal-title">Confirm Delete</h4>
              <button
                type="button"
                className="btn btn-sm btn-icon btn-active-color-primary"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="ki-duotone ki-cross fs-1">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </button>
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Kya aap is added cause ko delete karna chahte hain?
              </p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
};
