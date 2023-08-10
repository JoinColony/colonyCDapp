import React from 'react';

import Avatar from '~shared/Avatar';
import { Safe } from '~types';
import { SAFE_NAMES_MAP } from '~constants';
import { InvisibleCopyableMaskedAddress } from '~shared/InvisibleCopyableAddress';

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
