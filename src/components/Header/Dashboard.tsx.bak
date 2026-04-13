import React from 'react';
import { Menu, Grid } from 'antd';
import { NavLink } from 'react-router-dom';
import { LoginOutlined } from '@ant-design/icons';
import { logout } from 'src/components/Auth/Auth.thunks';
import { connect, ConnectedProps } from 'react-redux';
import { PATH } from 'src/constants/paths';
import { HeaderMenu } from 'src/components/Header/HeaderMenu';
import { HeaderContent } from 'src/components/Header/HeaderContent';
import { AuthFooter } from 'src/components/Footer/AuthFooter';

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

const _Dashboard = (props: Props) => {
  const { isAuthenticated, logout, user } = props;
  const { md } = useBreakpoint();
  
  const authLinks = (
  //const DashboardLinks = (
    			// <!--begin::Wrapper-->
				<div className="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
          			{/* <!--begin::Header--> */}
					<HeaderMenu></HeaderMenu>
					{/* <!--end::Header--> */}

					{/* <!--begin::Content--> */}
					<HeaderContent></HeaderContent>
					{/* <!--end::Content--> */}

					{/* <!--begin::Footer--> */}
					
					<AuthFooter></AuthFooter>
					{/* <!--end::Footer--> */}

				</div>
				// <!--end::Wrapper-->
    
  );
  return <>{isAuthenticated ? authLinks : ''}</>;
};

const Dashboard = connector(_Dashboard);
export { Dashboard };
