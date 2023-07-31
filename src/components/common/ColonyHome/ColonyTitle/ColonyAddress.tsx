import React from 'react';
import { defineMessages } from 'react-intl';

import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';

import styles from './ColonyAddress.css';

const displayName = 'common.ColonyHome.ColonyTitle.ColonyAddress';

const MSG = defineMessages({
  copyMessage: {
    id: `${displayName}.copyMessage`,
    defaultMessage: 'Click to copy colony address',
  },
});

interface Props {
  colonyAddress: string;
}

const ColonyAddress = ({ colonyAddress }: Props) => (
  <InvisibleCopyableAddress
    address={colonyAddress}
    copyMessage={MSG.copyMessage}
  >
    <div className={styles.colonyAddress}>
      <MaskedAddress address={colonyAddress} />
    </div>
  </InvisibleCopyableAddress>
);

ColonyAddress.displayName = displayName;

export default ColonyAddress;
