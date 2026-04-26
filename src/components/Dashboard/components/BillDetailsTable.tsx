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
  searchValue?: string;
  onSearchChange?: (search: string) => void;
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
  searchValue,
  onSearchChange,
}: BillDetailsTableProps) => {
  const [selectedBill, setSelectedBill] = useState<BillDetailItem | null>(null);
  const [localSearch, setLocalSearch] = useState("");
  const search = searchValue ?? localSearch;
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
                onChange={(event) => {
                  setLocalSearch(event.target.value);
                  onSearchChange?.(event.target.value);
                }}
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
                      <th className='width-5'>Bill Id</th>
                      <th className='width-12'>Bill No</th>
                      <th className='width-12'>Bill Date</th>
                      <th className='width-22'>Vendor/Sadhak</th>
                      <th className='width-27'>Material</th>

                      <th className="text-end width-10">
                        Bill Amount
                      </th>
                      <th className="text-center width-10">
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
  const contractType = getValueByKeys(raw, ["Contracts", "ContractType"]);
  const createdDate = getValueByKeys(raw, [
    "CreatedDate",
    "Created_Date",
    "Bill_Rec_Date",
    "BillRecDate",
    "bill_rec_date",
    "BillDate",
    "BDate",
  ]);
  const verifyCode = getValueByKeys(raw, ["VerifyCode"]);
  const paymentStatus = getValueByKeys(raw, ["PaymentStatus", "Payment_Status"]);
  const payTermsAndApproval = getValueByKeys(raw, [
    "PayTermsAndApproval",
    "Pay_Terms_And_Approval",
    "PayTerms",
  ]);
  const delayReason = getValueByKeys(raw, ["DelayReason", "Delay_Reason"]);
  const flagItems = [
    { label: "Gate Seal", checked: gateSeal, icon: "fa-check-circle" },
    { label: "Store Seal", checked: storeSeal, icon: "fa-check-circle" },
    { label: "PO Linked", checked: po, icon: "fa-check-circle" },
    { label: "Direct", checked: direct, icon: "fa-circle-o" },
    { label: "Contract", checked: contract, icon: "fa-check-circle" },
    {
      label: "Visit Done",
      checked: getFlagChecked(raw, ["VisitDone", "Visit_Done"]),
      icon: "fa-check-circle",
    },
    {
      label: "Interaction",
      checked: getFlagChecked(raw, ["Interaction", "InteractionDone"]),
      icon: "fa-check-circle",
    },
    {
      label: "Verified",
      checked: getFlagChecked(raw, ["Verified", "IsVerified"]),
      icon: "fa-shield",
    },
  ];
  const fileLinks = [
    {
      title: "Bill Files (Final Scan)",
      meta: String(getValueByKeys(raw, ["BillFileMeta", "BillFilesMeta"])),
      href: String(getValueByKeys(raw, ["BillFiles", "Bill_File", "FilePath"])),
      icon: "fa-file-pdf-o",
      actionIcon: "fa-download",
    },
    {
      title: "Quotation Files",
      meta: String(
        getValueByKeys(raw, ["QuotationMeta", "QuotationFilesMeta", "Quotation"]),
      ),
      href: String(getValueByKeys(raw, ["QuotationFile", "Quotation_Path", "QuotationPath"])),
      icon: "fa-paperclip",
      actionIcon: "fa-eye",
    },
    {
      title: "Vendor/Agreement Files",
      meta: String(getValueByKeys(raw, ["AgreementMeta", "AgreementNo", "AgreementId"])),
      href: String(getValueByKeys(raw, ["AgreementFile", "Agreement_Path", "VendorFile"])),
      icon: "fa-file-text-o",
      actionIcon: "fa-external-link",
    },
    {
      title: "Purchase Order (PO)",
      meta: String(getValueByKeys(raw, ["PONumber", "PO_Number", "PO"])),
      href: String(getValueByKeys(raw, ["POFile", "PO_Path", "PurchaseOrderFile"])),
      icon: "fa-shopping-bag",
      actionIcon: "fa-cog",
    },
  ];
  const stageCards = [
    {
      title: "Billing Forward",
      time: String(gateReceiveDate || billRecDate),
      amount: bill.billAmount,
      remark: gateRemark || "Documents complete.",
      footer: "FORWARD TO HOD",
      active: Boolean(gateReceiveDate || gateRemark),
    },
    {
      title: "HOD Remark",
      time: String(storeReceiveDate || paymentDueDate),
      amount: bill.billAmount,
      remark: storeRemark || sachivalayaRemark || "No remarks available.",
      footer: "FORWARD TO AUDIT",
      active: Boolean(storeReceiveDate || storeRemark || sachivalayaRemark),
    },
    {
      title: "Commercial Forward",
      time: String(poReceiveDate || paymentDueDate),
      amount: bill.billAmount,
      remark: poRemark || "Price verified against PO reference.",
      footer: "FORWARD TO AUDIT",
      active: Boolean(poReceiveDate || poRemark),
    },
    {
      title: "Audit Forward",
      time: String(auditReceiveDate || paymentDueDate),
      amount: presidentAmount || bill.billAmount,
      remark: auditRemark || "Internal audit check passed. All seals verified.",
      footer: "FINAL SANCTION",
      active: Boolean(auditReceiveDate || auditRemark),
      tags: [po ? "PO" : "", contract ? "Contract" : "", quotation ? "Quotation" : ""].filter(Boolean),
    },
    {
      title: "Advisor Forward",
      time: "Pending",
      amount: "",
      remark: "Awaiting advisor input for high-value sanction.",
      footer: "",
      active: false,
      pending: true,
      tags: [],
    },
  ];

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
            <h4 className="mb-1 dashboard-panel-title fs-3">
              {formatValue(bill.vendorSadhak || department)}
              <div className="text-muted mt-1 fw-bold fs-6">{formatValue(department)}</div>
            </h4>
            <div className="text-primary mt-1 fs-6">
               ID: {formatValue(bill.billNo || bill.billId)}
              <span className="mx-5">Created: {formatValue(createdDate)}</span>
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

        <div className="dashboard-slide-body dashboard-bill-panel-body">
          <section className="card p-4 mb-3 border">
            <div className="row g-4">              
              <div className="col-12">
                <div className="dashboard-bill-label fs-6">Material Description</div>
                <div className="dashboard-bill-text">{formatValue(bill.material)}</div>
              </div>
              <div className="col-12">
                <div className="dashboard-bill-amount-strip rounded fs-5">
                  <span>Total Bill Amount</span>
                  <strong className="fs-3">{formatValue(bill.billAmount)} INR</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-bill-flag-grid gap-2">
            {flagItems.map((item) => (
              <div
                key={item.label}
                className={`dashboard-bill-flag-item rounded-pill fs-6 fw-normal p-2 px-4  ${item.checked ? "is-active" : "is-muted"}`}
              >
                <i className={`fa ${item.icon} fs-3`} aria-hidden="true" />
                <span>{item.label}</span>
              </div>
            ))}
          </section>

          <section className="card p-4 mb-3 border">
            <h5 className="dashboard-bill-section-title">Attachments &amp; Links</h5>
            <div className="dashboard-bill-link-list">
              {fileLinks.map((item) => (
                <a
                  key={item.title}
                  className="dashboard-bill-link-item"
                  href={item.href || "#"}
                  target={item.href ? "_blank" : undefined}
                  rel={item.href ? "noreferrer" : undefined}
                >
                  <div className="dashboard-bill-link-icon">
                    <i className={`fa ${item.icon}`} aria-hidden="true" />
                  </div>
                  <div className="dashboard-bill-link-content">
                    <p>{item.title}</p>
                    <span>{formatValue(item.meta || "Not Available")}</span>
                  </div>
                  <i className={`fa ${item.actionIcon}`} aria-hidden="true" />
                </a>
              ))}
              <div className="dashboard-bill-payment-status">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-money" aria-hidden="true" />
                  <span>Payment Status</span>
                </div>
                <span className="dashboard-bill-payment-pill">
                  {formatValue(paymentStatus || "Processing")}
                </span>
              </div>
            </div>
          </section>

          <section className="dashboard-bill-workflow">
            <h5 className="dashboard-bill-workflow-title">Approval Workflow Stages</h5>
            <div className="dashboard-bill-workflow-line">
              {stageCards.map((stage) => (
                <article
                  key={stage.title}
                  className={`dashboard-bill-workflow-card ${
                    stage.active ? "is-active" : "is-pending"
                  }`}
                >
                  <span className="dashboard-bill-workflow-dot" />
                  <div className="dashboard-bill-workflow-header">
                    <h6>{stage.title}</h6>
                    <span>{formatValue(stage.time)}</span>
                  </div>
                  {stage.tags?.length ? (
                    <div className="dashboard-bill-tag-row">
                      {stage.tags.map((tag) => (
                        <span key={tag} className="dashboard-bill-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {stage.amount ? (
                    <div className="dashboard-bill-workflow-meta">
                      <span>Amt: ₹ {formatValue(stage.amount)}</span>
                    </div>
                  ) : null}
                  <p>{formatValue(stage.remark)}</p>
                  {stage.footer ? (
                    <div className="dashboard-bill-workflow-footer">{stage.footer}</div>
                  ) : null}
                </article>
              ))}

              <section className="dashboard-bill-final-card">
                <h6>Final Sanction Details</h6>
                <div className="mb-4">
                  <label className="form-label fs-8 text-muted mb-2">
                    Sachivalaya Remark
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={sachivalayaRemark}
                    onChange={(event) => setSachivalayaRemark(event.target.value)}
                    placeholder="Enter remarks..."
                  />
                </div>
                <div>
                  <label className="form-label fs-8 text-muted mb-2">
                    President Remark
                  </label>
                  <input
                    className="form-control"
                    value={presidentRemark}
                    onChange={(event) => setPresidentRemark(event.target.value)}
                    placeholder="Enter final decision..."
                  />
                </div>
              </section>
            </div>
          </section>

        </div>

        <div className="dashboard-slide-footer dashboard-bill-action-footer">
          <div className="dashboard-bill-verify d-flex justify-content-between gap-3">
            <div className=" d-flex align-items-center gap-3">
            <label className="form-label fs-8 text-muted mb-0">Verify Code</label>
            <div className="dashboard-bill-verify-input">
              <i className="fa fa-lock" aria-hidden="true" />
              <input
                type="text"
                className="form-control"
                defaultValue={String(verifyCode || "")}
                placeholder="Enter 6-digit security code"
              />
            </div>
            </div>
            <div className=" d-flex align-items-center gap-3">
            <button type="button" className="btn btn-light-danger">
              Reject
            </button>
            <button type="button" className="btn btn-light">
              Hold
            </button>
            </div>
          </div>
          
          <button type="button" className="btn nssBtnColor text-white dashboard-bill-submit">
            <i className="fa fa-shield" aria-hidden="true" />
            <span>Sanction &amp; Authorize Payment</span>
          </button>
        </div>
      </aside>
    </>
  );
};
