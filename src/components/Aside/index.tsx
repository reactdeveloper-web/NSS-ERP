import React, { useState } from 'react';
import { Menu, Grid } from 'antd';
import { NavLink } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { logout } from 'src/components/Auth/Auth.thunks';
import { APP_MENU_ITEMS } from 'src/constants/appMenu';
import { IMAGEPATH } from 'src/constants/img-paths';

const { useBreakpoint } = Grid;

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user as IUser,
});
const mapDispatchToProps = {
  logout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {}

const _AppAside = (props: Props) => {
  const { isAuthenticated, logout, user } = props;
  const { md } = useBreakpoint();

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const drawerOnClose = () => {
    setVisible(false);
  };
  const leftSideLinks = (
    // begin::Aside
    <div
      id="kt_aside"
      className="aside aside-light aside-hoverable"
      data-kt-drawer="true"
      data-kt-drawer-name="aside"
      data-kt-drawer-activate="{default: true, lg: false}"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_aside_mobile_toggle"
    >
      {/* <!--begin::Brand--> */}
      <div
        className="aside-logo flex-column-auto aside-brand"
        id="kt_aside_logo"
      >
        {/* <!--begin::Logo--> */}
        <a href="../../demo1/dist/index.html">
          <img alt="Logo" src={IMAGEPATH.LOGO} className="h-35px logo" />
        </a>
        {/* <!--end::Logo--> */}
        {/* <!--begin::Aside toggler--> */}
        <div
          id="kt_aside_toggle"
          className="btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle"
          data-kt-toggle="true"
          data-kt-toggle-state="active"
          data-kt-toggle-target="body"
          data-kt-toggle-name="aside-minimize"
        >
          {/* <!--begin::Svg Icon | path: icons/duotune/arrows/arr079.svg--> */}
          <span className="svg-icon svg-icon-1 rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
                fill="black"
              />
              <path
                d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
                fill="black"
              />
            </svg>
          </span>
          {/* <!--end::Svg Icon--> */}
        </div>
        {/* <!--end::Aside toggler--> */}
      </div>
      {/* <!--end::Brand--> */}

      {/* <!--begin::Aside menu--> */}
      <div className="aside-menu flex-column-fluid">
        {/* <!--begin::Aside Menu--> */}
        <div
          className="hover-scroll-overlay-y my-5 my-lg-5"
          id="kt_aside_menu_wrapper"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-height="auto"
          data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
          data-kt-scroll-wrappers="#kt_aside_menu"
          data-kt-scroll-offset="0"
        >
          {/* <!--begin::Menu--> */}
          <div
            className="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
            id="#kt_aside_menu"
            data-kt-menu="true"
          >
            <div
              data-kt-menu-trigger="click"
              className="menu-item menu-accordion"
            >
              <ul className="ps-0 mb-0">
                {APP_MENU_ITEMS.map(item => (
                  <li
                    key={item.key}
                    className="menu-item"
                    data-submenu={item.label}
                  >
                    <NavLink
                      exact
                      className="menu-link"
                      activeClassName="active"
                      to={item.path}
                    >
                      <span className="menu-icon">
                        <i className={item.iconClass}></i>
                      </span>
                      <span className="menu-title">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* <!--end::Menu--> */}
        </div>
        {/* <!--end::Aside Menu--> */}
      </div>
      {/* <!--end::Aside menu--> */}
    </div>
  );

  return <>{isAuthenticated ? leftSideLinks : ''}</>;
};

const AppAside = connector(_AppAside);
export { AppAside };
