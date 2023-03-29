import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useMobile } from '~hooks';

import SelectedToken from './SelectedToken/SelectedToken';
import ManageFundsLink from './ManageFundsLink/ManageFundsLink';

import styles from './ColonyTotalFunds.css';

const displayName = 'common.ColonyTotalFunds';

const MSG = defineMessages({
  totalBalance: {
    id: `${displayName}.totalBalance`,
    defaultMessage: 'Colony total balance',
  },
});

const ColonyTotalFunds = () => {
  const { canInteractWithColony } = useColonyContext();
  const isMobile = useMobile();

  // const isSupportedColonyVersion =
  //   parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;

  const isSupportedColonyVersion = true;

  return (
    <div className={styles.main}>
      {isMobile ? (
        <>
          <SelectedToken>
            <div className={styles.totalBalanceCopy}>
              <FormattedMessage {...MSG.totalBalance} />
            </div>
          </SelectedToken>
          {isSupportedColonyVersion && canInteractWithColony && (
            <ManageFundsLink />
          )}
        </>
      ) : (
        <>
          <SelectedToken />
          <div className={styles.totalBalanceCopy}>
            <FormattedMessage {...MSG.totalBalance} />
            {isSupportedColonyVersion && canInteractWithColony && (
              <ManageFundsLink />
            )}
          </div>
        </>
      )}
    </div>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
