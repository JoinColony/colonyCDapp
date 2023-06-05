import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { ToastContainer } from 'react-toastify';
import Header from '~frame/Extensions/Header';
import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Navigation from '~common/Extensions/Navigation';
import PageTitle from '~common/Extensions/PageTitle';
import {
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useEnabledExtensions,
  useMobile,
  useTransformer,
} from '~hooks';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks';
import CalamityBanner from '~common/Extensions/CalamityBanner/CalamityBanner';
import { getAllUserRoles } from '~redux/transformers';
import { useDialog } from '~shared/Dialog';
import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import Spinner from '~shared/Extensions/Spinner';
import { applyTheme } from '../themes/utils';
import { Theme } from '../themes/enum';
import { usePageThemeContext } from '~context/PageThemeContext';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';

const displayName = 'frame.Extensions.layouts.ExtensionsLayout';

const ExtensionsLayout: FC<PropsWithChildren> = ({ children }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const { user, wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, wallet?.address]);
  const openUpgradeColonyDialog = useDialog(NetworkContractUpgradeDialog);
  const enabledExtensionData = useEnabledExtensions();
  const { isDarkMode } = usePageThemeContext();

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
    <Spinner loadingText="extensionsPage">
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
      <Header />
      {/* @TODO: Remove wallet component when we have a proper wallet */}
      <div className="hidden">
        <Wallet />
      </div>
      <main className="mt-9 mb-24 bg-base-white">
        <div className="inner">
          {isMobile && <Navigation />}
          <div className="mt-9 sm:mt-6">
            <PageTitle
              title={formatMessage({ id: 'extensionsPage.title' })}
              subtitle={formatMessage({ id: 'extensionsPage.description' })}
            />
          </div>
          <div className="mt-10">{children}</div>
        </div>
      </main>
    </Spinner>
  );
};

ExtensionsLayout.displayName = displayName;

export default ExtensionsLayout;
