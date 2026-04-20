import React from "react";

const DonorSidebarCard = () => {
  return (
    <div className="card shadow-sm mb-5 h-100">
      <div className="card-header">
        <div className="card-title d-flex justify-content-between w-100">
          <div className="Card-title">
            <h3 className="fw-bold mb-0">Donor Profile</h3>
            <span className="text-muted fs-7">Primary identity & contact</span>
          </div>
          <span className="badge badge-light-success fs-7">DNID: DN-00121</span>
        </div>
      </div>

      <div className="card-body pt-5">

        <div className="d-flex align-items-center gap-3 mb-5">
          <div className="symbol symbol-40px bg-primary">
            <span className="symbol-label text-white fw-bold">AK</span>
          </div>
          <div>
            <div className="fw-bold fs-5">Arun Kumar</div>
            <div className="text-muted fs-7">
              Donation : <span className="fw-bold text-success">₹1,25,000</span>
            </div>
          </div>
        </div>

        <div className="separator separator-dashed my-4"></div>

        {/* BASIC */}
        <Section title="Basic">
          <Info label="City" value="Udaipur" className="fw-bold" />
          <Info label="Country" value="India" />
          <Info label="Category" value="Regular" />
          <Info label="DOB" value="31 May" />
        </Section>

        {/* CONTACT */}
        <Section title="Contact">
          <Info label="Mobile" value="+91 98XXXXXX20" />
          <Info label="Email" value="arun@example.com" />
          <Info label="PAN" value="ABCDE1234F" />
        </Section>

        <div className="separator separator-dashed my-4"></div>

        <h4 className="fw-bold mb-3">Accounts</h4>
        <AccountMini active title="Donor" subtitle="ID 1 • A" />
        <AccountMini title="Volunteer" subtitle="ID 2 • A" />
       </div>
    </div>
  );
};

const Section = ({ title, children }: any) => (
  <div className="mb-4">
    <div className="fw-bold fs-6 mb-2 text-gray-700">{title}</div>
    {children}
  </div>
);

const Info = ({ label, value }: any) => (
  <div className="d-flex justify-content-between mb-2">
    <span className="text-muted fw-bold">{label}</span>
    <b className="fw-bold">{value}</b>
  </div>
);

const AccountMini = ({ title, subtitle, active }: any) => (
  <div className={`account-mini ${active ? "active" : ""}`}>
    <div>
      <div className="fw-bold">{title}</div>
      <div className="fs-8 text-muted">{subtitle}</div>
    </div>
  </div>
);

export default DonorSidebarCard;