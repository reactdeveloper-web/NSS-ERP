import React from "react";

const LeaveRow = ({ type, total, used, remaining }) => (
  <tr>
    <td className="fw-bold">{type}</td>
    <td className="text-center fw-bold">{total}</td>
    <td className="text-center fw-bold">{used}</td>
    <td className="text-center fw-bold">{remaining}</td>
  </tr>
);

export default function EmployeeProfile() {
  return (
    <div className="container-fluid">
      <div className="row gy-5 g-xl-8">
        
        {/* LEFT CARD */}
        <div className="col-xl-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center p-8">
              
              {/* Avatar */}
              <div className="position-relative mb-4">
                <img
                  src="/assets/media/avatars/150-26.jpg"
                  className="rounded-circle"
                  width="90"
                  alt=""
                />
                <span className="position-absolute bottom-0 end-0 bg-success border border-3 border-white rounded-circle h-15px w-15px"></span>
              </div>

              <h4 className="fw-bold mb-1">Jatin Mata - 9489</h4>
              <div className="text-muted mb-5">Software Department</div>

              <div className="row g-3 mb-6">
                <div className="col-6">
                  <div className="bg-light rounded p-3">
                    <div className="fw-bold">21-03-2026</div>
                    <small>Date</small>
                  </div>
                </div>

                <div className="col-6">
                  <div className="bg-light rounded p-3">
                    <div className="fw-bold text-primary">08:30</div>
                    <small>Work Hours</small>
                  </div>
                </div>

                <div className="col-6">
                  <div className="bg-light-success rounded p-3">
                    <div className="fw-bold text-success">09:00 AM</div>
                    <small>Check-in</small>
                  </div>
                </div>

                <div className="col-6">
                  <div className="bg-light-danger rounded p-3">
                    <div className="fw-bold text-danger">06:00 PM</div>
                    <small>Check-out</small>
                  </div>
                </div>
              </div>

              <span className="badge bg-success px-4 py-2">Present</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD — LEAVE TABLE */}
        <div className="col-xl-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h3 className="fw-bold">Leave Balance Status</h3>
              <button className="btn btn-light-primary btn-sm">
                Apply Leave
              </button>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-row-dashed">
                  <thead className="bg-light-primary">
                    <tr>
                      <th>Leave Type</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Used</th>
                      <th className="text-center">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    <LeaveRow type="Weekly Off (Monthly)" total="4" used="2" remaining="2"/>
                    <LeaveRow type="Casual Leave (Yearly)" total="7" used="2" remaining="5"/>
                    <LeaveRow type="Bereavement Leave" total="3" used="2" remaining="1"/>
                    <LeaveRow type="Marriage Leave" total="5" used="2" remaining="3"/>
                    <LeaveRow type="Skill Enhancement" total="5" used="2" remaining="3"/>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE FORM */}
      <div className="card mt-10">
        <div className="card-header">
          <h3 className="fw-bold">Profile Details</h3>
        </div>

        <div className="card-body">
          <div className="row mb-6">
            <label className="col-lg-4 fw-bold">Full Name</label>
            <div className="col-lg-4">
              <input className="form-control form-control-solid" defaultValue="Jatin"/>
            </div>
            <div className="col-lg-4">
              <input className="form-control form-control-solid" defaultValue="Mata"/>
            </div>
          </div>

          <div className="row mb-6">
            <label className="col-lg-4 fw-bold">Company</label>
            <div className="col-lg-8">
              <input className="form-control form-control-solid" defaultValue="Narayan Seva Sansthan"/>
            </div>
          </div>

          <div className="row mb-6">
            <label className="col-lg-4 fw-bold">Phone</label>
            <div className="col-lg-8">
              <input className="form-control form-control-solid" defaultValue="+91 7581028921"/>
            </div>
          </div>
        </div>

        <div className="card-footer text-end">
          <button className="btn btn-light me-3">Discard</button>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}