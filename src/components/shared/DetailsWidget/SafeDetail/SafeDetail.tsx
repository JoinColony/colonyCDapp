import React from 'react';

import Avatar from '~shared/Avatar';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import { Safe } from '~types';
import { SAFE_NAMES_MAP } from '~constants';

import styles from './SafeDetail.css';

const displayName = 'DetailsWidget.SafeDetail';

interface Props {
  removedSafes: Safe[];
}

const SafeDetail = ({ removedSafes }: Props) => {
  return (
    <>
      {removedSafes.map((safe) => (
        <div className={styles.main} key={`${safe.chainId}-${safe.address}`}>
          <Avatar
            seed={safe.address.toLowerCase()}
            size="xs"
            title="avatar"
            placeholderIcon="safe-logo"
          />
          <div className={styles.textContainer}>
            <div className={styles.displayName}>{`${safe.name} (${
              SAFE_NAMES_MAP[safe.chainId]
            })`}</div>
            <InvisibleCopyableAddress address={safe.address}>
              <div className={styles.address}>
                <MaskedAddress address={safe.address} />
              </div>
            </InvisibleCopyableAddress>
          </div>
        </div>
      ))}
    </>
  );
};

SafeDetail.displayName = displayName;

export default SafeDetail;
