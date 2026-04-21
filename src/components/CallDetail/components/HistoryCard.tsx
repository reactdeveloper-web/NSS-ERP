import React from "react";

const HistoryCard = () => {
  return (
    <div className="card shadow-sm mb-5">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold mb-0">History</h3>
        </div>
        <div className="card-toolbar">
          <span className="badge badge-light-primary me-3">4 Items</span>
          <button className="btn btn-light-primary btn-sm">
            <i className="fa fa-plus"></i> Add Note
          </button>
        </div>
      </div>

      <div className="card-body" style={{ maxHeight: 420, overflow: "auto" }}>
        <div className="timeline">
          <TimelineItem icon="fa fa-phone" color="primary" title="Call • Connected" text="Donor asked for donation link." />
          <TimelineItem icon="bi-whatsapp" color="success" title="WhatsApp • Sent" text="Donation link shared." />
          <TimelineItem icon="fa fa-receipt" color="warning" title="Receipt • Generated" text="RCPT-2026-00981 ₹2,100" />
          <TimelineItem icon="bi-card-checklist" color="info" title="Note • Added" text="Prefers morning calls." />
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ icon, color, title, text }: any) => (
  <div className="timeline-item mb-7">
    <div className="timeline-line"></div>
    <div className={`timeline-icon bg-light-${color}`}>
      <i className={`${icon} text-${color}`}></i>
    </div>
    <div className="timeline-content">
      <div className="fw-bold">{title}</div>
      <div className="text-muted">{text}</div>
    </div>
  </div>
);

export default HistoryCard;