import React from 'react';

import { useMobile } from '~hooks';

import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';

import styles from './ColonyHomeLayout.css';

const displayName = 'common.ColonyHome.ColonyHomeInfo';

const ColonyHomeInfo = () => {
  const isMobile = useMobile();

  return (
    <aside className={styles.leftAside}>
      <ColonyTitle />
      {!isMobile && <ColonyNavigation />}
    </aside>
  );
};

ColonyHomeInfo.displayName = displayName;

export default ColonyHomeInfo;
