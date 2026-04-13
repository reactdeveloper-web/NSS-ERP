import React from 'react';

function ReceiveIdCreationNav() {
  return (
    <div className="toolbar" id="kt_toolbar">
      <div
        id="kt_toolbar_container"
        className="container-fluid d-flex flex-stack"
      >
        <div
          data-kt-swapper="true"
          data-kt-swapper-mode="prepend"
          data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
          className="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0"
        >
          <h1 className="d-flex align-items-center text-dark fw-bolder fs-3 my-1">
            National Gangotri
            <span className="h-20px border-gray-200 border-start ms-3 mx-2"></span>
            <small className="text-muted fs-7 fw-bold my-1 ms-1">
              Dashboard Received ID Master
            </small>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default ReceiveIdCreationNav;
