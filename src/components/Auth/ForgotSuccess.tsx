import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGEPATH } from 'src/constants/img-paths';

const ForgotSuccess = () => {
  return (
    <div className="login-logo d-flex vh-100">
      <div className="d-flex flex-column flex-column-fluid p-5 text-center">
        <img src={IMAGEPATH.LOGO} className="h-60px mx-auto mb-5" />

        <div
          className="bg-body custom-rounded p-5 mx-auto"
          style={{ maxWidth: 450 }}
        >
          <h1 className="nssTextColor mb-3">Check Your Email 📩</h1>

          <p className="fs-5">
            We have sent a password reset link to your registered email address.
          </p>

          <p className="text-muted">
            Please check your inbox and click the link to reset your password.
          </p>

          <Link to="/login" className="btn nssBtnColor text-white mt-4">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotSuccess;
