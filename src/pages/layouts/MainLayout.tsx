import React, { ReactNode } from 'react';
import { AppAside } from 'src/components/Aside';
import { AppHeader } from 'src/components/Header';
import { AppFooter } from 'src/components/Footer';
import { Layout } from 'antd';
import { AppAlert } from 'src/components/Alert';
const { Header, Content, Footer } = Layout;

interface Props {
  children: ReactNode;
}
export const MainLayout = (props: Props) => {
  const { children } = props;
  return (
    <div className="page d-flex flex-row flex-column-fluid " >
      <AppAside></AppAside>
        <AppHeader />
            {/* <AppAlert /> */}
            {children}
     </div> 
  );
};
