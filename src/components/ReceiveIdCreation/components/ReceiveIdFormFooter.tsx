import React from 'react';

interface ReceiveIdFormFooterProps {
  onExit: () => void;
}

export const ReceiveIdFormFooter: React.FC<ReceiveIdFormFooterProps> = ({
  onExit,
}) => {
  return (
    <>
      <div className={'separator separator-dashed my-8'}></div>

      <div className={'d-flex justify-content-between flex-wrap gap-3'}>
        <div className={'d-flex gap-5'}>
          <button type="button" className={'btn btn-light'} id="prevTabBtn" disabled={true}>
            Previous
          </button>
          <div className={'form-check form-check-custom form-check-solid'}>
            <input className={'form-check-input'} type="checkbox" id="detailsNotComplete" />
            <label className={'form-check-label fw-semibold'} htmlFor="detailsNotComplete">
              Details Not Complete
            </label>
          </div>
          <div className={'form-check form-check-custom form-check-solid'}>
            <input className={'form-check-input'} type="checkbox" id="DNS" />
            <label className={'form-check-label fw-semibold'} htmlFor="DNS">
              Send Receipt After DNC
            </label>
          </div>
        </div>

        <div className={'d-flex gap-3 flex-wrap'}>
          <button type="button" className={'btn btn-light'} id="addBtn">
            Add New
          </button>
          <button type="button" className={'btn btn-light-info'} id="printBtn">
            Print
          </button>
          <button type="button" className={'btn btn-primary'} id="saveBtn">
            Save
          </button>
          <button type="button" className={'btn btn-danger'} onClick={onExit} id="exitBtn">
            Exit
          </button>
          <button type="button" className={'btn btn-primary'} id="nextTabBtn">
            Next
          </button>
        </div>
      </div>
    </>
  );
};
