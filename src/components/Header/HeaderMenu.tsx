import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { logout } from 'src/components/Auth/Auth.thunks';
import { APP_MENU_ITEMS } from 'src/constants/appMenu';
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
  const location = useLocation();
  const [openMenuKey, setOpenMenuKey] = useState('');
  const displayName = user.empName || user.username || 'User';
  const departmentName = user.deptName || 'Department';
  const employeeNumber = user.empNum ? Math.trunc(user.empNum) : '';

  const isPathActive = (path?: string) => {
    if (!path || path === '#') {
      return false;
    }

    const targetUrl = new URL(path, window.location.origin);
    const targetSearch = new URLSearchParams(targetUrl.search);
    const currentSearch = new URLSearchParams(location.search);

    if (targetUrl.pathname !== location.pathname) {
      return false;
    }

    return Array.from(targetSearch.entries()).every(
      ([key, value]) => currentSearch.get(key) === value,
    );
  };

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
                {APP_MENU_ITEMS.map(item =>
                  item.children?.length ? (() => {
                    const isActiveParent = item.children.some(child =>
                      isPathActive(child.path),
                    );
                    const isOpen = openMenuKey === item.key;

                    return (
                      <div
                        key={item.key}
                        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                        data-kt-menu-placement="bottom-start"
                        className={`menu-item menu-lg-down-accordion me-lg-1 ${
                          isActiveParent ? 'here' : ''
                        } ${isOpen ? 'hover show' : ''}`}
                        onMouseEnter={() => setOpenMenuKey(item.key)}
                        onMouseLeave={() => setOpenMenuKey('')}
                      >
                      <span
                        className={`menu-link py-3 ${
                          isActiveParent ? 'active' : ''
                        }`}
                        onClick={() =>
                          setOpenMenuKey(current =>
                            current === item.key ? '' : item.key,
                          )
                        }
                      >
                        <span className="menu-title">{item.label}</span>
                        <span className="menu-arrow"></span>
                      </span>
                      <div
                        className={`menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px ${
                          isOpen ? 'show' : ''
                        }`}
                      >
                        {item.children.map(child => (
                          <div key={child.key} className="menu-item">
                            <NavLink
                              exact
                              className="menu-link py-3"
                              activeClassName="active"
                              isActive={() => isPathActive(child.path)}
                              to={child.path || '#'}
                            >
                              <span className="menu-icon">
                                <i className={child.iconClass}></i>
                              </span>
                              <span className="menu-title">{child.label}</span>
                            </NavLink>
                          </div>
                        ))}
                      </div>
                    </div>
                    );
                  })() : (
                    <div key={item.key} className="menu-item me-lg-1">
                      <NavLink
                        exact
                        className="menu-link py-3"
                        activeClassName="active"
                        isActive={() => isPathActive(item.path)}
                        to={item.path || '#'}
                      >
                        <span className="menu-title">{item.label}</span>
                      </NavLink>
                    </div>
                  ),
                )}
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
