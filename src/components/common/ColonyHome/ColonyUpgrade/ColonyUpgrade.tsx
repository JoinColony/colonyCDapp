import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~shared/Dialog';
import NetworkContractUpgradeDialog from '~dialogs/NetworkContractUpgradeDialog';
import Alert from '~shared/Alert';
import Button from '~shared/Button';
import ExternalLink from '~shared/ExternalLink';
import { useNetworkContracts } from '~data/index';
import { useTransformer, useAppContext, useColonyContext } from '~hooks';
import { getNetworkRelaseLink } from '~utils/external';
import { colonyMustBeUpgraded, colonyShouldBeUpgraded } from '~modules/dashboard/checks';
import { hasRoot } from '~modules/users/checks';
import { getAllUserRoles } from '~modules/transformers';

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

  const openUpgradeVersionDialog = useDialog(NetworkContractUpgradeDialog);
  const { version: networkVersion } = useNetworkContracts();
  const { user, wallet } = useAppContext();

  const handleUpgradeColony = useCallback(
    () =>
      openUpgradeVersionDialog({
        colony,
      }),
    [colony, openUpgradeVersionDialog],
  );

  const allUserRoles = useTransformer(getAllUserRoles, [colony, wallet?.address]);

  const canUpgradeColony = user?.name && hasRoot(allUserRoles);

  const mustUpgrade = colonyMustBeUpgraded(colony, networkVersion as string);
  const shouldUpdgrade = colonyShouldBeUpgraded(colony, networkVersion as string);

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

  if (shouldUpdgrade) {
    return (
      <div className={styles.upgradeBannerContainer}>
        <Alert
          appearance={{
            theme: 'info',
            margin: 'none',
            borderRadius: 'none',
          }}
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
                        href={getNetworkRelaseLink(
                          // parseInt(colony.version, 10) + 1,
                          10,
                        )}
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
