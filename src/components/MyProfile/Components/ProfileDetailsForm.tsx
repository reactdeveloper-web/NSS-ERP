import React from "react";

export const ProfileDetailsForm = () => {
  return (
    <form className="form">

      <div className="card mt-5 shadow-sm">
        <div className="card-header pt-5 d-flex justify-content-between">
          <h3 className="fw-bolder">Profile Details</h3>
        </div>

        <div className="card-body border-top p-9">

          {/* AVATAR */}
          <div className="row mb-6">
            <label className="col-lg-4 col-form-label fw-bold fs-6">Avatar</label>

            <div className="col-lg-8">
              <div
                className="image-input image-input-outline"
                data-kt-image-input="true"
                style={{ backgroundImage: "url(/assets/media/avatars/blank.png)" }}
              >
                <div
                  className="image-input-wrapper w-125px h-125px"
                  style={{ backgroundImage: "url(/assets/media/avatars/150-26.jpg)" }}
                />

                {/* CHANGE */}
                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                >
                  <i className="bi bi-pencil-fill fs-7"></i>
                  <input type="file" name="avatar" accept=".png,.jpg,.jpeg" />
                  <input type="hidden" name="avatar_remove" />
                </label>

                {/* CANCEL */}
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                >
                  <i className="bi bi-x fs-2"></i>
                </span>

                {/* REMOVE */}
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                >
                  <i className="bi bi-x fs-2"></i>
                </span>
              </div>

              <div className="form-text">Allowed file types: png, jpg, jpeg.</div>
            </div>
          </div>

          {/* FULL NAME */}
          <div className="row mb-6">
            <label className="col-lg-4 col-form-label required fw-bold fs-6">
              Full Name
            </label>

            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    defaultValue="Jatin"
                    placeholder="First name"
                  />
                </div>

                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    defaultValue="Mata"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ORGANIZATION */}
          <FormInput label="Organizations" value="Narayan Seva Sansthan" disabled />

          {/* PHONE */}
          <div className="row mb-6">
            <label className="col-lg-4 col-form-label required fw-bold fs-6">
              Contact Phone
            </label>

            <div className="col-lg-8 d-flex align-items-center">
              <span className="fw-bold fs-6 position-absolute ms-3">+91</span>
              <input
                type="tel"
                className="form-control form-control-lg form-control-solid ps-10"
                defaultValue="7581028921"
              />
            </div>
          </div>

          {/* WEBSITE */}
          <FormInput label="Website" value="https://www.narayanseva.org/" disabled />

          {/* JOINING DATE */}
          <FormInput label="Joining Date" value="04-09-2025" disabled />

          {/* EMAIL */}
          <FormInput label="Email" value="uiux.software1@narayanseva.org" disabled />

          {/* DISTRICT */}
          <FormInput label="District" value="Udaipur" disabled />

          {/* STATE */}
          <FormInput label="State" value="Rajasthan" disabled />

          {/* COUNTRY */}
          <FormInput label="Country" value="India" disabled />

        </div>

        {/* FOOTER */}
        <div className="card-footer d-flex justify-content-end py-6 px-9">
          <button type="reset" className="btn btn-light me-2">
            Discard
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>

      </div>
    </form>
  );
};

/* reusable input row */
const FormInput = ({ label, value, disabled=false }: any) => (
  <div className="row mb-6">
    <label className="col-lg-4 col-form-label fw-bold fs-6">{label}</label>
    <div className="col-lg-8">
      <input
        type="text"
        className="form-control form-control-lg form-control-solid"
        defaultValue={value}
        disabled={disabled}
      />
    </div>
  </div>
);