import React from 'react';

export const ReceiveIdAttachmentsTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_attachements" role="tabpanel">
      <div id="fileUploadWrapper">
        <div className={'file-row row g-5 align-items-end mb-6'}>
          <div className={'col-md-4'}>
            <label className={'form-label fw-semibold'}>
              File Type <span className={'text-danger'}>*</span>
            </label>
            <select className={'form-select file-type'}>
              <option value="">Select File Type</option>
              <option>Cheque Image</option>
              <option>Receipt Copy</option>
              <option>ID Proof</option>
              <option>Other Document</option>
            </select>
          </div>

          <div className={'col-md-4'}>
            <label className={'form-label fw-semibold'}>
              Upload File <span className={'text-danger'}>*</span>
            </label>
            <input type="file" className={'form-control file-input'} />
          </div>

          <div className={'col-md-4'}>
            <label className={'form-label d-block'}>&nbsp;</label>
            <div className={'d-flex gap-3'}>
              <button type="button" className={'btn btn-primary addRowBtn'}>
                <i className={'fa fa-plus'}></i> Add More
              </button>

              <button type="button" className={'btn btn-light-danger removeRowBtn d-none'}>
                <i className={'fa fa-trash'}></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
