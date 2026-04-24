import React, { useEffect, useState } from "react";
import {
  getCallActivitiesService,
  ActivityItem,
} from "src/api/historyService";


const HistoryCard = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    try {
      const data = await getCallActivitiesService({
        NGCODE: 0,
        ContactNo: 9928795481,
        QDATE: "2026-01-01",
        DATAFLAG: "GANGOTRI",
        EMAILID: "",
        VMID: 0,
        pageindex: 1,
        pagesize: 20,
      });

      setActivities(data?.Data || []);
      setTotalRecords(data?.Meta?.TotalRecords || 0);
    } catch (err) {
      console.error("History API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="card shadow-sm mb-5">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold mb-0">History</h3>
        </div>

        <div className="card-toolbar">
          <span className="badge badge-light-primary me-3">
            {totalRecords} Items
          </span>
        </div>
      </div>

      <div className="card-body" style={{ maxHeight: 420, overflow: "auto" }}>
        {loading ? (
          <div className="text-center py-10">Loading history...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10">No history found</div>
        ) : (
          <div className="timeline">
            {activities.map((item) => (
              <TimelineItem key={item.Id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface TimelineProps {
  item: ActivityItem;
}

const TimelineItem: React.FC<TimelineProps> = ({ item }) => {
  const getIcon = (type: string) => {
    if (type?.includes("Call"))
      return { icon: "fa fa-phone", color: "primary" };

    if (type?.includes("WHATSAPP"))
      return { icon: "bi-whatsapp", color: "success" };

    if (type === "PO")
      return { icon: "fa fa-file-invoice", color: "warning" };

    if (type === "QT")
      return { icon: "fa fa-file-alt", color: "info" };

    if (type === "RECEIVE")
      return { icon: "fa fa-receipt", color: "danger" };

    return { icon: "fa fa-history", color: "dark" };
  };

  const { icon, color } = getIcon(item.Activity_Type);

  return (
    <div className="timeline-item mb-7">
      <div className="timeline-line"></div>

      <div className={`timeline-icon bg-light-${color}`}>
        <i className={`${icon} text-${color}`}></i>
      </div>

      <div className="timeline-content">
        <div className="fw-bold">
          {item.Activity_Type}{" "}
          {item.Activity_status && `• ${item.Activity_status}`}
        </div>

        <div className="text-muted">
          {item.Activity_Detail || "No details"}
        </div>

        <div className="text-muted fs-8 mt-1">
          {item.Activity_date}{" "}
          {item.Activity_by && `• by ${item.Activity_by}`}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;