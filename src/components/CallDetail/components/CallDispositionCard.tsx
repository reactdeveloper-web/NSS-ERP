import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";

const CallDispositionCard = () => {

  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateRef.current) {
      flatpickr(dateRef.current, {
        dateFormat: "d M Y",
        minDate: "today",
      });
    }

    if (timeRef.current) {
      flatpickr(timeRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
      });
    }
  }, []);

  return (
    <div className="card shadow-sm mb-5 h-100">

      {/* Header */}
      <div className="card-header">
        <div className="card-title w-100 d-flex justify-content-between">
          <div>
            <h3 className="fw-bold mb-0">Call Disposition</h3>
            <span className="text-muted fs-7">Call meta + follow-up</span>
          </div>

          <button className="btn btn-primary btn-sm">
            <i className="fa fa-save"></i> Save
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="row g-5">

          {/* Call ID */}
          <div className="col-md-12">
            <label className="form-label fw-semibold">Call ID / Inception</label>
            <input
              type="text"
              className="form-control form-control-solid"
              defaultValue="CALL-20260224-0007"
            />
          </div>

          {/* Call Type */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Call Type</label>
            <select className="form-select form-select-solid">
              <option>Inbound</option>
              <option>Outbound</option>
              <option>Missed</option>
            </select>
          </div>

          {/* Call Sub Type */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Call Sub Type</label>
            <select className="form-select form-select-solid">
              <option>Donation</option>
              <option>Receipt</option>
              <option>Enquiry</option>
              <option>Complaint</option>
            </select>
          </div>

          {/* Follow Up Date */}
          <div className="col-md-6 position-relative">
            <label className="form-label fw-semibold">Follow-up Date</label>
            <input
              ref={dateRef}
              className="form-control form-control-solid"
              placeholder="Select Date"
            />
            <i className="bi bi-calendar3 input-icon"></i>
          </div>

          {/* Follow Up Time */}
          <div className="col-md-6 position-relative">
            <label className="form-label fw-semibold">Follow-up Time</label>
            <input
              ref={timeRef}
              className="form-control form-control-solid"
              placeholder="Select Time"
            />
            <i className="bi bi-clock input-icon"></i>
          </div>

          {/* Outcome */}
          <div className="col-12">
            <label className="form-label fw-semibold">Disposition Outcome</label>
            <select className="form-select form-select-solid">
              <option>Interested</option>
              <option>Callback Requested</option>
              <option>Not Interested</option>
              <option>No Answer</option>
              <option>Wrong Number</option>
            </select>
          </div>

          {/* Wrap-up */}
          <div className="col-12">
            <label className="form-label fw-semibold">Wrap-up Notes</label>
            <textarea
              className="form-control form-control-solid"
              rows={3}
              placeholder="Call summary, objections, next steps..."
            />
          </div>

        </div>

        {/* Bottom button */}
        <div className="d-flex justify-content-end gap-3 mt-6 flex-wrap">
          <button className="btn btn-light-primary">
            <i className="fa fa-sms"></i> WhatsApp/SMS
          </button>
        </div>

      </div>
    </div>
  );
};

export default CallDispositionCard;