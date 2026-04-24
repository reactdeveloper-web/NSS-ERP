import React, { useEffect, useMemo, useState } from "react";
import { BillDetailItem } from "./types";

interface BillDetailsTableProps {
  bills: BillDetailItem[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface BillDetailModalProps {
  bill: BillDetailItem | null;
  onClose: () => void;
}

const statusOptions = ["not check", "yes", "no", "hold"];

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const getValueByKeys = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return "";
};

const getFlagChecked = (record: Record<string, unknown>, keys: string[]) => {
  const value = String(getValueByKeys(record, keys)).toLowerCase();
  return ["y", "yes", "true", "1"].includes(value);
};

const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "yes") {
    return "badge-light-success";
  }

  if (normalizedStatus === "no") {
    return "badge-light-danger";
  }

  if (normalizedStatus === "hold") {
    return "badge-light-warning";
  }

  return "badge-light-secondary";
};

export const BillDetailsTable = ({
  bills,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: BillDetailsTableProps) => {
  const [selectedBill, setSelectedBill] = useState<BillDetailItem | null>(null);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length >= 3;
  const filteredBills = useMemo(() => {
    if (!isSearchActive) {
      return bills;
    }

    return bills.filter((bill) =>
      [
        bill.billId,
        bill.billNo,
        bill.billDate,
        bill.vendorSadhak,
        bill.material,
        bill.billAmount,
        bill.status,
      ]
        .map(formatValue)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [bills, isSearchActive, normalizedSearch]);
  const displayTotalCount = isSearchActive ? filteredBills.length : totalCount;
  const displayPageNumber = isSearchActive ? 1 : pageNumber;
  const totalPages = Math.max(1, Math.ceil(displayTotalCount / pageSize));
  const startRecord =
    displayTotalCount === 0 ? 0 : (displayPageNumber - 1) * pageSize + 1;
  const endRecord =
    displayTotalCount === 0
      ? 0
      : Math.min(displayPageNumber * pageSize, displayTotalCount);
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const safeStartPage = Math.max(1, displayPageNumber - 2);
      const safeEndPage = Math.min(totalPages, safeStartPage + 4);
      const adjustedStartPage = Math.max(1, safeEndPage - 4);

      return adjustedStartPage + index;
    },
  );

  return (
    <>
      <div className="card h-100 mb-5 mb-xl-8 dashboard-listing-card">
        <div className="card-header pt-3 pb-3">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bolder fs-3 mb-1">
              Bills Pending
            </span>
            <span className="text-muted mt-1 fw-bold fs-7">
              {displayTotalCount} records
            </span>
          </h3>
          <div className="card-toolbar m-0">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm form-control-solid w-250px"
                placeholder="Advance Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card-body py-3 dashboard-listing-body">
          {loading ? (
            <div className="text-muted fw-bold">Loading...</div>
          ) : (
            <div className="dashboard-listing-content">
              <div className="table-responsive stickyTable dashboard-listing-table">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4 dashboard-task-detail-table">
                  <thead>
                    <tr className="fw-bolder text-muted">
                      <th width="5%">Bill Id</th>
                      <th width="12%">Bill No</th>
                      <th width="12%">Bill Date</th>
                      <th width="22%">Vendor/Sadhak</th>
                      <th width="27%">Material</th>

                      <th className="text-end" width="10%">
                        Bill Amount
                      </th>
                      <th className="text-center" width="10%">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBills.map((bill, index) => (
                      <tr
                        key={`${bill.billId}-${bill.billNo}-${index}`}
                        className="cursor-pointer"
                        onClick={() => setSelectedBill(bill)}
                      >
                        <td>{formatValue(bill.billId)}</td>
                        <td>{formatValue(bill.billNo)}</td>
                        <td>{formatValue(bill.billDate)}</td>
                        <td>
                          <div className="fw-bold text-dark">
                            {formatValue(bill.vendorSadhak)}
                          </div>
                        </td>
                        <td>{formatValue(bill.material)}</td>

                        <td className="text-end">
                          {formatValue(bill.billAmount)}
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge fs-8 fw-bolder ${getStatusBadgeClass(
                              bill.status,
                            )}`}
                          >
                            {formatValue(bill.status)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredBills.length && (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center text-muted fw-bold"
                        >
                          No bill records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="d-flex flex-stack flex-wrap pt-5 mt-auto">
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted fs-7">Show</span>
              <select
                className="form-select form-select-sm form-select-solid w-100px"
                value={pageSize}
                onChange={(event) => {
                  onPageSizeChange(Number(event.target.value));
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted fs-7">per page</span>
            </div>

            <div className="d-flex align-items-center gap-4">
              <span className="text-muted fs-7">
                Showing {startRecord} to {endRecord} of {displayTotalCount}
              </span>
              <ul className="pagination pagination-circle pagination-outline mb-0">
                <li
                  className={`page-item ${
                    displayPageNumber === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      onPageChange(Math.max(1, displayPageNumber - 1))
                    }
                  >
                    &laquo;
                  </button>
                </li>
                {pageNumbers.map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === displayPageNumber ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    displayPageNumber >= totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      onPageChange(Math.min(totalPages, displayPageNumber + 1))
                    }
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BillDetailModal
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
      />
    </>
  );
};

const BillDetailModal = ({ bill, onClose }: BillDetailModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("not check");
  const [gateSeal, setGateSeal] = useState(false);
  const [storeSeal, setStoreSeal] = useState(false);
  const [po, setPo] = useState(false);
  const [contract, setContract] = useState(false);
  const [direct, setDirect] = useState(false);
  const [quotation, setQuotation] = useState(false);
  const [forwardToHod, setForwardToHod] = useState(false);
  const [forwardToAudit, setForwardToAudit] = useState(false);
  const [sachivalayaRemark, setSachivalayaRemark] = useState("");
  const [presidentRemark, setPresidentRemark] = useState("");

  useEffect(() => {
    if (!bill) {
      return;
    }

    setStatus(bill.status || "not check");
    setGateSeal(getFlagChecked(bill.raw, ["GateSeal", "Gate_Seal", "gate_seal"]));
    setStoreSeal(
      getFlagChecked(bill.raw, ["StoreSeal", "Store_Seal", "store_seal"]),
    );
    setPo(getFlagChecked(bill.raw, ["PO", "Po", "po"]));
    setContract(getFlagChecked(bill.raw, ["Contract", "contract"]));
    setDirect(getFlagChecked(bill.raw, ["Direct", "direct"]));
    setQuotation(getFlagChecked(bill.raw, ["Quotation", "quotation"]));
    setForwardToHod(
      getFlagChecked(bill.raw, ["ForwardToHOD", "Forward_To_HOD", "forward_hod"]),
    );
    setForwardToAudit(
      getFlagChecked(bill.raw, [
        "ForwardToAudit",
        "Forward_To_Audit",
        "forward_audit",
      ]),
    );
    setSachivalayaRemark(
      String(
        getValueByKeys(bill.raw, [
          "SachivalayaRemark",
          "Sachivalaya_Remark",
          "sachivalaya_remark",
        ]),
      ),
    );
    setPresidentRemark(
      String(
        getValueByKeys(bill.raw, [
          "PresidentRemark",
          "President_Remark",
          "president_remark",
        ]),
      ),
    );
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => window.cancelAnimationFrame(animationFrame);
  }, [bill]);

  if (!bill) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(onClose, 300);
  };

  const raw = bill.raw;
  const vendorStatus = getValueByKeys(raw, [
    "Approval_Status",
    "ApprovalStatus",
    "approval_status",
  ]);
  const department = getValueByKeys(raw, [
    "Dept",
    "Dept.",
    "Department",
    "department",
    "dept_name",
    "DeptName",
  ]);
  const na = getValueByKeys(raw, ["NA", "N_A", "n_a"]);
  const entryBy = getValueByKeys(raw, ["EntryBy", "Entry_By", "entry_by"]);
  const billRecDate = getValueByKeys(raw, [
    "Bill_Rec_Date",
    "BillRecDate",
    "bill_rec_date",
  ]);
  const paymentDueDate = getValueByKeys(raw, [
    "PaymentDueDate",
    "Payment_Due_Date",
    "payment_due_date",
  ]);
  const gateReceiveDate = getValueByKeys(raw, [
    "GateReceiveDate",
    "Gate_Receive_Date",
    "ReceiveDate",
  ]);
  const storeReceiveDate = getValueByKeys(raw, [
    "StoreReceiveDate",
    "Store_Receive_Date",
  ]);
  const auditReceiveDate = getValueByKeys(raw, [
    "AuditReceiveDate",
    "Audit_Receive_Date",
  ]);
  const poReceiveDate = getValueByKeys(raw, ["POReceiveDate", "PO_Receive_Date"]);
  const presidentReceiveDate = getValueByKeys(raw, [
    "PresidentReceiveDate",
    "President_Receive_Date",
  ]);
  const gateRemark = getValueByKeys(raw, ["GateRemark", "Gate_Remark"]);
  const storeRemark = getValueByKeys(raw, ["StoreRemark", "Store_Remark"]);
  const auditRemark = getValueByKeys(raw, ["AuditRemark", "Audit_Remark"]);
  const poRemark = getValueByKeys(raw, ["PORemark", "PO_Remark"]);
  const presidentAmount = getValueByKeys(raw, [
    "PresidentAmount",
    "President_Amount",
  ]);

  return (
    <>
      <div
        className={`dashboard-slide-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={handleClose}
      />
      <aside
        className={`dashboard-slide-modal ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Bill pending detail"
      >
        <div className="dashboard-slide-header">
          <div>
            <h4 className="mb-1">Bill Pending Detail</h4>
            <div className="text-muted fs-7">
              Bill Id: {formatValue(bill.billId)} | Bill No:{" "}
              {formatValue(bill.billNo)}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-icon btn-active-color-primary"
            aria-label="Close"
            onClick={handleClose}
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>
        </div>

        <div className="dashboard-slide-body">
          <div className="row g-4 mb-5">
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Contracts
              </label>
              <div className="fw-bold text-dark">
                {formatValue(getValueByKeys(raw, ["Contracts", "ContractType"]))}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Vendor/Sadhak
              </label>
              <div className="fw-bold text-dark">
                {formatValue(bill.vendorSadhak)}
              </div>
              <div className="text-muted fs-8">
                Approval Status: {formatValue(vendorStatus)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Dept.
              </label>
              <div className="fw-bold text-dark">
                {formatValue(department)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Material Desc.
              </label>
              <div className="fw-bold text-dark">
                {formatValue(bill.material)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Bill Id
              </label>
              <div className="fw-bold text-dark">{formatValue(bill.billId)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Bill No</label>
              <div className="fw-bold text-dark">{formatValue(bill.billNo)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Bill Date</label>
              <div className="fw-bold text-dark">
                {formatValue(bill.billDate)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Entry By
              </label>
              <div className="fw-bold text-dark">{formatValue(entryBy)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">N.A.</label>
              <div className="fw-bold text-dark">{formatValue(na)}</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Bill Amount
              </label>
              <div className="fw-bold text-dark">
                {formatValue(bill.billAmount)}
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Bill Rec Date
              </label>
              <div className="fw-bold text-primary fs-4">
                {formatValue(billRecDate)}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Payment Due Date
              </label>
              <div className="fw-bold text-primary fs-4">
                {formatValue(paymentDueDate)}
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">Status</label>
              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-2">
                Document Flags
              </label>
              <div className="d-flex flex-column gap-3">
                {[
                  ["Gate Seal", gateSeal, setGateSeal],
                  ["Store Seal", storeSeal, setStoreSeal],
                  ["PO", po, setPo],
                  ["Direct", direct, setDirect],
                  ["Contract", contract, setContract],
                  ["Quotation", quotation, setQuotation],
                  ["Forward To HOD", forwardToHod, setForwardToHod],
                  ["Forward To Audit", forwardToAudit, setForwardToAudit],
                ].map(([label, checked, setChecked]) => (
                  <label
                    className="form-check form-check-custom form-check-solid"
                    key={String(label)}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={Boolean(checked)}
                      onChange={event =>
                        (setChecked as React.Dispatch<React.SetStateAction<boolean>>)(
                          event.target.checked,
                        )
                      }
                    />
                    <span className="form-check-label fw-bold">
                      {String(label)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {[
              ["Gate", gateReceiveDate, gateRemark],
              ["Store", storeReceiveDate, storeRemark],
              ["Audit", auditReceiveDate, auditRemark],
              ["PO", poReceiveDate, poRemark],
              ["President", presidentReceiveDate, ""],
            ].map(([label, date, remark]) => (
              <div className="col-sm-6" key={String(label)}>
                <label className="form-label fs-8 text-muted mb-1">
                  {String(label)} Receive Date
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm mb-2"
                  value={String(date || "")}
                  readOnly
                />
                <label className="form-label fs-8 text-muted mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm mb-2"
                  value={String(bill.billAmount || "")}
                  readOnly
                />
                <label className="form-label fs-8 text-muted mb-1">
                  Remark
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows={3}
                  value={String(remark || "")}
                  readOnly
                />
              </div>
            ))}
          </div>

          <div className="row g-4 mb-5">
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                Sachivalaya Remark
              </label>
              <textarea
                className="form-control form-control-sm"
                rows={5}
                value={sachivalayaRemark}
                onChange={event => setSachivalayaRemark(event.target.value)}
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label fs-8 text-muted mb-1">
                President Remark
              </label>
              <textarea
                className="form-control form-control-sm mb-3"
                rows={5}
                value={presidentRemark}
                onChange={event => setPresidentRemark(event.target.value)}
              />
              <label className="form-label fs-8 text-muted mb-1">
                President Amount
              </label>
              <div className="fw-bold text-dark">
                {formatValue(presidentAmount || bill.billAmount)} INR
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle dashboard-bill-modal-table">
              <tbody>
                <tr>
                  <th>Pay Terms And Approval</th>
                  <td>
                    {formatValue(
                      getValueByKeys(raw, [
                        "PayTermsAndApproval",
                        "Pay_Terms_And_Approval",
                        "PayTerms",
                      ]),
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Delay Reason</th>
                  <td>
                    {formatValue(
                      getValueByKeys(raw, ["DelayReason", "Delay_Reason"]),
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Payment Status</th>
                  <td>
                    {formatValue(
                      getValueByKeys(raw, ["PaymentStatus", "Payment_Status"]),
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Verify Code</th>
                  <td>{formatValue(getValueByKeys(raw, ["VerifyCode"]))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-slide-footer">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary">
            Save
          </button>
        </div>
      </aside>
    </>
  );
};
