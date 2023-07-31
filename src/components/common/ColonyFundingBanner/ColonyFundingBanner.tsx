import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import MaskedAddress from '~shared/MaskedAddress';
import { splitAddress } from '~utils/strings';
import { useColonyContext } from '~hooks';

import styles from './ColonyFundingBanner.css';

const displayName = 'common.ColonyFundingBanner';

const MSG = defineMessages({
  tipText: {
    id: `${displayName}.tipText`,
    defaultMessage: `Tip: to fund your colony, send tokens to your colony's address:`,
  },
});

const ColonyFundingBanner = () => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony || {};

  const formattedAddress = useMemo(() => {
    const addressElements = splitAddress(colonyAddress);
    if (!(addressElements instanceof Error)) {
      return (
        <div className={styles.address}>
          <span>
            {addressElements.header}
            {addressElements.start}
          </span>
          <span>{addressElements.middle}</span>
          <span>{addressElements.end}</span>
        </div>
      );
    }
    return <MaskedAddress address={colonyAddress} />;
  }, [colonyAddress]);

  return (
    <div className={styles.main}>
      <FormattedMessage {...MSG.tipText} />
      {formattedAddress}
    </div>
  );
};

ColonyFundingBanner.displayName = displayName;

export default ColonyFundingBanner;
