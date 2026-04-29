import React, { useState } from 'react';
import { Menu, Grid } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const [visible, setVisible] = useState(false);
  const [openMenuKey, setOpenMenuKey] = useState('');
  const showDrawer = () => {
    setVisible(true);
  };
  const drawerOnClose = () => {
    setVisible(false);
  };

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

  const leftSideLinks = (
    // begin::Aside
    <div
      id="kt_aside"
      className="aside aside-light aside-hoverable"
      onMouseLeave={() => setOpenMenuKey('')}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path d="M14.4 11H3C2.4 11 2 11.4 2 12C2 12.6 2.4 13 3 13H14.4V11Z" fill="black"></path>
								<path opacity="0.3" d="M14.4 20V4L21.7 11.3C22.1 11.7 22.1 12.3 21.7 12.7L14.4 20Z" fill="black"></path>
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
                {APP_MENU_ITEMS.map(item => {
                  const isActiveParent = Boolean(
                    item.children?.some(child => isPathActive(child.path)),
                  );
                  const isOpen = openMenuKey === item.key;

                  return (
                    <li
                      key={item.key}
                      className={`menu-item ${
                        item.children?.length ? 'menu-accordion' : ''
                      } ${isOpen ? 'hover show' : ''}`}
                      data-submenu={item.label}
                      data-kt-menu-trigger={
                        item.children?.length ? 'click' : undefined
                      }
                      onMouseEnter={() => {
                        if (item.children?.length) {
                          setOpenMenuKey(item.key);
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.children?.length) {
                          setOpenMenuKey('');
                        }
                      }}
                    >
                      {item.children?.length ? (
                        <>
                          <div
                            className={`menu-link ${
                              isActiveParent ? 'active' : ''
                            }`}
                            onClick={() =>
                              setOpenMenuKey(current =>
                                current === item.key ? '' : item.key,
                              )
                            }
                          >
                          <span className="menu-icon">
                            <i className={item.iconClass}></i>
                          </span>
                          <span className="menu-title">{item.label}</span>
                          <span className="menu-arrow"></span>
                        </div>

                        <div
                          className={`menu-sub menu-sub-accordion ps-6 ${
                            isOpen ? 'show' : ''
                          }`}
                        >
                          {item.children.map(child => (
                            <div key={child.key} className="menu-item">
                              <NavLink
                                exact
                                className="menu-link"
                                activeClassName="active"
                                isActive={() => isPathActive(child.path)}
                                to={child.path || '#'}
                                onClick={() => setOpenMenuKey('')}
                              >
                                <span className="menu-icon">
                                  <i className={child.iconClass}></i>
                                </span>
                                <span className="menu-title">
                                  {child.label}
                                </span>
                              </NavLink>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <NavLink
                        exact
                        className="menu-link"
                        activeClassName="active"
                        isActive={() => isPathActive(item.path)}
                        to={item.path || '#'}
                        onClick={() => setOpenMenuKey('')}
                      >
                        <span className="menu-icon">
                          <i className={item.iconClass}></i>
                        </span>
                        <span className="menu-title">{item.label}</span>
                      </NavLink>
                    )}
                  </li>
                  );
                })}
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
