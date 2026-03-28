import React, { useState } from 'react';
import { Menu, Grid } from 'antd';
import { NavLink } from 'react-router-dom';
import { LeftMenu } from './LeftMenu';
import { RightMenu } from './RightMenu';
import { Drawer, Button } from 'antd';
import { connect, ConnectedProps } from 'react-redux';
import { logout } from 'src/components/Auth/Auth.thunks';

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
				<div id="kt_aside" className="aside aside-light aside-hoverable" data-kt-drawer="true" data-kt-drawer-name="aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="{default:'200px', '300px': '250px'}" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_aside_mobile_toggle">
        {/* <!--begin::Brand--> */}
					<div className="aside-logo flex-column-auto aside-brand" id="kt_aside_logo">
						{/* <!--begin::Logo--> */}
						<a href="../../demo1/dist/index.html">
							<img alt="Logo" src="assets/media/logos/logo-1-dark.svg" className="h-25px logo" />
						</a>
						{/* <!--end::Logo--> */}
						{/* <!--begin::Aside toggler--> */}
						<div id="kt_aside_toggle" className="btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle" data-kt-toggle="true" data-kt-toggle-state="active" data-kt-toggle-target="body" data-kt-toggle-name="aside-minimize">
							{/* <!--begin::Svg Icon | path: icons/duotune/arrows/arr079.svg--> */}
							<span className="svg-icon svg-icon-1 rotate-180">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="black" />
									<path d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z" fill="black" />
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
						<div className="hover-scroll-overlay-y my-5 my-lg-5" id="kt_aside_menu_wrapper" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer" data-kt-scroll-wrappers="#kt_aside_menu" data-kt-scroll-offset="0">
							{/* <!--begin::Menu--> */}
							<div className="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500" id="#kt_aside_menu" data-kt-menu="true">
								<div data-kt-menu-trigger="click" className="menu-item menu-accordion">

								<ul className="ps-0 mb-0">
									<li className="menu-item" data-submenu="Administration">
										{/* <!--begin:Menu link--> */}
										<a className="menu-link" href="index.html">
											<span className="menu-icon">
												<i className="fas fa-tachometer-alt fs-4"></i></span>
											<span className="menu-title">Dashboard</span>
										</a>
										{/* <!--end:Menu link--> */}
									</li>
									<li className="menu-item" data-submenu="Administration">
										{/* <!--begin:Menu link--> */}
										<a className="menu-link" href="#">
											<span className="menu-icon">
												<i className="fas fa-cogs fs-4"></i>

											</span>
											<span className="menu-title">Administration</span>
										</a>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="National-Gangotri">
										{/* <!--begin:Menu link--> */}
										<a className="menu-link" href="#">
											<span className="menu-icon">
												<i className="fas fa-rupee-sign fs-4"></i>
											</span>
											<span className="menu-title" id="gangotri-menu-title">National Gangotri</span>
										</a>
										{/* <!--end:Menu link--> */}
									</li>
									<li className="menu-item" data-submenu="Ashram">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i b-ea7uveqlys="" className="fas fa-home fs-4">
												</i>
											</span>
											<span className="menu-title">Ashram</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>
									<li className="menu-item" data-submenu="Biling">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i className="fas fa-dollar-sign fs-4"></i>

											</span>
											<span className="menu-title">Biling</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Online-Courses">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i className="fas fa-laptop fs-4"></i>

											</span>
											<span className="menu-title">Online Courses</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Birthday">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i b-ea7uveqlys="" className="fa fa-birthday-cake fs-4"
													aria-hidden="true"></i>

											</span>
											<span className="menu-title">Birthdays &amp; Anniversary</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Building-management">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i className="fas fa-building fs-4"></i>

											</span>
											<span className="menu-title">Building Management</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Corrospondence">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i className="fas fa-paper-plane fs-4"></i>

											</span>
											<span className="menu-title">Corrospondence</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Editing">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i b-ea7uveqlys="" className="fas fa-edit fs-4">
													<span b-ea7uveqlys="" className="path1"></span>
													<span b-ea7uveqlys="" className="path2"></span>
												</i>
											</span>
											<span className="menu-title">Editing</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Event-Management">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i className="far fa-calendar-check fs-4"></i>
											</span>
											<span className="menu-title">Event Management</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Flag-Events">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i className="fas fa-flag fs-4"></i>
											</span>
											<span className="menu-title">Flag Events</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Guest-House">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i b-ea7uveqlys="" className="fa fa-bed fs-4" aria-hidden="true"></i>
											</span>
											<span className="menu-title">Guest House</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									<li className="menu-item" data-submenu="Hardware">
										{/* <!--begin:Menu link--> */}
										<span className="menu-link">
											<span className="menu-icon">
												<i className="fas fa-desktop fs-4"></i>
											</span>
											<span className="menu-title">Hardware &amp; Networking</span>
										</span>
										{/* <!--end:Menu link--> */}
									</li>

									{/* <li className="menu-item" data-submenu="HR">
										
										<span className="menu-link">
											<span className="menu-icon">
												<i className="fas fa-user-friends fs-4"></i>
											</span>
											<span className="menu-title">HR</span>
										</span>
									
									</li> */}




								</ul>

							</div>

              

             </div>
							{/* <!--end::Menu--> */}
						</div>
						{/* <!--end::Aside Menu--> */}
					</div>
					{/* <!--end::Aside menu--> */}

          {/* <!--begin::Footer--> */}
					<div className="aside-footer flex-column-auto pt-5 pb-7 px-5" id="kt_aside_footer">
						<a href="../../demo1/dist/documentation/getting-started.html" className="btn btn-custom btn-primary w-100" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss-="click" title="200+ in-house components and 3rd-party plugins">
							<span className="btn-label">Docs &amp; Components</span>
							{/* <!--begin::Svg Icon | path: icons/duotune/general/gen005.svg--> */}
							<span className="svg-icon btn-icon svg-icon-2">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM15 17C15 16.4 14.6 16 14 16H8C7.4 16 7 16.4 7 17C7 17.6 7.4 18 8 18H14C14.6 18 15 17.6 15 17ZM17 12C17 11.4 16.6 11 16 11H8C7.4 11 7 11.4 7 12C7 12.6 7.4 13 8 13H16C16.6 13 17 12.6 17 12ZM17 7C17 6.4 16.6 6 16 6H8C7.4 6 7 6.4 7 7C7 7.6 7.4 8 8 8H16C16.6 8 17 7.6 17 7Z" fill="black" />
									<path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="black" />
								</svg>
							</span>
							{/* <!--end::Svg Icon--> */}
						</a>
					</div>
					{/* <!--end::Footer--> */}


    </div>
  );

  return <>{isAuthenticated ? leftSideLinks : ''}</>;
};

const AppAside = connector(_AppAside);
export { AppAside };
