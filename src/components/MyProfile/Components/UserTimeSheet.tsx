import React from "react";
import { UserProfileCard } from "./UserProfileCard";
import { LeaveBalanceCard } from "./LeaveBalanceCard";
import { ProfileDetailsForm } from "./ProfileDetailsForm";

export const UserTimeSheet = () => {
  return (
    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">

      {/* TOOLBAR */}
      <div className="toolbar">
        <div className="container-fluid d-flex flex-stack">
          <div className="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0">
            <h1 className="fw-bolder fs-3 my-1">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="post d-flex flex-column-fluid">
        <div className="container-fluid">

          <div className="row gy-5 g-xl-8">
            <UserProfileCard />
            <LeaveBalanceCard />
          </div>

          <ProfileDetailsForm />

        </div>
      </div>
    </div>
  );
};