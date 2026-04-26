import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { logout } from 'src/components/Auth/Auth.thunks';
import { PATH } from 'src/constants/paths';
import { MetronicDropdown } from 'src/components/Common/MetronicDropdown';

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

              {/* <!--begin::Activities--> */}
              <div className="d-flex align-items-center ms-1 ms-lg-3">
                {/* <!--begin::Drawer toggle--> */}
                <div
                  className="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
                  id="kt_activities_toggle"
                >
                  {/* <!--begin::Svg Icon | path: icons/duotune/general/gen032.svg--> */}
                  <span className="svg-icon svg-icon-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        x="8"
                        y="9"
                        width="3"
                        height="10"
                        rx="1.5"
                        fill="black"
                      />
                      <rect
                        opacity="0.5"
                        x="13"
                        y="5"
                        width="3"
                        height="14"
                        rx="1.5"
                        fill="black"
                      />
                      <rect
                        x="18"
                        y="11"
                        width="3"
                        height="8"
                        rx="1.5"
                        fill="black"
                      />
                      <rect
                        x="3"
                        y="13"
                        width="3"
                        height="6"
                        rx="1.5"
                        fill="black"
                      />
                    </svg>
                  </span>
                  {/* <!--end::Svg Icon--> */}
                </div>
                {/* <!--end::Drawer toggle--> */}
              </div>
              {/* <!--end::Activities--> */}

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
                  <span className="svg-icon svg-icon-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M11.2929 2.70711C11.6834 2.31658 12.3166 2.31658 12.7071 2.70711L15.2929 5.29289C15.6834 5.68342 15.6834 6.31658 15.2929 6.70711L12.7071 9.29289C12.3166 9.68342 11.6834 9.68342 11.2929 9.29289L8.70711 6.70711C8.31658 6.31658 8.31658 5.68342 8.70711 5.29289L11.2929 2.70711Z"
                        fill="black"
                      />
                      <path
                        d="M11.2929 14.7071C11.6834 14.3166 12.3166 14.3166 12.7071 14.7071L15.2929 17.2929C15.6834 17.6834 15.6834 18.3166 15.2929 18.7071L12.7071 21.2929C12.3166 21.6834 11.6834 21.6834 11.2929 21.2929L8.70711 18.7071C8.31658 18.3166 8.31658 17.6834 8.70711 17.2929L11.2929 14.7071Z"
                        fill="black"
                      />
                      <path
                        opacity="0.3"
                        d="M5.29289 8.70711C5.68342 8.31658 6.31658 8.31658 6.70711 8.70711L9.29289 11.2929C9.68342 11.6834 9.68342 12.3166 9.29289 12.7071L6.70711 15.2929C6.31658 15.6834 5.68342 15.6834 5.29289 15.2929L2.70711 12.7071C2.31658 12.3166 2.31658 11.6834 2.70711 11.2929L5.29289 8.70711Z"
                        fill="black"
                      />
                      <path
                        opacity="0.3"
                        d="M17.2929 8.70711C17.6834 8.31658 18.3166 8.31658 18.7071 8.70711L21.2929 11.2929C21.6834 11.6834 21.6834 12.3166 21.2929 12.7071L18.7071 15.2929C18.3166 15.6834 17.6834 15.6834 17.2929 15.2929L14.7071 12.7071C14.3166 12.3166 14.3166 11.6834 14.7071 11.2929L17.2929 8.70711Z"
                        fill="black"
                      />
                    </svg>
                  </span>
                  {/* <!--end::Svg Icon--> */}
                </div>
              </div>
              {/* <!--end::Notifications--> */}
              {/* <!--begin::Chat--> */}
              <div className="d-flex align-items-center ms-1 ms-lg-3">
                <div className="d-flex align-items-center ms-1 ms-lg-3">
                  {/* <!--begin::Menu wrapper--> */}
                  <div
                    className="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
                    id="kt_drawer_chat_toggle"
                  >
                    {/* <!--begin::Svg Icon | path: icons/duotune/communication/com012.svg--> */}
                    <span className="svg-icon svg-icon-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          opacity="0.3"
                          d="M20 3H4C2.89543 3 2 3.89543 2 5V16C2 17.1046 2.89543 18 4 18H4.5C5.05228 18 5.5 18.4477 5.5 19V21.5052C5.5 22.1441 6.21212 22.5253 6.74376 22.1708L11.4885 19.0077C12.4741 18.3506 13.6321 18 14.8167 18H20C21.1046 18 22 17.1046 22 16V5C22 3.89543 21.1046 3 20 3Z"
                          fill="black"
                        />
                        <rect
                          x="6"
                          y="12"
                          width="7"
                          height="2"
                          rx="1"
                          fill="black"
                        />
                        <rect
                          x="6"
                          y="7"
                          width="12"
                          height="2"
                          rx="1"
                          fill="black"
                        />
                      </svg>
                    </span>
                    {/* <!--end::Svg Icon--> */}
                    <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"></span>
                  </div>
                  {/* <!--end::Menu wrapper--> */}
                </div>
              </div>
              {/* <!--end::Chat--> */}

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
                  {/* <div className="separator my-2"></div> */}
                  {/* <div className="menu-item px-5">
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
                  </div> */}
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
