import React from 'react';

export const ReceiveIdCommunicationAddressTab: React.FC = () => {
  return (
    <div className={'tab-pane fade'} id="tab_address" role="tabpanel">
      <div className={'row g-5'}>
        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Address 1</label>
          <input type="text" id="addr1" className={'form-control'} placeholder="Flat, House No. Building, Apartment" />
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Address 2</label>
          <input type="text" id="addr2" className={'form-control'} placeholder="Area, Street, Sector, Village" />
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Address 3</label>
          <input type="text" id="addr3" className={'form-control'} placeholder="Landmark" />
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Country</label>
          <select id="country" className={'form-select'}>
            <option selected={true}>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>UAE</option>
          </select>
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Pin Code</label>
          <input type="text" id="pin" className={'form-control'} placeholder="Enter Pincode" />
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>State</label>
          <select id="state" className={'form-select'}>
            <option value="">Select State</option>
            <option>Rajasthan</option>
            <option>Delhi</option>
            <option>Maharashtra</option>
            <option>Gujarat</option>
          </select>
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>City</label>
          <select id="city" className={'form-select'}>
            <option value="">Select City</option>
            <option>Udaipur</option>
            <option>Jaipur</option>
            <option>Delhi</option>
            <option>Ahmedabad</option>
          </select>
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>District</label>
          <input type="text" id="district" className={'form-control'} placeholder="Enter District" />
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>C/O</label>
          <input type="text" id="C/O" className={'form-control'} placeholder="Enter C/O" />
        </div>
      </div>
    </div>
  );
};
