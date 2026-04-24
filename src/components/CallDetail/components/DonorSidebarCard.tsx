import React, { useEffect, useState, useRef } from "react";
import { getAccountsApi } from "src/api/getDonorApi";

const EMPTY_FORM = {
  name: "",
  city: "",
  country: "India",
  category: "",
  dnid: "",
  pan: "",
  mobile: "",
  email: "",
  dob: "",
  totalDonation: "",
};

const DonorSidebarCard = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAcc, setSelectedAcc] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [editingName, setEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // ⭐ LOAD ACCOUNTS FROM API
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const res = await getAccountsApi("9928795481");
      const data = res?.Data || [];
      setAccounts(data);
      if (data.length) fillForm(data[0]);
    } catch (err) {
      console.error("Failed to load accounts", err);
    }
  };

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus();
  }, [editingName]);

  const fillForm = (acc: any) => {
    if (selectedAcc === acc) {
      setSelectedAcc(null);
      setForm(EMPTY_FORM);
      return;
    }

    setSelectedAcc(acc);
    setEditingName(false);

    if (acc.Account_Type === "DONOR") {
      setForm({
        name: acc.Account_Name || "",
        city: acc.City || "",
        country: acc.Country || "India",
        category: acc.donor_Category || "Regular",
        dnid: acc.NgCode || "",
        pan: acc.PAN_NO || "",
        mobile: acc.Contact_No || "",
        email: acc.EmailId || "",
        dob: acc.DOB || "",
        totalDonation: acc.TotalDonation || "0",
      });
    }

    if (acc.Account_Type === "Patient") {
      setForm({
        name: acc.Account_Name || "",
        city: acc.DISTRICT_NAME || "",
        country: acc.State_Name || "",
        category: "Patient",
        dnid: acc.Patient_id || "",
        pan: "",
        mobile: acc.Contact_No || "",
        email: "",
        dob: acc.DOB || "",
        totalDonation: "—",
      });
    }

    if (acc.Account_Type === "VENDOR") {
      setForm({
        name: acc.Account_Name || "",
        city: "",
        country: "India",
        category: "Vendor",
        dnid: acc.VM_ID || "",
        pan: "",
        mobile: acc.Contact_No || "",
        email: "",
        dob: "",
        totalDonation: "—",
      });
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="card shadow-sm mb-5 h-100">
      <div className="card-header">
        <div className="card-title d-flex justify-content-between w-100">
          <div>
            <h3 className="fw-bold mb-0">Donor Profile</h3>
            <span className="text-muted fs-7">Primary identity & contact</span>
          </div>
          <span className="badge badge-light-success fs-7">
            ID : {form.dnid || "New"}
          </span>
        </div>
      </div>

      <div className="card-body">
        {/* Profile top */}
        <div className="d-flex align-items-center gap-4 mb-6">
          <div className="symbol symbol-40px bg-primary">
            <span className="symbol-label text-white fw-bold fs-4">
              {form.name?.charAt(0) || "D"}
            </span>
          </div>

          <div>
            {editingName ? (
              <input
                ref={nameInputRef}
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                className="form-control form-control-solid form-control-sm fw-bold fs-4 p-1"
              />
            ) : (
              <div
                className="fw-bold fs-4 cursor-pointer"
                onClick={() => setEditingName(true)}
              >
                {form.name || <span className="text-muted">New Profile ✏️</span>}
              </div>
            )}

            {form.category && (
              <div className="text-muted">
                <span className="fw-bold text-success">{form.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="row g-5">
          <Input label="City" name="city" value={form.city} onChange={handleChange} />
          <Input label="Country" name="country" value={form.country} onChange={handleChange} />
          <Input label="Category" name="category" value={form.category} disabled onChange={handleChange} />
          <Input label="DNID" name="dnid" value={form.dnid} disabled onChange={handleChange} />
          <Input label="PAN No." name="pan" value={form.pan} onChange={handleChange} />
          <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="DOB" name="dob" value={form.dob} onChange={handleChange} />
        </div>

        {/* Accounts */}
        <div className="separator my-5"></div>
        <h4 className="fw-bold mb-3">Accounts</h4>
<div className="AccountList">
        {accounts.map((acc: any, i: number) => (
          <div
            key={i}
            onClick={() => fillForm(acc)}
            className={`p-3 mb-2 rounded cursor-pointer border 
              ${selectedAcc === acc ? "border-primary bg-light-primary" : "border-gray-300"}`}
          >
            <div className="fw-bold">{acc.Account_Type}</div>
            <div className="fs-8 text-muted">{acc.Account_Name}</div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="col-md-6">
    <label className="form-label fw-semibold">{label}</label>
    <input
      {...props}
      className="form-control form-control-solid"
    />
  </div>
);

export default DonorSidebarCard;