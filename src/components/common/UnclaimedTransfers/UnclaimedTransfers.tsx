import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useColonyFundsClaims } from '~hooks';

import UnclaimedTransfersItem from './UnclaimedTransfersItem';

import styles from './UnclaimedTransfers.css';

const displayName = 'common.UnclaimedTransfers';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Incoming funds for {colony}',
  },
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: 'Loading token transfers...',
  },
});

const UnclaimedTransfers = () => {
  const { colony } = useColonyContext();
  const claims = useColonyFundsClaims();

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <FormattedMessage
          {...MSG.title}
          values={{
            colony: colony?.profile?.displayName || 'colony',
          }}
        />
      </div>
      <ul>
        {claims.map((claim) => (
          <UnclaimedTransfersItem claim={claim} key={claim?.id} />
        ))}
      </ul>
    </div>
  );
};

UnclaimedTransfers.displayName = displayName;

export default UnclaimedTransfers;
