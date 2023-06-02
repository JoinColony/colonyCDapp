import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Header from '~frame/Extensions/Header';
import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Navigation from '~common/Extensions/Navigation';
import PageTitle from '~common/Extensions/PageTitle';
import TwoColumns from '~frame/Extensions/TwoColumns';
import {
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useEnabledExtensions,
  useExtensionsData,
  useMobile,
  useTransformer,
} from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks';
import CalamityBanner from '~common/Extensions/CalamityBanner/CalamityBanner';
import { getAllUserRoles } from '~redux/transformers';
import { useDialog } from '~shared/Dialog';
import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import { applyTheme } from '../themes/utils';
import { Theme } from '../themes/enum';
import { usePageThemeContext } from '~context/PageThemeContext';

const displayName = 'frame.Extensions.layouts.ExtensionsLayout';

const ExtensionsLayout: FC<PropsWithChildren> = ({ children }) => {
  const { loading } = useExtensionsData();
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

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={{ id: 'extensionsPage.loading' }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return (
    <div className="bg-base-white h-full">
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
      <Header />
      {/* @TODO: Remove wallet component when we have a proper wallet */}
      <div className="hidden">
        <Wallet />
      </div>
      <main className="mt-9">
        <div className="inner">
          {isMobile && <Navigation />}
          <div className="mt-9 sm:mt-6">
            <PageTitle
              title={formatMessage({ id: 'extensionsPage.title' })}
              subtitle={formatMessage({ id: 'extensionsPage.description' })}
            />
          </div>
          <div className="flex lg:gap-[6.25rem] md:gap-12 mt-9">
            <TwoColumns
              aside={
                <div className="-mt-0.5">
                  <Navigation />
                </div>
              }
            >
              {children}
            </TwoColumns>
          </div>
        </div>
      </main>
    </div>
  );
};

ExtensionsLayout.displayName = displayName;

export default ExtensionsLayout;
