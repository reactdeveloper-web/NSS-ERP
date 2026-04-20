import React from 'react';

export const ReceiveIdPersonalDetailsTab: React.FC = () => {
  return (
    <div className={'tab-pane fade active show'} id="tab_personal" role="tabpanel">
      <div className={'row g-5'}>
        <div className={'col-md-3'} id="DonorId">
          <label className={'form-label fw-semibold'}>
            Donor ID <span className={'text-danger'}>*</span>
          </label>
          <input type="text" id="donorId" className={'form-control'} placeholder="Enter Donor ID" />
        </div>

        <div className={'col-md-3'} id="AnnounceId">
          <label className={'form-label fw-semibold'}>
            Announce ID <span className={'text-danger'}>*</span>
          </label>
          <input type="text" id="AnnounceId" className={'form-control'} placeholder="Enter Announce ID" />
        </div>

        <div className={'col-md-3'} id="firstNameWrap">
          <label className={'form-label fw-semibold'}>
            First Name <span className={'text-danger'}>*</span>
          </label>

          <div className={'input-group'}>
            <select id="salutation" className={'form-select'} style={{ maxWidth: '110px' }}>
              <option>Mr.</option>
              <option>Mrs.</option>
              <option>Ms.</option>
              <option>Dr.</option>
              <option>Shri</option>
              <option>Smt.</option>
              <option>Kumari</option>
            </select>

            <input type="text" id="firstName" className={'form-control'} placeholder="Enter first name" />
          </div>
        </div>

        <div className={'col-md-3'} id="lastNameWrap">
          <label className={'form-label fw-semibold'}>Last Name</label>
          <input type="text" id="lastName" className={'form-control'} placeholder="Enter last name" />
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>Date of Birth</label>
          <input type="input" id="fuDate" className={'form-control smart-date'} placeholder="Select Date" />
        </div>

        <div className={'col-md-3'}>
          <label className={'form-label fw-semibold'}>In Memory / Occasion</label>
          <select id="occasionSelect" className={'form-select'}>
            <option value="">Select Occasion</option>
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Punya Tithi</option>
          </select>
        </div>
        <div className={'col-md-3 mt-3 d-none'} id="occasionInputBox">
          <label className={'form-label fw-semibold'}>Enter Detail</label>
          <input type="text" className={'form-control'} placeholder="Enter Details" />
        </div>

        <div className={'col-md-8 d-none'} id="inMemoryWrap">
          <label className={'form-label fw-semibold'}>Occasion / In Memory Details</label>
          <input
            type="text"
            id="inMemoryText"
            className={'form-control'}
            placeholder="e.g., Birthday / Anniversary / Punya Tithi..."
          />
        </div>
      </div>
    </div>
  );
};
