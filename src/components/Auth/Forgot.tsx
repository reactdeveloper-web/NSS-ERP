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
  const [error, setError] = useState('');
  const { forgot, isforgot } = props;

  const onFinish = async formData => {
    try {
      await forgot(formData);
    } catch (error: any) {
      setError(error.payload.message);
    }
  };
  if (isforgot) {
    return <Redirect to={PATH.HOME} />;
  }

  return (
    <div className="login-logo d-flex vh-100">
      <div className="bottom-bg d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
        <div className="d-flex flex-start text-center flex-column flex-column-fluid p-5 px-2 p-md-5">
          <div className="container">
            {/* Logo */}
            <img alt="Logo" src={IMAGEPATH.LOGO} className="h-60px" />

            <div className="w-md-500px h-md-500px w-xxl-600px h-xxl-600px w-100 bg-body custom-rounded mx-auto d-flex flex-center p-4">
              <Form
                name="forgot-form"
                className="form w-md-375px w-xxl-425px w-100"
                onFinish={onFinish}
              >
                {/* Heading */}
                <div className="text-center mb-8">
                  <img src={IMAGEPATH.LOGIN_NSS} alt="" />
                  <h1 className="nssTextColor mb-3 fw-normal">
                    Forgot Password
                  </h1>
                  <div className="text-gray-400 fw-semibold fs-6">
                    Enter your User ID to reset password
                  </div>
                </div>

                {/* User ID Field */}
                <div className="fv-row mb-8 d-flex flex-center position-relative">
                  <Form.Item
                    name="userid"
                    className="w-100"
                    rules={[
                      { required: true, message: 'Please enter your User ID!' },
                    ]}
                  >
                    <Input
                      className="form-control fs-5 fw-normal ps-10"
                      placeholder="Enter your User ID"
                    />
                  </Form.Item>

                  <img
                    src={IMAGEPATH.USERICON}
                    alt=""
                    className="position-absolute start-0 ms-2 top-0 mt-4"
                  />
                </div>

                {/* Buttons */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-lg nssBtnColor text-white w-100 mb-5"
                  >
                    <span className="indicator-label fs-3 fw-normal">
                      SUBMIT
                    </span>
                  </button>

                  <div className="login-form-register-link-wrapper">
                    <Link
                      to={PATH.LOGIN}
                      className="login-form-register-link nssTextColor fs-4 fw-normal text-decoration-underline"
                    >
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
  );
};
const Forgot = connector(_Forgot);
export { Forgot };
