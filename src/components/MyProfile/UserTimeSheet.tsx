import React from "react";

export const UserTimeSheet = () => {
  return (
    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">

      {/* TOOLBAR */}
      <div className="toolbar" id="kt_toolbar">
        <div id="kt_toolbar_container" className="container-fluid d-flex flex-stack">
          <div className="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0">
            <h1 className="d-flex align-items-center text-dark fw-bolder fs-3 my-1">
              My Profile
            </h1>

            <span className="h-20px border-gray-200 border-start mx-4"></span>

            <ul className="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
              <li className="breadcrumb-item text-muted">Dashboard</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-200 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-dark">My Profile</li>
            </ul>
          </div>
        </div>
      </div>

      {/* POST */}
      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">

          {/* ===== TOP CARDS ===== */}
          <div className="row gy-5 g-xl-8">

            {/* LEFT PROFILE CARD */}
            <div className="col-xl-4">
              <div className="card shadow-sm border-0 hover-elevate-up">
                <div className="card-body text-center p-8">

                  <div className="symbol symbol-75px symbol-circle mb-4 position-relative">
                    <span
                      className="symbol-label"
                      style={{
                        backgroundImage: "url(/assets/media/avatars/150-26.jpg)",
                        backgroundSize: "cover"
                      }}
                    />
                    <span className="position-absolute bottom-0 end-0 bg-success border border-3 border-white rounded-circle h-15px w-15px"></span>
                  </div>

                  <h4 className="fw-bold mb-1 text-gray-800">Jatin Mata - 9489</h4>
                  <div className="text-muted fw-semibold mb-5">Software Department</div>

                  <div className="row g-3 mb-6">
                    <Stat title="Date" value="21-03-2026" />
                    <Stat title="Work Hours" value="08:30" primary />
                    <Stat title="Check-in" value="09:00 AM" success />
                    <Stat title="Check-out" value="06:00 PM" danger />
                  </div>

                  <span className="badge badge-success fs-7 fw-bold px-4 py-2">Present</span>
                </div>
              </div>
            </div>

            {/* RIGHT LEAVE TABLE */}
            <div className="col-xl-8">
              <div className="card card-xl-stretch mb-xl-4">
                <div className="card-header border-0 pt-5 d-flex justify-content-between">
                  <h3 className="card-title fw-bolder fs-3">Leave Balance Status</h3>
                  <button className="btn btn-sm btn-light-primary">Apply Leave</button>
                </div>

                <div className="card-body py-3">
                  <div className="table-responsive">
                    <table className="table table-row-dashed align-middle">
                      <thead>
                        <tr className="fw-bolder text-dark bg-light-primary">
                          <th>Leave Type</th>
                          <th className="text-center">Total</th>
                          <th className="text-center">Used</th>
                          <th className="text-center">Remaining</th>
                        </tr>
                      </thead>
                      <tbody>
                        <LeaveRow title="Weekly Off (Monthly)" total="4" used="2" remaining="2"/>
                        <LeaveRow title="Casual Leave (Yearly)" total="7" used="2" remaining="5"/>
                        <LeaveRow title="Bereavement Leave" total="3" used="2" remaining="1"/>
                        <LeaveRow title="Marriage Leave" total="5" used="2" remaining="3"/>
                        <LeaveRow title="Skill Enhancement Leave" total="5" used="2" remaining="3"/>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== PROFILE FORM ===== */}
          <div className="card mt-10">
            <div className="card-header">
              <h3 className="fw-bolder">Profile Details</h3>
            </div>

            <div className="card-body p-9">

              <FormRow label="Avatar">
                <input type="file" className="form-control form-control-solid w-50" />
              </FormRow>

              <FormRow label="Full Name">
                <div className="row">
                  <div className="col-lg-6">
                    <input className="form-control form-control-solid" defaultValue="Jatin"/>
                  </div>
                  <div className="col-lg-6">
                    <input className="form-control form-control-solid" defaultValue="Mata"/>
                  </div>
                </div>
              </FormRow>

              <FormRow label="Organization">
                <input disabled className="form-control form-control-solid" defaultValue="Narayan Seva Sansthan"/>
              </FormRow>

              <FormRow label="Phone">
                <input className="form-control form-control-solid" defaultValue="+91 7581028921"/>
              </FormRow>

              <FormRow label="Joining Date">
                <input disabled className="form-control form-control-solid" defaultValue="04-09-2025"/>
              </FormRow>

              <FormRow label="Email">
                <input disabled className="form-control form-control-solid" defaultValue="uiux.software1@narayanseva.org"/>
              </FormRow>

              <FormRow label="District">
                <input disabled className="form-control form-control-solid" defaultValue="Udaipur"/>
              </FormRow>

              <FormRow label="State">
                <input disabled className="form-control form-control-solid" defaultValue="Rajasthan"/>
              </FormRow>

              <FormRow label="Country">
                <input disabled className="form-control form-control-solid" defaultValue="India"/>
              </FormRow>

            </div>

            <div className="card-footer text-end">
              <button className="btn btn-light me-3">Discard</button>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ===== SMALL COMPONENTS ===== */

const Stat = ({title, value, primary, success, danger}: any) => (
  <div className="col-6">
    <div className={`rounded p-3 ${
      success ? "bg-light-success" :
      danger ? "bg-light-danger" :
      "bg-light"
    }`}>
      <div className={`fw-bold ${
        primary ? "text-primary" :
        success ? "text-success" :
        danger ? "text-danger" : ""
      }`}>
        {value}
      </div>
      <small>{title}</small>
    </div>
  </div>
);

const LeaveRow = ({title,total,used,remaining}:any) => (
  <tr>
    <td className="fw-bold">{title}</td>
    <td className="text-center">{total}</td>
    <td className="text-center">{used}</td>
    <td className="text-center">{remaining}</td>
  </tr>
);

const FormRow = ({label, children}:any) => (
  <div className="row mb-6">
    <label className="col-lg-4 fw-bold">{label}</label>
    <div className="col-lg-8">{children}</div>
  </div>
);