import React from 'react';

import Heading from '~shared/Heading';
import Link from '~shared/Link';
import ColonyAvatar from '~shared/ColonyAvatar';

import { Colony, WatchedColony } from '~types';

import styles from './ColonyGridItem.css';

interface Props {
  colony: WatchedColony | Colony;
}

const displayName = 'common.ColonyGrid.ColonyGridItem';

const ColonyGridItem = ({
  colony,
  colony: { name, profile, colonyAddress },
}: Props) => {
  return (
    <div className={styles.main}>
      <Link to={`/colony/${name}`}>
        <ColonyAvatar colonyAddress={colonyAddress} colony={colony} />
        <Heading appearance={{ size: 'small' }}>
          <span
            title={profile?.displayName || name}
            className={styles.displayName}
          >
            {profile?.displayName || name}
          </span>
        </Heading>
      </Link>
    </div>
  );
};

ColonyGridItem.displayName = displayName;

export default ColonyGridItem;
