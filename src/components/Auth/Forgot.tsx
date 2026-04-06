import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { forgot } from './Auth.thunks';
import { PATH } from 'src/constants/paths';
import { NavLink } from 'react-router-dom';
import { IMAGEPATH } from 'src/constants/img-paths';

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isforgot: state.auth.isforgot,
});
const mapDispatchToProps = {
  forgot,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {}
const hrefa: React.CSSProperties = {
  margin: '0 auto',
};

const _Forgot = (props: Props) => {
  // eslint-disable-next-line
  const [error, setError] = useState('');
  const { forgot, isAuthenticated, isforgot } = props;

  const onFinish = async formData => {
    try {
      await forgot(formData);
    } catch (error) {
      setError(error.payload.message);
    }
  };
  const onFinishFailed = errorInfo => {
    // eslint-disable-next-line
    console.log('Failed:', errorInfo);
  };
  console.log('isAuthenticated', isAuthenticated);
  if (isforgot) {
    return <Redirect to={PATH.HOME} />;
  }
  return (
    <div className="d-flex flex-start text-center flex-column flex-column-fluid p-5 px-2 p-md-5">
      <div className=" ant-layout-content fdd">
        <div className="container">
          {/* <!--begin::Logo--> */}
          <a href="#" style={hrefa}>
            <img alt="Logo" src={IMAGEPATH.LOGO} className="h-60px" />
          </a>
          {/* <!--end::Logo--> */}

          {/* <!--begin::Wrapper--> */}
          <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
            <Form
              name="forgot-form"
              className="forgot-form form w-100"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              {/* <!--begin::Heading--> */}
              <div className="text-center mb-8">
                {/* <!--begin::Title--> */}
                <h1 className="text-dark mb-3">Forgot Password ?</h1>
                {/* <!--end::Title--> */}
                {/* <!--begin::Link--> */}
                <div className="text-gray-400 fw-bold fs-4">
                  Enter your User ID to reset your password.
                </div>
                {/* <!--end::Link--> */}
              </div>

              <div className="fv-row mb-10">
                <label className="form-label fw-bolder text-gray-900 fs-6">
                  User ID
                </label>
                <Form.Item
                  name="userid"
                  className="form-control fs-5 fw-normal ps-10"
                  rules={[
                    { required: true, message: 'Please input your userid!' },
                  ]}
                >
                  <input
                    className="form-control fs-5 fw-normal ps-10"
                    type="text"
                    name=""
                    placeholder="Enter your ID"
                  />
                </Form.Item>
              </div>

              <div className="d-flex flex-wrap justify-content-center pb-lg-0">
                <button
                  type="submit"
                  id="kt_sign_in_submit"
                  className="btn btn-lg btn-primary fw-bolder me-4"
                >
                  <span className="indicator-label">Submit</span>
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
                <a
                  href="sign-in.html"
                  className="btn btn-lg btn-light-primary fw-bolder"
                >
                  {' '}
                  <NavLink className="navbar-item" to="/login">
                    Cancel
                  </NavLink>
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
const Forgot = connector(_Forgot);
export { Forgot };
