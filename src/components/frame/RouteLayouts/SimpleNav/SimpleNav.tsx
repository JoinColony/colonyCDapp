import React, { ReactNode } from 'react';
import UserNavigation from '../UserNavigation';
import { useMobile } from '~hooks';

import styles from './SimpleNav.css';

interface Props {
  children: ReactNode;
}

const SimpleNav = ({ children }: Props) => {
  const isMobile = useMobile();

  // Render UserNavigation in parent component (Default) on mobile.
  return (
    <div className={styles.wrapper} id="simpleNav">
      {!isMobile && (
        <div className={styles.nav}>
          <UserNavigation />
        </div>
      )}
      {children}
    </div>
  );
};

export default SimpleNav;
