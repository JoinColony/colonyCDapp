import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import ColonySubscription from '../ColonySubscription';

import { FullColony } from '~gql';

import styles from './ColonyTitle.css';

const displayName = 'common.ColonyHome.ColonyTitle';

const MSG = defineMessages({
  fallbackColonyName: {
    id: `${displayName}.fallbackColonyName`,
    defaultMessage: 'Unknown Colony',
  },
});

type Props = {
  colony: FullColony;
};

const ColonyTitle = ({ colony: { name, profile }, colony }: Props) => {
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
            text={profile?.displayName || name || MSG.fallbackColonyName}
            data-test="colonyTitle"
          />
        </div>
        <div>
          <ColonySubscription colony={colony} />
        </div>
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
