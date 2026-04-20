import React from "react";

const ViewCard = () => {
  const items = ["History", "CIT", "DTS", "Mailing"];

  return (
    <div className="card shadow-sm">
      <div className="card-header">
         <div className="card-title">
        <h3 className="fw-bold">View</h3>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-md-6" key={item}>
              <button className="btn btn-light-primary w-100 d-flex justify-content-between">
                {item} <i className="ki-outline ki-arrow-right fs-4"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCard;