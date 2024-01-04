import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { getSafeTransactionMonitor } from '~constants/externalUrls';
import Alert from '~shared/Alert';
import ExternalLink from '~shared/ExternalLink';
import Icon from '~shared/Icon';

import styles from './SafeTransactionBanner.css';

interface Props {
  chainId: string;
  transactionHash: string;
}

const displayName = 'common.ActionsPage.SafeTransactionBanner';

const MSG = defineMessages({
  processTransaction: {
    id: `${displayName}.processTransaction`,
    defaultMessage: `Click ‘Process transaction’, then click ‘Execute’ to pay the gas costs and complete the transaction.`,
  },
  monitorUrl: {
    id: `${displayName}.monitorUrl`,
    defaultMessage: `Process transaction`,
  },
});

const SafeTransactionBanner = ({ chainId, transactionHash }: Props) => {
  const transactionMonitorUrl = getSafeTransactionMonitor(
    chainId,
    transactionHash,
  );
  return (
    <div className={styles.safeTransactionBannerContainer}>
      <Alert
        appearance={{
          theme: 'pinky',
          margin: 'none',
          borderRadius: 'none',
        }}
      >
        <div className={styles.safeTransactionBanner}>
          <FormattedMessage {...MSG.processTransaction} />
          <ExternalLink
            href={transactionMonitorUrl}
            className={styles.monitorUrl}
          >
            <FormattedMessage {...MSG.monitorUrl} />
            <Icon name="share" />
          </ExternalLink>
        </div>
      </Alert>
    </div>
  );
};

SafeTransactionBanner.displayName = displayName;

export default SafeTransactionBanner;
