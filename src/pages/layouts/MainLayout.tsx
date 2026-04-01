import React, { ReactNode, useEffect } from 'react';
import { AppAside } from 'src/components/Aside';
import { AppHeader } from 'src/components/Header';
import { AppFooter } from 'src/components/Footer';
import { Layout } from 'antd';
import { AppAlert } from 'src/components/Alert';
import { useLocation } from 'react-router-dom';
import { PATH } from 'src/constants/paths';
const { Header, Content, Footer } = Layout;

interface Props {
  children: ReactNode;
}
export const MainLayout = (props: Props) => {
  const { children } = props;
  const { pathname } = useLocation();

  useEffect(() => {
    const body = document.body;
    const appLayoutClasses = [
      'header-fixed',
      'header-tablet-and-mobile-fixed',
      'toolbar-enabled',
      'toolbar-fixed',
      'aside-enabled',
      'aside-fixed',
    ];
    const authPaths = [PATH.HOME, PATH.LOGIN, PATH.REGISTER];
    const isAuthPage = authPaths.includes(pathname);

    appLayoutClasses.forEach(className => {
      body.classList.toggle(className, !isAuthPage);
    });

    body.classList.remove('page-loading');

    return () => {
      appLayoutClasses.forEach(className => {
        body.classList.remove(className);
      });
    };
  }, [pathname]);

  useEffect(() => {
    const metronic = window as Window & {
      KTMenu?: { createInstances: () => void };
      KTDrawer?: { createInstances: () => void; updateAll?: () => void };
      KTToggle?: { createInstances: () => void };
      KTSwapper?: { createInstances: () => void };
      KTScroll?: { createInstances: () => void };
      KTSticky?: { createInstances: () => void };
    };

    const initMetronicComponents = () => {
      metronic.KTMenu?.createInstances();
      metronic.KTDrawer?.createInstances();
      metronic.KTDrawer?.updateAll?.();
      metronic.KTToggle?.createInstances();
      metronic.KTSwapper?.createInstances();
      metronic.KTScroll?.createInstances();
      metronic.KTSticky?.createInstances();
    };

    const timer = window.setTimeout(initMetronicComponents, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, children]);

  return (
    <div className="page d-flex flex-row flex-column-fluid " >
      <AppAside></AppAside>
        <AppHeader />
            {/* <AppAlert /> */}
            {children}
     </div> 
  );
};
