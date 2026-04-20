import React from "react";

export const UserProfileCard = () => {
  return (
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
  );
};

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