import React, { FC, PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import { Header } from '~frame/Extensions/Header';
import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Spinner from '~v5/shared/Spinner';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';

import { ColonyLayoutProps } from './types';

const displayName = 'frame.Extensions.layouts.MainLayout';

const ColonyLayout: FC<PropsWithChildren<ColonyLayoutProps>> = ({
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
    </Spinner>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
