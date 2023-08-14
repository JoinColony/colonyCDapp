import React, { FC, PropsWithChildren, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import Header from '~frame/Extensions/Header';
import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Navigation from '~v5/common/Navigation';
import PageTitle from '~v5/common/PageTitle';
import { useMobile } from '~hooks';
import CalamityBanner from '~v5/shared/CalamityBanner';
import Spinner from '~v5/shared/Spinner';
import { applyTheme } from '../themes/utils';
import { Theme } from '../themes/enum';
import { usePageThemeContext } from '~context/PageThemeContext';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { PageLayoutProps } from './types';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import {
  MemberModalProvider,
  useMemberModalContext,
} from '~context/MemberModalContext';
import { usePageLayout } from './hooks';

const displayName = 'frame.Extensions.layouts.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  children,
  title,
  description,
  loadingText,
  pageName,
  hideColonies,
}) => {
  const isMobile = useMobile();
  const { isDarkMode } = usePageThemeContext();
  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();
  const { calamityBannerItems, canUpgrade } = usePageLayout();

  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
  }, [isDarkMode]);

  return (
    <Spinner loadingText={loadingText}>
      {canUpgrade && <CalamityBanner items={calamityBannerItems} />}
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
      <Header hideColonies={hideColonies} />
      {/* @TODO: Remove wallet component when we have a proper wallet */}
      <div className="hidden">
        <Wallet />
      </div>
      <main className="mt-5 pb-24">
        <div className="inner">
          {isMobile && (
            <div className="mb-9">
              <Navigation pageName={pageName} />
            </div>
          )}
          <PageTitle
            title={title}
            subtitle={description}
            hideColonies={hideColonies}
          />
          <div className="mt-9">{children}</div>
        </div>
      </main>
      <ManageMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        user={modalUser}
      />
    </Spinner>
  );
};

PageLayout.displayName = displayName;

const PageLayoutWithMemberModalContext: FC<
  PropsWithChildren<PageLayoutProps>
> = ({ children, ...props }) => (
  <MemberModalProvider>
    <PageLayout {...props}>{children}</PageLayout>
  </MemberModalProvider>
);

export default PageLayoutWithMemberModalContext;
