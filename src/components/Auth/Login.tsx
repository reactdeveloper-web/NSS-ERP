import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from './Auth.thunks';
import { PATH } from 'src/constants/paths';
import { IMAGEPATH } from 'src/constants/img-paths';


const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
const mapDispatchToProps = {
  login,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {}

const _Login = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  //  eslint-disable-next-line
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('NSS');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = props;

  const onFinish = async formData => {
    try {
      //console.log('hello',formData);
      //setLoading(true);
      await login(formData);
    } catch (error) {
      message.error(error.message);
      setError(error.payload.message);
    } finally {
      // setLoading(false); // ✅ stop loader
    }
  };

  if (isAuthenticated) {
    return <Redirect to={PATH.DASHBOARD} />;
  }
  const hrefa: React.CSSProperties = {
    margin: '0 auto',
  };

  return (
    <div className="login-logo d-flex vh-100">
      <div className="bottom-bg d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
        <div className="d-flex flex-start text-center flex-column flex-column-fluid p-5 px-2 p-md-5">
          <div className=" ">
            <div className="container">
              <img alt="Logo" src={IMAGEPATH.LOGO} className="h-60px" />
              <div className="w-md-500px h-md-500px w-xxl-600px h-xxl-600px w-100 bg-body custom-rounded mx-auto d-flex flex-center p-4">
                <Form
                  name="login_form"
                  className="login-form form w-md-375px w-xxl-425px w-100"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <div className="text-center mb-8">
                    <img src={IMAGEPATH.LOGIN_NSS} alt="" />
                    <h1 className="nssTextColor mb-3 fw-normal">
                      Login with {activeTab}
                    </h1>
                  </div>
                  {/* <!--begin::Heading--> */}
                  <div className="loginTabs mb-5">
                    <ul className="nav nssBtnColor rounded-pill p-1 p-md-2 justify-content-between">
                      <li className="nav-item">
                        <a
                          className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-4 px-md-10 active rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                          data-bs-toggle="tab"
                          href="#kt_table_widget_5_tab_1"
                          onClick={() => setActiveTab('NSS')}
                        >
                          NSS
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-4 px-md-10  rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                          data-bs-toggle="tab"
                          href="#kt_table_widget_5_tab_3"
                          onClick={() => setActiveTab('FOREIGN NSS')}
                        >
                          FOREIGN NSS
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-4 px-md-10 rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                          data-bs-toggle="tab"
                          href="#kt_table_widget_5_tab_5"
                          onClick={() => setActiveTab('HOSPITAL')}
                        >
                          HOSPITAL
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="fv-row mb-8 d-flex flex-center position-relative">
                    <Form.Item
                      name="username"
                      className="w-100"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your username!',
                        },
                      ]}
                    >
                      <Input
                        className="form-control fs-5 fw-normal ps-10"
                        type="text"
                        name=""
                        placeholder="Enter your ID"
                      />
                    </Form.Item>
                    <img
                      src={IMAGEPATH.USERICON}
                      alt=""
                      className="position-absolute  start-0 ms-2 top-0 mt-4"
                    />
                  </div>

                 <div className="fv-row mb-8 d-flex flex-center position-relative">
  <Form.Item
    className="w-100"
    name="password"
    rules={[
      {
        required: true,
        message: 'Please input your Password!',
      },
    ]}
  >
    <Input
      className="form-control fs-5 fw-normal ps-10 pe-10"
      type={showPassword ? "text" : "password"}   // ⭐ toggle here
      placeholder="Enter your Password"
    />
  </Form.Item>

  {/* RIGHT EYE ICON (CLICKABLE) */}
  <img
    src={showPassword ? IMAGEPATH.EYE_OPEN : IMAGEPATH.EYE_CLOSE}
    alt="toggle password"
    onClick={() => setShowPassword(!showPassword)}   // ⭐ toggle click
    style={{ cursor: "pointer" }}
    className="position-absolute end-0 me-2 top-0 mt-4"
  />

  {/* LEFT LOCK ICON */}
  <img
    src={IMAGEPATH.PASSWORD}
    alt=""
    className="position-absolute start-0 ms-2 top-0 mt-4"
  />
</div>
                  <div className="text-center">
                    <button
                      type="submit"
                      id="kt_sign_in_submit"
                      className={`btn btn-lg nssBtnColor text-white w-100 mb-5 ${
                        loading ? 'disabled' : ''
                      }`}
                      disabled={loading}
                    >
                      {!loading ? (
                        <span className="indicator-label fs-3 fw-normal">
                          LOGIN
                        </span>
                      ) : (
                        <span className="indicator-progress2">
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                    <div className="login-form-register-link-wrapper">
                      <Link
                        to={PATH.FORGOT}
                        className="login-form-register-link"
                      >
                        Forgot Password?
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
const Login = connector(_Login);
export { Login };
