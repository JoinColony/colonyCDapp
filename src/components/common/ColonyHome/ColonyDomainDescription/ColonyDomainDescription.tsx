import React, { useCallback } from 'react';

import ColorTag from '~shared/ColorTag';

// import { Colony } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { FullColony } from '~gql';

import styles from './ColonyDomainDescription.css';

interface Props {
  colony: FullColony;
  currentDomainId: number;
}

const displayName = 'commin.ColonyHome.ColonyDomainDescription';

const ColonyDomainDescription = ({ colony, currentDomainId }: Props) => {
  /*
   * @TODO a proper color transformation
   * This was just quickly thrown together to ensure it works
   * Maybe even change the gql scalar type ?
   */
  const transformColor = useCallback((domainColor) => {
    const colorMap = {
      0: 0, // Light Pink
      LIGHTPINK: 0,
      5: 5, // Yellow
      RED: 6,
      ORANGE: 13,
    };
    return colorMap[domainColor];
  }, []);

  if (currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    return null;
  }
  const { name, color, description } =
    colony.domains.items.find(
      ({ nativeId }) => Number(nativeId) === currentDomainId,
    ) || {};
  return (
    <div className={styles.main}>
      <div className={styles.name}>
        <ColorTag color={transformColor(color) || 0} />
        <span>{name}</span>
      </div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
};

ColonyDomainDescription.displayName = displayName;

export default ColonyDomainDescription;
