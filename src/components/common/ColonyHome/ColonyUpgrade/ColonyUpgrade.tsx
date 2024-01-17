import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import {
  useTransformer,
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useEnabledExtensions,
} from '~hooks';
import Alert from '~shared/Alert';
import Button from '~shared/Button';
import { useDialog } from '~shared/Dialog';
import ExternalLink from '~shared/ExternalLink';
import { getAllUserRoles } from '~transformers';
import {
  hasRoot,
  mustColonyBeUpgraded,
  canColonyBeUpgraded,
} from '~utils/checks';
import { getNetworkReleaseLink } from '~utils/external';

import styles from './ColonyUpgrade.css';

const displayName = 'common.ColonyHome.ColonyUpgrade';

const MSG = defineMessages({
  upgradeRequired: {
    id: `${displayName}.upgradeRequired`,
    defaultMessage: `This colony uses a version of the network that is no
      longer supported. You must upgrade to continue using this application.`,
  },
  upgradeSuggested: {
    id: `${displayName}.upgradeSuggested`,
    defaultMessage: `A new version of the Colony Network is available! {linkToRelease}`,
  },
});

const ColonyUpgrade = () => {
  const { colony } = useColonyContext();
  const { colonyContractVersion, loadingColonyContractVersion } =
    useColonyContractVersion();

  const hasAlreadyDismissedAlert = !!localStorage.getItem(
    `upgradeTo${colonyContractVersion}BannerDismissed`,
  );

  const openUpgradeColonyDialog = useDialog(NetworkContractUpgradeDialog);
  const { user, wallet } = useAppContext();
  const enabledExtensionData = useEnabledExtensions();
  const handleUpgradeColony = () =>
    openUpgradeColonyDialog({
      colony,
      enabledExtensionData,
    });

  const handleAlertDismissed = () => {
    localStorage.setItem(
      `upgradeTo${colonyContractVersion}BannerDismissed`,
      'true',
    );
  };

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address ?? '',
  ]);

  const canUpgradeColony = user?.profile?.displayName && hasRoot(allUserRoles);

  const mustUpgrade = mustColonyBeUpgraded(colony, colonyContractVersion);
  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  if (mustUpgrade) {
    return (
      <div className={styles.upgradeBannerContainer}>
        <Alert
          appearance={{
            theme: 'danger',
            margin: 'none',
            borderRadius: 'none',
          }}
        >
          <div className={styles.upgradeBanner}>
            <FormattedMessage {...MSG.upgradeRequired} />
          </div>
          <div className={styles.controls}>
            <Button
              appearance={{ theme: 'primary', size: 'medium' }}
              text={{ id: 'button.upgrade' }}
              onClick={handleUpgradeColony}
              disabled={!canUpgradeColony}
            />
          </div>
        </Alert>
      </div>
    );
  }

  if (
    canUpgrade &&
    !hasAlreadyDismissedAlert &&
    !loadingColonyContractVersion
  ) {
    return (
      <div className={styles.upgradeBannerContainer}>
        <Alert
          appearance={{
            theme: 'info',
            margin: 'none',
            borderRadius: 'none',
          }}
          onAlertDismissed={handleAlertDismissed}
        >
          {(handleDismissed) => (
            <>
              <div className={styles.upgradeBanner}>
                <FormattedMessage
                  {...MSG.upgradeSuggested}
                  values={{
                    linkToRelease: (
                      <ExternalLink
                        text={{ id: 'text.learnMore' }}
                        href={getNetworkReleaseLink()}
                      />
                    ),
                  }}
                />
              </div>
              <div className={styles.controls}>
                <Button
                  appearance={{ theme: 'danger', size: 'medium' }}
                  text={{ id: 'button.dismiss' }}
                  onClick={handleDismissed}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  text={{ id: 'button.upgrade' }}
                  onClick={handleUpgradeColony}
                  disabled={!canUpgradeColony}
                />
              </div>
            </>
          )}
        </Alert>
      </div>
    );
  }

  return null;
};

ColonyUpgrade.displayName = displayName;

export default ColonyUpgrade;
