import React from 'react';

export const ReceiveIdFormTabNav: React.FC = () => {
  return (
    <div className={'tabs-mobile-scroll'}>
      <ul
        className={
          'nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mb-8 flex-wrap'
        }
        id="detailsTabNav"
        role="tablist"
      >
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link active'}
            data-step="0"
            data-bs-toggle="tab"
            data-bs-target="#tab_personal"
            type="button"
            data-bs-title="Enter donor personal information"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            1. Personal Details
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="1"
            data-bs-toggle="tab"
            data-bs-target="#tab_address"
            type="button"
            data-bs-title="Enter donor Communication Address"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            2. Communication Address
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="2"
            data-bs-toggle="tab"
            data-bs-target="#tab_contact"
            type="button"
            data-bs-title="Enter donor Contact Details"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            3. Contact Details
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="3"
            data-bs-toggle="tab"
            data-bs-target="#tab_identity"
            type="button"
            data-bs-title="Enter donor Identity Details"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            4. Identity Details
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="4"
            data-bs-toggle="tab"
            data-bs-target="#tab_payment"
            type="button"
            data-bs-title="Enter donor Payment Details"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            5. Payment Details
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="5"
            data-bs-toggle="tab"
            data-bs-target="#tab_receipt"
            type="button"
            data-bs-title="Enter donor Receipt Details"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            6. Receipt Details
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="6"
            data-bs-toggle="tab"
            data-bs-target="#tab_purpose"
            type="button"
            data-bs-title="Enter donor Purpose"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            7. Purpose
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="7"
            data-bs-toggle="tab"
            data-bs-target="#tab_instruction"
            type="button"
            data-bs-title="Enter donor Instruction information"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            8. Donor Instruction
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="8"
            data-bs-toggle="tab"
            data-bs-target="#tab_remarks"
            type="button"
            data-bs-title="Fill Remark"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            9. Remarks
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="9"
            data-bs-toggle="tab"
            data-bs-target="#tab_attachements"
            type="button"
            data-bs-title="Add Attachements"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            10. Attachements
          </button>
        </li>
        <li className={'nav-item'} role="presentation">
          <button
            className={'nav-link'}
            data-step="10"
            data-bs-toggle="tab"
            data-bs-target="#tab_announces"
            type="button"
            data-bs-title="Add Announces"
            data-bs-placement="top"
            data-bs-original-title=""
            title=""
          >
            11. Announces
          </button>
        </li>
      </ul>
    </div>
  );
};
