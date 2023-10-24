import React, { FC, PropsWithChildren, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import Header from '~frame/Extensions/Header';
import Navigation from '~v5/common/Navigation';
import PageTitle from '~v5/common/PageTitle';
import { useMobile } from '~hooks';
import CalamityBanner from '~v5/shared/CalamityBanner';
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
import { UserTransactionContextProvider } from '~context/UserTransactionContext';
import { TokensModalContextProvider } from '~context/TokensModalContext';

const displayName = 'frame.Extensions.layouts.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  children,
  title,
  description,
  pageName,
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
    <TokensModalContextProvider>
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
      <UserTransactionContextProvider>
        <Header />
      </UserTransactionContextProvider>
      <main className="pt-5 pb-24">
        <div className="inner">
          {isMobile && (
            <Navigation className="mb-9 sm:mb-0" pageName={pageName} />
          )}
          <PageTitle title={title} subtitle={description} />
          <div className="mt-9">{children}</div>
        </div>
      </main>
      <ManageMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        user={modalUser}
      />
    </TokensModalContextProvider>
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
