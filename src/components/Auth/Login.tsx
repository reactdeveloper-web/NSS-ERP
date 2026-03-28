import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from './Auth.thunks';
import { PATH } from 'src/constants/paths';

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
const mapDispatchToProps = {
  login,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {}

const _Login = (props: Props) => {
  //  eslint-disable-next-line
  const [error, setError] = useState('');
  const { login, isAuthenticated } = props;

  const onFinish = async formData => {
    try {
      //console.log('hello',formData);
      await login(formData);
    } catch (error) {
      message.error(error.message);
      setError(error.payload.message);
    }
  };

  if (isAuthenticated) {
    return <Redirect to={PATH.HOME} />;
  }
  const hrefa: React.CSSProperties = {
  margin: "0 auto"
};
  
  return (
    <div className="d-flex flex-start text-center flex-column flex-column-fluid p-5 px-2 p-md-5">
      <div className=" ant-layout-content fdd">
        <div className="container">
          {/* <!--begin::Logo--> */}
          <a href="#" style={hrefa}>
            <img alt="Logo" src="assets/images/NarayanSevaSansthan-logo.jpg" className="h-60px" />
          </a>
          {/* <!--end::Logo--> */}

          {/* <!--begin::Wrapper--> */}
          <div className="w-md-500px h-md-500px w-xxl-600px h-xxl-600px w-100 bg-body custom-rounded mx-auto d-flex flex-center p-4">
          
            {/* <h1 className="login-form-title">
              <img
                alt=" logo "
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg"
              />
              LOGIN
            </h1> */}
            <Form
              name="login_form"
              className="login-form form w-md-375px w-xxl-425px w-100"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              
              {/* <!--begin::Heading--> */}
              <div className="text-center mb-8">
                {/* <!--begin::Title--> */}
                <img src="assets/images/login-nss.png" alt="" />
                <h1 className="nssTextColor mb-3 fw-normal">Login with NSS</h1>
                {/* <!--end::Title--> */}
              </div>
              {/* <!--begin::Heading--> */}
              <div className="loginTabs mb-5">
                <ul className="nav nssBtnColor rounded-pill p-1 p-md-2 align-content-between">
                  <li className="nav-item">
                    <a className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-2 px-md-3 active rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                      data-bs-toggle="tab" href="#kt_table_widget_5_tab_1">NSS</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-2 px-md-3 rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                      data-bs-toggle="tab" href="#kt_table_widget_5_tab_2">SPD</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-2 px-md-3  rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                      data-bs-toggle="tab" href="#kt_table_widget_5_tab_3">FOREIGN NSS</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-2 px-md-3 rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                      data-bs-toggle="tab" href="#kt_table_widget_5_tab_4">FOREIGN SPD</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn btn-sm btn-color-white btn-active btn-active-success fw-normal px-2 px-md-3 rounded-pill  fs-6 fs-md-7 fs-xxl-5"
                      data-bs-toggle="tab" href="#kt_table_widget_5_tab_5">HOSPITAL</a>
                  </li>
                </ul>
              </div>
              {/* <!--end::Heading--> */}
              <div className="fv-row mb-5 d-flex flex-center position-relative">
               <img src="assets/images/login-user-icon.png" alt=""
								className="position-absolute start-0 ms-2" />
              <Form.Item
                name="username" className='form-control fs-5 fw-normal ps-10'
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                {/* <Input
                  // prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                /> */}

                <input className="form-control fs-5 fw-normal ps-10" type="text" name=""
								placeholder="Enter your ID" />


              </Form.Item>
              </div>

              <div className="fv-row mb-5 d-flex flex-center position-relative">
                <img src="assets/images/login-passowd-icon.png" alt=""
                  className="position-absolute start-0 ms-2" />
              <Form.Item className='form-control fs-5 fw-normal ps-10'
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                {/* <Input
                  // prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                /> */}

                <input className="form-control fs-5 fw-normal ps-10" type="password" name="password"
								placeholder="Enter your Password" />

              </Form.Item>
              <img src="assets/images/login-paswword-eye.png" alt=""
                  className="position-absolute end-0 me-2" />
              </div>

           

              {/* <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                {/* <Link className="login-form-forgot" to="/forgotpassword">
                  Forgot password
                </Link> */}
              {/* </Form.Item> */} 
               <div className="text-center">
             
               <button
                 
                  type="submit"
                  id="kt_sign_in_submit"
                  className="btn btn-lg nssBtnColor text-white w-100 mb-5"
                >
                 <span className="indicator-label fs-3 fw-normal">LOGIN</span>
                 	<span className="indicator-progress">Please wait...
									<span className="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                </button>
                {/* <div className="login-form-register-link-wrapper">
                  Or{' '}
                  <Link to={PATH.REGISTER} className="login-form-register-link">
                    Register now!
                  </Link>
                </div> */}
              
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
const Login = connector(_Login);
export { Login };
