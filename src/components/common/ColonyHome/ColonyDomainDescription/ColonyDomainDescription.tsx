import React from 'react';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyHomeContext } from '~context';
import { useColonyContext } from '~hooks';
import ColorTag from '~shared/ColorTag';
import { findDomainByNativeId } from '~utils/domains';

import styles from './ColonyDomainDescription.css';

const displayName = 'common.ColonyHome.ColonyDomainDescription';

const ColonyDomainDescription = () => {
  const { colony } = useColonyContext();
  const { domainIdFilter: currentDomainId } = useColonyHomeContext();
  if (currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    return null;
  }

  const { name, color, description } =
    findDomainByNativeId(currentDomainId, colony)?.metadata || {};

  return (
    <div className={styles.main}>
      <div className={styles.name}>
        {color && <ColorTag color={color} />}
        <span>{name}</span>
      </div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
};

ColonyDomainDescription.displayName = displayName;

export default ColonyDomainDescription;
