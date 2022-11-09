import React from 'react';

import Heading from '~shared/Heading';
import Link from '~shared/Link';
import ColonyAvatar from '~shared/ColonyAvatar';

import { Colony } from '~types';

import styles from './ColonyGridItem.css';

interface Props {
  colony: Colony;
}

const ColonyGridItem = ({ colony, colony: { name, profile } }: Props) => {
  return (
    <div className={styles.main}>
      <Link to={`/colony/${name}`}>
        <ColonyAvatar colonyAddress={colony.colonyAddress} colony={colony} />
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

export default ColonyGridItem;
