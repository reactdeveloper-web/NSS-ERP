import React from 'react';

interface DeleteCauseModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

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
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
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
