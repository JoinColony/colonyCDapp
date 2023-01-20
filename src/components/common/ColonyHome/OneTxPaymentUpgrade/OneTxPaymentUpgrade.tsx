import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension } from '@colony/colony-js';
import { useParams } from 'react-router';

import Alert from '~shared/Alert';
import Button from '~shared/Button';
import { useColonyContext, useExtensionData } from '~hooks';
import { isInstalledExtensionData } from '~utils/extensions';

import styles from './OneTxPaymentUpgrade.css';

const displayName = 'common.ColonyHome.OneTxPaymentUpgrade';

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

const OneTxPaymentUpgrade = () => {
  const { colony } = useColonyContext();
  const { name } = colony || {};
  const { extensionId } = useParams<{
    extensionId: string;
  }>();

  const { extensionData } = useExtensionData(Extension.OneTxPayment);

  if (!colony || !extensionData) {
    return null;
  }

  if (!isInstalledExtensionData(extensionData)) {
    return null;
  }

  const isOneTxPaymentDetailsRoute = extensionId === Extension.OneTxPayment;

  const mustUpgrade =
    extensionData.currentVersion < extensionData.availableVersion;

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
          {!isOneTxPaymentDetailsRoute && (
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

OneTxPaymentUpgrade.displayName = displayName;

export default OneTxPaymentUpgrade;
