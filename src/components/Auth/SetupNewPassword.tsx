import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setupNewPassword } from './Auth.thunks';
import { IMAGEPATH } from 'src/constants/img-paths';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  // 🔗 Read token from mail link
  const query = new URLSearchParams(useLocation().search);

  const token = query.get("token") || query.get("Token");
  const empNum = query.get("id") || query.get("emp") || query.get("EmpNum");
  const dataFlag = query.get("df") || query.get("Data_Flag") || "GANGOTRI";

  // ================= SUBMIT =================
  const onFinish = async (values: any) => {
    if (!empNum || !token) {
      message.error('Invalid or expired reset link ❌');
      return;
    }

    const payload = {
      EmpNum: empNum,
      Token: token,
      NewPassword: values.newPassword,
      Data_Flag: dataFlag,
    };

    console.log('FINAL API PAYLOAD 🚀', payload);

    setLoading(true);
    const success = await dispatch(setupNewPassword(payload));
    setLoading(false);

    // 🟢 SUCCESS FLOW
    if (success) {
      setIsSuccess(true); // disable form

      setTimeout(() => {
        history.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="login-logo d-flex vh-100">
      <div className="bottom-bg d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
        <div className="d-flex flex-start text-center flex-column flex-column-fluid p-5 px-2 p-md-5">
          <div className="container">

            {/* LOGO */}
            <img alt="Logo" src={IMAGEPATH.LOGO} className="h-60px" />

            {/* CARD */}
            <div className="w-md-500px h-md-500px w-xxl-600px h-xxl-600px w-100 bg-body custom-rounded mx-auto d-flex flex-center p-4">

              <Form
                className="login-form form w-md-375px w-xxl-425px w-100"
                onFinish={onFinish}
              >

                {/* HEADING */}
                <div className="text-center mb-8">
                  <img src={IMAGEPATH.LOGIN_NSS} alt="" />
                  <h1 className="nssTextColor mb-3 fw-normal">
                    Setup New Password
                  </h1>
                </div>

                {/* NEW PASSWORD */}
                <div className="fv-row mb-8 d-flex flex-center position-relative">
                  <Form.Item
                    name="newPassword"
                    className="w-100"
                    rules={[
                      { required: true, message: "Enter new password" },
                      { min: 6, message: "Minimum 6 characters required" },
                    ]}
                  >
                    <Input
                      className="form-control fs-5 fw-normal ps-10 pe-10"
                      type={showNew ? "text" : "password"}
                      placeholder="Enter your New Password"
                      disabled={isSuccess}
                    />
                  </Form.Item>

                  <img
                    src={showNew ? IMAGEPATH.EYE_OPEN : IMAGEPATH.EYE_CLOSE}
                    onClick={() => setShowNew(!showNew)}
                    className="position-absolute end-0 me-2 top-0 mt-4"
                    style={{ cursor: "pointer" }}
                  />

                  <img
                    src={IMAGEPATH.PASSWORD}
                    className="position-absolute start-0 ms-2 top-0 mt-4"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="fv-row mb-8 d-flex flex-center position-relative">
                  <Form.Item
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    className="w-100"
                    rules={[
                      { required: true, message: "Confirm your password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value)
                            return Promise.resolve();
                          return Promise.reject("Passwords do not match ❌");
                        },
                      }),
                    ]}
                  >
                    <Input
                      className="form-control fs-5 fw-normal ps-10 pe-10"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      disabled={isSuccess}
                    />
                  </Form.Item>

                  <img
                    src={showConfirm ? IMAGEPATH.EYE_OPEN : IMAGEPATH.EYE_CLOSE}
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="position-absolute end-0 me-2 top-0 mt-4"
                    style={{ cursor: "pointer" }}
                  />

                  <img
                    src={IMAGEPATH.PASSWORD}
                    className="position-absolute start-0 ms-2 top-0 mt-4"
                  />
                </div>

                {/* BUTTON */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-lg nssBtnColor text-white w-100 mb-5"
                    disabled={loading || isSuccess}
                  >
                    {!loading ? (
                      <span className="indicator-label fs-3 fw-normal">
                        SUBMIT
                      </span>
                    ) : (
                      <span className="indicator-progress2">
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>

                  <div className="login-form-register-link-wrapper">
                    <Link to="/login" className="login-form-register-link">
                      Back to Login
                    </Link>
                  </div>

                  {/* NEW PASSWORD */}
                  <div className="fv-row mb-8 d-flex flex-center position-relative">
                    <Form.Item
                      name="newPassword"
                      className="w-100"
                      rules={[
                        { required: true, message: 'Enter new password' },
                        { min: 6, message: 'Minimum 6 characters required' },
                      ]}
                    >
                      <Input
                        className="form-control fs-5 fw-normal ps-10 pe-10"
                        type={showNew ? 'text' : 'password'}
                        placeholder="Enter your New Password"
                      />
                    </Form.Item>

                    <img
                      alt={showNew ? 'Hide password' : 'Show password'}
                      src={showNew ? IMAGEPATH.EYE_OPEN : IMAGEPATH.EYE_CLOSE}
                      onClick={() => setShowNew(!showNew)}
                      className="position-absolute end-0 me-2 top-0 mt-4"
                      style={{ cursor: 'pointer' }}
                    />

                    <img
                      alt=""
                      src={IMAGEPATH.PASSWORD}
                      className="position-absolute start-0 ms-2 top-0 mt-4"
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="fv-row mb-8 d-flex flex-center position-relative">
                    <Form.Item
                      name="confirmPassword"
                      dependencies={['newPassword']}
                      className="w-100"
                      rules={[
                        { required: true, message: 'Confirm your password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue('newPassword') === value
                            )
                              return Promise.resolve();
                            return Promise.reject('Passwords do not match ❌');
                          },
                        }),
                      ]}
                    >
                      <Input
                        className="form-control fs-5 fw-normal ps-10 pe-10"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm Password"
                      />
                    </Form.Item>

                    <img
                      alt={showConfirm ? 'Hide password' : 'Show password'}
                      src={
                        showConfirm ? IMAGEPATH.EYE_OPEN : IMAGEPATH.EYE_CLOSE
                      }
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="position-absolute end-0 me-2 top-0 mt-4"
                      style={{ cursor: 'pointer' }}
                    />

                    <img
                      alt=""
                      src={IMAGEPATH.PASSWORD}
                      className="position-absolute start-0 ms-2 top-0 mt-4"
                    />
                  </div>

                  {/* BUTTON */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-lg nssBtnColor text-white w-100 mb-5"
                      disabled={loading}
                    >
                      {!loading ? (
                        <span className="indicator-label fs-3 fw-normal">
                          SUBMIT
                        </span>
                      ) : (
                        <span className="indicator-progress2">
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>

                    <div className="login-form-register-link-wrapper">
                      <Link to="/login" className="login-form-register-link">
                        Back to Login
                      </Link>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
