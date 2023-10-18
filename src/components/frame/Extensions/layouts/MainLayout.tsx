import React, { FC, PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Spinner from '~v5/shared/Spinner';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';

import type { MainLayoutProps } from './types';

import Header from './Header';
import MainSidebar from './MainSidebar';

const displayName = 'frame.Extensions.layouts.MainLayout';

const MainLayout: FC<PropsWithChildren<MainLayoutProps>> = ({
  children,
  loadingText,
}) => {
  return (
    <Spinner loading={false} loadingText={loadingText}>
      <ToastContainer
        className={styles.toastNotification}
        autoClose={3000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        closeButton={CloseButton}
      />
      <div className="grid grid-cols-[80px,auto] gap-4 p-4">
        <aside className="sticky top-4 h-[calc(100vh-2rem)]">
          <MainSidebar />
        </aside>
        <div className="">
          <Header />
          {/* @TODO: Remove wallet component when we have a proper wallet */}
          <div className="hidden">
            <Wallet />
          </div>
          <main className="mt-5 pb-24">
            <div className="inner">
              <div className="mt-9">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </Spinner>
  );
};

MainLayout.displayName = displayName;

export default MainLayout;
