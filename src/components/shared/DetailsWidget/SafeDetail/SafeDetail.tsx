import React from 'react';

import Avatar from '~shared/Avatar';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import { Safe } from '~types';
import { SAFE_NAMES_MAP } from '~constants';

import styles from './SafeDetail.css';

const displayName = 'DetailsWidget.SafeDetail';

interface Props {
  removedSafe: Safe;
}

const SafeDetail = ({ removedSafe }: Props) => {
  return (
    <div className={styles.main}>
      <Avatar
        seed={removedSafe.address.toLowerCase()}
        size="xs"
        title="avatar"
        placeholderIcon="safe-logo"
      />
      <div className={styles.textContainer}>
        <div className={styles.displayName}>{`${removedSafe.name} (${
          SAFE_NAMES_MAP[removedSafe.chainId]
        })`}</div>
        <InvisibleCopyableAddress address={removedSafe.address}>
          <div className={styles.address}>
            <MaskedAddress address={removedSafe.address} />
          </div>
        </InvisibleCopyableAddress>
      </div>
    </div>
  );
};

SafeDetail.displayName = displayName;

export default SafeDetail;
