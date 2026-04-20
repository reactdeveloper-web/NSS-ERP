import React from 'react';

export const ReceiveIdContactDetailsTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_contact" role="tabpanel">
      <div className={'row g-5'}>
        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>
            Primary Mobile <span className={'text-danger'}>*</span>
          </label>
          <div className={'d-flex gap-3'}>
            <select id="mobileType1" className={'form-select w-125px'}>
              <option>Mobile</option>
              <option>Office</option>
              <option>Home</option>
            </select>
            <input type="tel" id="mobile1" className={'form-control'} placeholder="Enter number" />
          </div>
        </div>

        <div className={'col-md-3'}>
          <div className={'form-check form-check-custom form-check-solid mt-10'}>
            <input className={'form-check-input'} type="checkbox" id="sameWhatsapp" checked={true} />
            <label className={'form-check-label fw-semibold'} htmlFor="sameWhatsapp">
              Primary mobile is WhatsApp
            </label>
          </div>
        </div>
        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>
            Whatsapp <span className={'text-danger'}>*</span>
          </label>
          <input type="tel" id="mobile1" className={'form-control'} placeholder="Enter number" />
        </div>
        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Primary Email</label>
          <input type="email" id="email1" className={'form-control'} placeholder="Email ID" />
        </div>
      </div>

      <div className={'row g-5 mt-5'}>
        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Mobile 2</label>
          <div className={'d-flex gap-3'}>
            <select id="mobileType1" className={'form-select w-125px'}>
              <option>Mobile</option>
              <option>Office</option>
              <option>Home</option>
            </select>
            <input type="tel" id="mobile1" className={'form-control'} placeholder="Enter number" />
          </div>
        </div>

        <div className={'col-md-3'}>
          <div className={'form-check form-check-custom form-check-solid mt-10'}>
            <input className={'form-check-input'} type="checkbox" id="sameWhatsapp1" checked={true} />
            <label className={'form-check-label fw-semibold'} htmlFor="sameWhatsapp1">
              Primary mobile is WhatsApp
            </label>
          </div>
        </div>

        <div className={'col-md-3 offset-md-3'}>
          <label className={'form-label fw-semibold'}>Email 2</label>
          <input type="email" id="email1" className={'form-control'} placeholder="Email ID" />
        </div>
      </div>
    </div>
  );
};
