import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension } from '@colony/colony-js';
import { useParams } from 'react-router';

import Alert from '~core/Alert';
import Button from '~core/Button';
import { useColonyExtensionsQuery } from '~data/index';
import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';
import { useColonyContext } from '~hooks';

import styles from './ExtensionUpgrade.css';

const displayName = 'common.ColonyHome.ExtensionUpgrade';

const MSG = defineMessages({
  upgradeMessage: {
    id: `${displayName}.upgradeMessage`,
    defaultMessage: `This colony uses a version of the OneTx Payment Extension that is no longer supported. You must upgrade to continue using this application.`,
  },
  goToExtensionButton: {
    id: `${displayName}.goToExtensionButton`,
    defaultMessage: `Go to Extension`,
  },
});

const ExtensionUpgrade = () => {
  const { colony } = useColonyContext();
  const { colonyAddress, name } = colony || {};

  const { extensionId } = useParams<{
    extensionId: string;
  }>();

  const { data } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const isExtensionDetailsRoute = extensionId === Extension.OneTxPayment;

  const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
    ({ details, extensionId: extensionName }) =>
      details?.initialized &&
      !details?.missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgrade = oneTxMustBeUpgraded(oneTxPaymentExtension);

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
            <FormattedMessage {...MSG.upgradeMessage} />
          </div>
          {!isExtensionDetailsRoute && (
            <div className={styles.controls}>
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                text={MSG.goToExtensionButton}
                linkTo={`/colony/${name}/extensions/${Extension.OneTxPayment}`}
              />
            </div>
          )}
        </Alert>
      </div>
    );
  }

  return null;
};

ExtensionUpgrade.displayName = displayName;

export default ExtensionUpgrade;
