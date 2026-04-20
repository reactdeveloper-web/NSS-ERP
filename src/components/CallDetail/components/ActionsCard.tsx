import React from "react";

const ActionsCard = () => {
  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <div className="card-title">
        <h3 className="fw-bold">Actions</h3>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <ActionBtn text="Create Announce" icon="fa-bullhorn" color="info" />
          <ActionBtn text="Create Receive ID" icon="fa-clipboard-check" color="success" />
          <ActionBtn text="Create CIT" icon="fa-phone" color="warning" />
          <ActionBtn text="Create Guest ID" icon="fa-id-card" color="primary" />
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ text, icon, color }: any) => (
  <div className="col-md-6">
    <button className={`btn btn-light-${color} w-100`}>
      <i className={`fa ${icon} me-2`}></i>{text}
    </button>
  </div>
);

export default ActionsCard;