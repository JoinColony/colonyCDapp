import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import { useColonyContext } from '~hooks';

import ColonySubscription from '../ColonySubscription';

import styles from './ColonyTitle.css';

const displayName = 'common.ColonyHome.ColonyTitle';

const MSG = defineMessages({
  fallbackColonyName: {
    id: `${displayName}.fallbackColonyName`,
    defaultMessage: 'Unknown Colony',
  },
});

const ColonyTitle = () => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const { metadata, name } = colony;

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <div className={styles.colonyTitle}>
          <Heading
            appearance={{
              size: 'medium',
              weight: 'medium',
              margin: 'none',
            }}
            text={metadata?.displayName || name || MSG.fallbackColonyName}
            data-test="colonyTitle"
          />
        </div>
        <div>
          <ColonySubscription />
        </div>
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
