import React from 'react';
import { FloatingSelectField } from 'src/components/Common/FloatingSelectField';
import { ReceiveIdFormTabProps } from './ReceiveIdForm.types';

const fileTypeOptions = [
  { value: '', label: 'Select File Type' },
  { value: 'Cheque Image', label: 'Cheque Image' },
  { value: 'Receipt Copy', label: 'Receipt Copy' },
  { value: 'ID Proof', label: 'ID Proof' },
  { value: 'Other Document', label: 'Other Document' },
];

export const ReceiveIdAttachmentsTab: React.FC<ReceiveIdFormTabProps> = ({
  values,
  updateField,
  isReadOnly,
}) => {
  return (
    <div className={'tab-pane fade'} id="tab_attachements" role="tabpanel">
      <div id="fileUploadWrapper">
        <div className={'file-row row g-5 align-items-end mb-6'}>
          <div className={'col-md-4'}>
            <FloatingSelectField
              id="fileType"
              label={
                <>
                  File Type <span className={'text-danger'}>*</span>
                </>
              }
              value={values.fileType}
              options={fileTypeOptions}
              disabled={isReadOnly}
              onChange={value => updateField('fileType', value as string)}
            />
          </div>

          <div className={'col-md-4'}>
            <label className={'form-label fw-semibold'}>
              Upload File <span className={'text-danger'}>*</span>
            </label>
            <input type="file" className={'form-control file-input'} disabled={isReadOnly} />
          </div>

          <div className={'col-md-4'}>
            <label className={'form-label d-block'}>&nbsp;</label>
            <div className={'d-flex gap-3'}>
              <button type="button" className={'btn btn-primary addRowBtn'} disabled={isReadOnly}>
                <i className={'fa fa-plus'}></i> Add More
              </button>

              <button type="button" className={'btn btn-light-danger removeRowBtn d-none'} disabled={isReadOnly}>
                <i className={'fa fa-trash'}></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
