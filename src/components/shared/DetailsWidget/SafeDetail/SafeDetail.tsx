import React from 'react';

import { SAFE_NAMES_MAP } from '~constants';
import Avatar from '~shared/Avatar';
import { InvisibleCopyableMaskedAddress } from '~shared/InvisibleCopyableAddress';
import { Safe } from '~types';

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
        <InvisibleCopyableMaskedAddress address={removedSafe.address} />
      </div>
    </div>
  );
};

SafeDetail.displayName = displayName;

export default SafeDetail;
