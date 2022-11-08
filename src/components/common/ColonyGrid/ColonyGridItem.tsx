import React from 'react';

import Heading from '~shared/Heading';
import Link from '~shared/Link';
import { SpinnerLoader } from '~shared/Preloaders';
import ColonyAvatar from '~shared/ColonyAvatar';
// import { useColonyProfileQuery } from '~data/index';

import styles from './ColonyGridItem.css';

interface Props {
  colonyAddress: string;
}

const ColonyGridItem = ({ colonyAddress }: Props) => {
  // const { data, loading } = useColonyProfileQuery({
  //   variables: { address: colonyAddress },
  // });

  const data = {};
  const loading = true;

  if (loading || !data) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );
  }

  // const {
  //   processedColony: { colonyName, displayName },
  //   processedColony: colony,
  // } = data;
  const colonyName = '';
  const colony = {};
  const displayName = '';

  return (
    <div className={styles.main}>
      <Link to={`/colony/${colonyName}`}>
        <ColonyAvatar colonyAddress={colonyAddress} colony={colony} />
        <Heading appearance={{ size: 'small' }}>
          <span
            title={displayName || colonyName}
            className={styles.displayName}
          >
            {displayName || colonyName}
          </span>
        </Heading>
      </Link>
    </div>
  );
};

export default ColonyGridItem;
