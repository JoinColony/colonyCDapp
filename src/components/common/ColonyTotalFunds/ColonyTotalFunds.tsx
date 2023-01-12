import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useMobile } from '~hooks';

import ColonyTotalFundsSelectedToken from './ColonyTotalFundsSelectedToken';
import ColonyTotalFundsManageFunds from './ColonyTotalFundsManageFunds';

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
          <ColonyTotalFundsSelectedToken>
            <div className={styles.totalBalanceCopy}>
              <FormattedMessage {...MSG.totalBalance} />
            </div>
          </ColonyTotalFundsSelectedToken>
          {isSupportedColonyVersion && canInteractWithColony && (
            <ColonyTotalFundsManageFunds />
          )}
        </>
      ) : (
        <>
          <ColonyTotalFundsSelectedToken />
          <div className={styles.totalBalanceCopy}>
            <FormattedMessage {...MSG.totalBalance} />
            {isSupportedColonyVersion && canInteractWithColony && (
              <ColonyTotalFundsManageFunds />
            )}
          </div>
        </>
      )}
    </div>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
