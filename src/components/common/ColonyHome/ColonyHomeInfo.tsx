import React from 'react';

import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';

import styles from './ColonyHomeLayout.css';

const displayName = 'dashboard.ColonyHome.ColonyHomeInfo';

interface Props {
  isMobile: boolean;
  showNavigation: boolean;
}

const ColonyHomeInfo = ({ isMobile, showNavigation }: Props) => (
  <aside className={styles.leftAside}>
    <ColonyTitle />
    {!isMobile && showNavigation && <ColonyNavigation />}
  </aside>
);

ColonyHomeInfo.displayName = displayName;

export default ColonyHomeInfo;
