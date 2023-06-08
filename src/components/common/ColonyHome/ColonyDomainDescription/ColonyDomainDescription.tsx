import React, { useCallback } from 'react';

import ColorTag from '~shared/ColorTag';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyContext } from '~hooks';
import { findDomainByNativeId } from '~utils/domains';

import styles from './ColonyDomainDescription.css';

interface Props {
  currentDomainId: number;
}

const displayName = 'common.ColonyHome.ColonyDomainDescription';

const ColonyDomainDescription = ({ currentDomainId }: Props) => {
  const { colony } = useColonyContext();

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

  if (!colony || currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    return null;
  }

  const { name, color, description } =
    findDomainByNativeId(currentDomainId, colony)?.metadata || {};

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
