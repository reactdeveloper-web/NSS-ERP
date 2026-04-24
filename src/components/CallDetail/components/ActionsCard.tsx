import React from "react";
import { Link } from "react-router-dom";

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
          <ActionBtn
            text="Create Announce"
            to="/announcement?AnnounceID=0&Operation=ADD"
            icon="fa-bullhorn"
            color="info"
          />

          <ActionBtn
            text="Create Receive ID"
            to="/donation-receive"
            icon="fa-clipboard-check"
            color="success"
          />

          <ActionBtn
            text="Create CIT"
            to="cit?InformationCode=0&Operation=ADD"
            icon="fa-phone"
            color="warning"
          />

          <ActionBtn
            text="Create Guest ID"
            to="/guest-id"
            icon="fa-id-card"
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};

type BtnProps = {
  text: string;
  icon: string;
  color: string;
  to: string;
};

const ActionBtn: React.FC<BtnProps> = ({ text, icon, color, to }) => {
  return (
    <div className="col-md-6">
      <Link to={to} className={`btn btn-light-${color} w-100`}>
        <i className={`fa ${icon} me-2`}></i>
        {text}
      </Link>
    </div>
  );
};

export default ActionsCard;