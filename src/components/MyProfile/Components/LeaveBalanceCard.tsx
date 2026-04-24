import React from "react";

export const LeaveBalanceCard = () => {
  return (
    <div className="col-xl-8">
      <div className="card card-xl-stretch mb-xl-4 shadow-sm">

        {/* HEADER */}
        <div className="card-header pt-3 pb-3">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">
              Leave Balance Status
            </span>
          </h3>

          <div className="card-toolbar">
            <button className="btn btn-sm btn-light btn-active-primary">
              <span className="svg-icon svg-icon-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect opacity="0.5" x="11.364" y="20.364" width="16" height="2" rx="1" transform="rotate(-90 11.364 20.364)" fill="black"/>
                  <rect x="4.36396" y="11.364" width="16" height="2" rx="1" fill="black"/>
                </svg>
              </span>
              Apply Leave
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="card-body py-3">
          <div className="table-responsive">
            <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">

              <thead>
                <tr className="fw-bolder text-dark bg-light-primary text-nowrap">
                  <th className="min-w-50px">Leave Type</th>
                  <th className="min-w-150px text-center">Total Leave</th>
                  <th className="min-w-140px text-center">Used Leave</th>
                  <th className="min-w-120px text-center">Remaining Leave</th>
                </tr>
              </thead>

              <tbody>
                <LeaveRow title="Weekly Off (Monthly)" total="4" used="2.00" remaining="2.00" />
                <LeaveRow title="Casual Leave (Yearly)" total="7" used="2.00" remaining="5.00" />
                <LeaveRow title="Bereavement ( Death ) leave (Yearly)" total="3" used="2.00" remaining="1.00" />
                <LeaveRow title="Marriage Leave (Yearly)" total="5" used="2.00" remaining="3.00" />
                <LeaveRow title="Skill Enhancement Leave (Yearly)" total="5" used="2.00" remaining="3.00" />
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
};


/* TABLE ROW COMPONENT */
const LeaveRow = ({ title, total, used, remaining }: any) => (
  <tr>
    <td>
      <div className="d-flex align-items-center">
        <div className="d-flex justify-content-start flex-column">
          <span className="text-dark fw-bold fs-6">{title}</span>
        </div>
      </div>
    </td>

    <td className="text-center">
      <span className="text-dark fw-bold d-block fs-6">{total}</span>
    </td>

    <td className="text-center">
      <span className="text-dark fw-bold d-block fs-6">{used}</span>
    </td>

    <td className="text-center">
      <span className="text-dark fw-bold d-block fs-6">{remaining}</span>
    </td>
  </tr>
);