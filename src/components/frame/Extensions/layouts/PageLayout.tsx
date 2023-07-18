import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { ToastContainer } from 'react-toastify';

import Header from '~frame/Extensions/Header';
import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Navigation from '~v5/common/Navigation';
import PageTitle from '~v5/common/PageTitle';
import {
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useEnabledExtensions,
  useMobile,
  useTransformer,
} from '~hooks';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks';
import CalamityBanner from '~common/Extensions/CalamityBanner';

import { useDialog } from '~shared/Dialog';
import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import Spinner from '~v5/shared/Spinner';
import { applyTheme } from '../themes/utils';
import { Theme } from '../themes/enum';
import { usePageThemeContext } from '~context/PageThemeContext';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { getAllUserRoles } from '~transformers';
import { ColonyFragment } from '~gql';
import { PageLayoutProps } from './types';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal/ManageMemberModal';
import { useMemberContext } from '~context/MemberContext';

const displayName = 'frame.Extensions.layouts.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  children,
  title,
  description,
  loadingText,
  pageName,
  hideColonies,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const { user, wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony as ColonyFragment,
    wallet?.address || '',
  ]);
  const openUpgradeColonyDialog = useDialog(NetworkContractUpgradeDialog);
  const enabledExtensionData = useEnabledExtensions();
  const { isDarkMode } = usePageThemeContext();
  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberContext();

  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);
  const canUpgradeColony = user?.name && hasRoot(allUserRoles);

  const handleUpgradeColony = () =>
    colony &&
    openUpgradeColonyDialog({
      colony,
      enabledExtensionData,
    });

  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
  }, [isDarkMode]);

  return (
    <Spinner loadingText={loadingText}>
      {canUpgrade && (
        <CalamityBanner
          buttonName="button.upgrade"
          linkName="learn.more"
          isButtonDisabled={!canUpgradeColony}
          onUpgrade={handleUpgradeColony}
        >
          {formatMessage({ id: 'calamityBanner.available' })}
        </CalamityBanner>
      )}
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
      <main className="mt-9 pb-24">
        <div className="inner">
          {isMobile && <Navigation pageName={pageName} />}
          <div className="mt-9 sm:mt-6">
            <PageTitle
              title={title}
              subtitle={description}
              hideColonies={hideColonies}
            />
          </div>
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

export default PageLayout;
