import React from 'react';

import CopyableAddress from '~shared/CopyableAddress';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import { Safe } from '~types';

import styles from './SafeInfo.css';

interface Props {
  safe: Safe;
}

const displayName = 'SafeInfoPopover.SafeInfo';

const SafeInfo = ({ safe }: Props) => {
  return (
    <div className={styles.container}>
      <Icon className={styles.safeLogo} name="safe-logo" />
      <div className={styles.textContainer}>
        <Heading
          appearance={{ margin: 'none', size: 'normal' }}
          text={safe.name}
          className={styles.userName}
        />
        <div className={styles.address}>
          <CopyableAddress full>{safe.address}</CopyableAddress>
        </div>
      </div>
    </div>
  );
};

SafeInfo.displayName = displayName;

export default SafeInfo;
