import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { logout } from 'src/components/Auth/Auth.thunks';
import { PATH } from 'src/constants/paths';
import { MetronicDropdown } from 'src/components/Common/MetronicDropdown';
import { HeaderSearch } from 'src/components/Header/HeaderSearch';

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user as IUser,
});

const mapDispatchToProps = {
  logout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {}

const _HeaderMenu = (props: Props) => {
  const { user, logout } = props;
  const history = useHistory();
  const displayName = user.empName || user.username || 'User';
  const departmentName = user.deptName || 'Department';
  const employeeNumber = user.empNum ? Math.trunc(user.empNum) : '';

  const onLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logout();
    history.push(PATH.LOGIN);
  };

  return (
    <div id="kt_header" className="header align-items-stretch">
      {/* <!--begin::Container--> */}
      <div className="container-fluid d-flex align-items-stretch justify-content-between">
        {/* <!--begin::Aside mobile toggle--> */}
        <div
          className="d-flex align-items-center d-lg-none ms-n3 me-1"
          title="Show aside menu"
        >
          <div
            className="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
            id="kt_aside_mobile_toggle"
          >
            {/* <!--begin::Svg Icon | path: icons/duotune/abstract/abs015.svg--> */}
            <span className="svg-icon svg-icon-2x mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                  fill="black"
                />
                <path
                  opacity="0.3"
                  d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                  fill="black"
                />
              </svg>
            </span>
            {/* <!--end::Svg Icon--> */}
          </div>
        </div>
        {/* <!--end::Aside mobile toggle--> */}
        {/* <!--begin::Mobile logo--> */}
        <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
          <a href="../../demo1/dist/index.html" className="d-lg-none">
            <img
              alt="Logo"
              src="assets/media/logos/logo-2.svg"
              className="h-30px"
            />
          </a>
        </div>
        {/* <!--end::Mobile logo--> */}

        {/* <!--begin::Wrapper--> */}
        <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
          {/* <!--begin::Navbar--> */}
          <div className="d-flex align-items-stretch" id="kt_header_nav">
            {/* <!--begin::Menu wrapper--> */}
            <div
              className="header-menu align-items-stretch"
              data-kt-drawer="true"
              data-kt-drawer-name="header-menu"
              data-kt-drawer-activate="{default: true, lg: false}"
              data-kt-drawer-overlay="true"
              data-kt-drawer-width="{default:'200px', '300px': '250px'}"
              data-kt-drawer-direction="end"
              data-kt-drawer-toggle="#kt_header_menu_mobile_toggle"
              data-kt-swapper="true"
              data-kt-swapper-mode="prepend"
              data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}"
            >
              {/* <!--begin::Menu--> */}
              <div
                className="menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch"
                id="#kt_header_menu"
                data-kt-menu="true"
              >
                <div className="menu-item me-lg-1">
                  <a
                    className="menu-link active py-3"
                    href="../../demo1/dist/index.html"
                  >
                    <span className="menu-title">Dashboard</span>
                  </a>
                </div>
                <div
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-start"
                  className="menu-item menu-lg-down-accordion me-lg-1"
                >
                  <span className="menu-link py-3">
                    <span className="menu-title">Crafted</span>
                    <span className="menu-arrow d-lg-none"></span>
                  </span>
                  <div className="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px">
                    <div
                      data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                      data-kt-menu-placement="right-start"
                      className="menu-item menu-lg-down-accordion"
                    >
                      <span className="menu-link py-3">
                        <span className="menu-icon">
                          {/* <!--begin::Svg Icon | path: icons/duotune/ecommerce/ecm007.svg--> */}
                          <span className="svg-icon svg-icon-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 9V11C21 11.6 20.6 12 20 12H14V8H20C20.6 8 21 8.4 21 9ZM10 8H4C3.4 8 3 8.4 3 9V11C3 11.6 3.4 12 4 12H10V8Z"
                                fill="black"
                              />
                              <path
                                d="M15 2C13.3 2 12 3.3 12 5V8H15C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2Z"
                                fill="black"
                              />
                              <path
                                opacity="0.3"
                                d="M9 2C10.7 2 12 3.3 12 5V8H9C7.3 8 6 6.7 6 5C6 3.3 7.3 2 9 2ZM4 12V21C4 21.6 4.4 22 5 22H10V12H4ZM20 12V21C20 21.6 19.6 22 19 22H14V12H20Z"
                                fill="black"
                              />
                            </svg>
                          </span>
                          {/* <!--end::Svg Icon--> */}
                        </span>
                        <span className="menu-title">Pages</span>
                        <span className="menu-arrow"></span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-start"
                  className="menu-item menu-lg-down-accordion me-lg-1"
                >
                  <span className="menu-link py-3">
                    <span className="menu-title">Apps</span>
                    <span className="menu-arrow d-lg-none"></span>
                  </span>
                  <div className="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px">
                    <div
                      data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                      data-kt-menu-placement="right-start"
                      className="menu-item menu-lg-down-accordion"
                    >
                      <span className="menu-link py-3">
                        <span className="menu-icon">
                          {/* <!--begin::Svg Icon | path: icons/duotune/ecommerce/ecm007.svg--> */}
                          <span className="svg-icon svg-icon-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 9V11C21 11.6 20.6 12 20 12H14V8H20C20.6 8 21 8.4 21 9ZM10 8H4C3.4 8 3 8.4 3 9V11C3 11.6 3.4 12 4 12H10V8Z"
                                fill="black"
                              />
                              <path
                                d="M15 2C13.3 2 12 3.3 12 5V8H15C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2Z"
                                fill="black"
                              />
                              <path
                                opacity="0.3"
                                d="M9 2C10.7 2 12 3.3 12 5V8H9C7.3 8 6 6.7 6 5C6 3.3 7.3 2 9 2ZM4 12V21C4 21.6 4.4 22 5 22H10V12H4ZM20 12V21C20 21.6 19.6 22 19 22H14V12H20Z"
                                fill="black"
                              />
                            </svg>
                          </span>
                          {/* <!--end::Svg Icon--> */}
                        </span>
                        <span className="menu-title">Pages</span>
                        <span className="menu-arrow"></span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-start"
                  className="menu-item menu-lg-down-accordion me-lg-1"
                >
                  <span className="menu-link py-3">
                    <span className="menu-title">Layouts</span>
                    <span className="menu-arrow d-lg-none"></span>
                  </span>
                  <div className="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px">
                    <div
                      data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                      data-kt-menu-placement="right-start"
                      className="menu-item menu-lg-down-accordion"
                    >
                      <span className="menu-link py-3">
                        <span className="menu-icon">
                          {/* <!--begin::Svg Icon | path: icons/duotune/ecommerce/ecm007.svg--> */}
                          <span className="svg-icon svg-icon-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 9V11C21 11.6 20.6 12 20 12H14V8H20C20.6 8 21 8.4 21 9ZM10 8H4C3.4 8 3 8.4 3 9V11C3 11.6 3.4 12 4 12H10V8Z"
                                fill="black"
                              />
                              <path
                                d="M15 2C13.3 2 12 3.3 12 5V8H15C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2Z"
                                fill="black"
                              />
                              <path
                                opacity="0.3"
                                d="M9 2C10.7 2 12 3.3 12 5V8H9C7.3 8 6 6.7 6 5C6 3.3 7.3 2 9 2ZM4 12V21C4 21.6 4.4 22 5 22H10V12H4ZM20 12V21C20 21.6 19.6 22 19 22H14V12H20Z"
                                fill="black"
                              />
                            </svg>
                          </span>
                          {/* <!--end::Svg Icon--> */}
                        </span>
                        <span className="menu-title">Pages</span>
                        <span className="menu-arrow"></span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-start"
                  className="menu-item menu-lg-down-accordion me-lg-1"
                >
                  <span className="menu-link py-3">
                    <span className="menu-title">Resources</span>
                    <span className="menu-arrow d-lg-none"></span>
                  </span>
                  <div className="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px">
                    <div
                      data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                      data-kt-menu-placement="right-start"
                      className="menu-item menu-lg-down-accordion"
                    >
                      <span className="menu-link py-3">
                        <span className="menu-icon">
                          {/* <!--begin::Svg Icon | path: icons/duotune/ecommerce/ecm007.svg--> */}
                          <span className="svg-icon svg-icon-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 9V11C21 11.6 20.6 12 20 12H14V8H20C20.6 8 21 8.4 21 9ZM10 8H4C3.4 8 3 8.4 3 9V11C3 11.6 3.4 12 4 12H10V8Z"
                                fill="black"
                              />
                              <path
                                d="M15 2C13.3 2 12 3.3 12 5V8H15C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2Z"
                                fill="black"
                              />
                              <path
                                opacity="0.3"
                                d="M9 2C10.7 2 12 3.3 12 5V8H9C7.3 8 6 6.7 6 5C6 3.3 7.3 2 9 2ZM4 12V21C4 21.6 4.4 22 5 22H10V12H4ZM20 12V21C20 21.6 19.6 22 19 22H14V12H20Z"
                                fill="black"
                              />
                            </svg>
                          </span>
                          {/* <!--end::Svg Icon--> */}
                        </span>
                        <span className="menu-title">Pages</span>
                        <span className="menu-arrow"></span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-start"
                  className="menu-item menu-lg-down-accordion me-lg-1"
                >
                  <span className="menu-link py-3">
                    <span className="menu-title">Mega Menu</span>
                    <span className="menu-arrow d-lg-none"></span>
                  </span>
                  <div className="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px">
                    <div
                      data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                      data-kt-menu-placement="right-start"
                      className="menu-item menu-lg-down-accordion"
                    >
                      <span className="menu-link py-3">
                        <span className="menu-icon">
                          {/* <!--begin::Svg Icon | path: icons/duotune/ecommerce/ecm007.svg--> */}
                          <span className="svg-icon svg-icon-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 9V11C21 11.6 20.6 12 20 12H14V8H20C20.6 8 21 8.4 21 9ZM10 8H4C3.4 8 3 8.4 3 9V11C3 11.6 3.4 12 4 12H10V8Z"
                                fill="black"
                              />
                              <path
                                d="M15 2C13.3 2 12 3.3 12 5V8H15C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2Z"
                                fill="black"
                              />
                              <path
                                opacity="0.3"
                                d="M9 2C10.7 2 12 3.3 12 5V8H9C7.3 8 6 6.7 6 5C6 3.3 7.3 2 9 2ZM4 12V21C4 21.6 4.4 22 5 22H10V12H4ZM20 12V21C20 21.6 19.6 22 19 22H14V12H20Z"
                                fill="black"
                              />
                            </svg>
                          </span>
                          {/* <!--end::Svg Icon--> */}
                        </span>
                        <span className="menu-title">Pages</span>
                        <span className="menu-arrow"></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!--end::Menu--> */}
            </div>
            {/* <!--end::Menu wrapper--> */}
          </div>
          {/* <!--end::Navbar--> */}

          {/* <!--begin::Topbar--> */}
          <div className="d-flex align-items-stretch flex-shrink-0">
            {/* <!--begin::Toolbar wrapper--> */}
            <div className="d-flex align-items-stretch flex-shrink-0">
              {/* <!--begin::Search--></div> */}
              <div className="d-flex align-items-stretch ms-1 ms-lg-3">
                {/* <!--begin::Search--> */}
                <div
                  id="kt_header_search"
                  className="d-flex align-items-stretch"
                  data-kt-search-keypress="true"
                  data-kt-search-min-length="2"
                  data-kt-search-enter="enter"
                  data-kt-search-layout="menu"
                  data-kt-menu-trigger="auto"
                  data-kt-menu-overflow="false"
                  data-kt-menu-permanent="true"
                  data-kt-menu-placement="bottom-end"
                >
                  {/* <!--begin::Search toggle--> */}
                  <div
                    className="d-flex align-items-center"
                    data-kt-search-element="toggle"
                    id="kt_header_search_toggle"
                  >
                    <div className="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px">
                      {/* <!--begin::Svg Icon | path: icons/duotune/general/gen021.svg--> */}
                      <span className="svg-icon svg-icon-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            opacity="0.5"
                            x="17.0365"
                            y="15.1223"
                            width="8.15546"
                            height="2"
                            rx="1"
                            transform="rotate(45 17.0365 15.1223)"
                            fill="black"
                          />
                          <path
                            d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                            fill="black"
                          />
                        </svg>
                      </span>
                      {/* <!--end::Svg Icon--> */}
                    </div>
                  </div>
                  {/* <!--end::Search toggle--> */}
                </div>
                {/* <!--end::Search--> */}
              </div>
              {/* <!--end::Search--> */}

       

              {/* <!--begin::Notifications--> */}
              <div className="d-flex align-items-center ms-1 ms-lg-3">
                {/* <!--begin::Menu- wrapper--> */}
                <div
                  className="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
                  data-kt-menu-trigger="click"
                  data-kt-menu-attach="parent"
                  data-kt-menu-placement="bottom-end"
                >
                  {/* <!--begin::Svg Icon | path: icons/duotune/general/gen022.svg--> */}
                <span className="svg-icon svg-icon-1 position-relative">
  <i className="fas fa-bell fs-2"></i>

  {/* notification badge */}
  <span className="bell-count">5</span>
</span>
                  {/* <!--end::Svg Icon--> */}
                </div>
              </div>

              <div
  className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
  data-kt-menu="true"
>
  <div className="d-flex flex-column bgi-no-repeat rounded-top">
    <h3 className="text-dark fw-bold px-9 mt-10 mb-6">
      Notifications
    </h3>
  </div>

  <div className="scroll-y mh-325px my-5 px-8">
    <div className="d-flex flex-stack py-4">
      <div className="d-flex align-items-center">
        <div className="symbol symbol-35px me-4 bg-light-primary">
          <i className="ki-duotone ki-message-text-2 fs-2 text-primary"></i>
        </div>
        <div>
          <div className="fw-bold">New Donor Registered</div>
          <div className="text-muted fs-7">5 mins ago</div>
        </div>
      </div>
    </div>

    <div className="d-flex flex-stack py-4">
      <div className="d-flex align-items-center">
        <div className="symbol symbol-35px me-4 bg-light-success">
          <i className="ki-duotone ki-check fs-2 text-success"></i>
        </div>
        <div>
          <div className="fw-bold">Receipt Generated</div>
          <div className="text-muted fs-7">20 mins ago</div>
        </div>
      </div>
    </div>
  </div>

  <div className="py-3 text-center border-top">
    <a href="#" className="btn btn-sm btn-light-primary">
      View All
    </a>
  </div>
</div>
              {/* <!--end::Notifications--> */}
             

              {/* <!--begin::User--> */}
              <div
                className="d-flex align-items-center ms-1 ms-lg-3"
                id="kt_header_user_menu_toggle"
              >
                <MetronicDropdown
                  wrapperClassName="position-relative"
                  openOnHover={true}
                  trigger={
                    <div className="cursor-pointer symbol symbol-30px symbol-md-40px">
                      <img src="assets/media/avatars/150-26.jpg" alt="user" />
                    </div>
                  }
                  menuClassName="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px show-dropdown-menu"
                >
                  <div className="menu-item px-3">
                    <div className="menu-content d-flex align-items-center px-3">
                      <div className="symbol symbol-50px me-5">
                        <img alt="Logo" src="assets/media/avatars/150-26.jpg" />
                      </div>
                      <div className="d-flex flex-column">
                        <div className="fw-bolder d-flex align-items-center fs-5">
                          {displayName}
                          <span className="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">
                            {employeeNumber}
                          </span>
                        </div>
                        <span className="fw-bold text-muted fs-7">
                          {departmentName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="separator my-2"></div>
                  <div className="menu-item px-5">
                    <NavLink to={PATH.PROFILE} className="menu-link px-5">
                      My Profile
                    </NavLink>
                  </div>
                  <div className="menu-item px-5">
                    <a
                      href={PATH.LOGIN}
                      className="menu-link px-5"
                      onClick={onLogout}
                    >
                      Sign Out
                    </a>
                  </div>
                  <div className="separator my-2"></div>
                  <div className="menu-item px-5">
                    <div className="menu-content px-5">
                      <label
                        className="form-check form-switch form-check-custom form-check-solid pulse pulse-success"
                        htmlFor="kt_user_menu_dark_mode_toggle"
                      >
                        <input
                          className="form-check-input w-30px h-20px"
                          type="checkbox"
                          value="1"
                          name="mode"
                          id="kt_user_menu_dark_mode_toggle"
                          data-kt-url="#"
                        />
                        <span className="pulse-ring ms-n1"></span>
                        <span className="form-check-label text-gray-600 fs-7">
                          Dark Mode
                        </span>
                      </label>
                    </div>
                  </div>
                </MetronicDropdown>
              </div>
              {/* <!--end::User --> */}
            </div>
            {/* <!--end::Toolbar wrapper--> */}
          </div>
          {/* <!--end::Topbar--> */}
        </div>
        {/* <!--end::Wrapper--> */}
      </div>
      {/* <!--end::Container--> */}
    </div>
  );
};

const HeaderMenu = connector(_HeaderMenu);

export { HeaderMenu };
