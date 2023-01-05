import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ProfileTemplate.css';

interface Appearance {
  theme: 'alt';
}

interface Props {
  appearance?: Appearance;
  children: ReactNode;
  asideContent: ReactNode;
}

const displayName = 'frame.ProfileTemplate';

const ProfileTemplate = ({ appearance, children, asideContent }: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    <aside className={styles.sidebar}>{asideContent}</aside>
    <div className={styles.mainContainer}>
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

ProfileTemplate.displayName = displayName;

export default ProfileTemplate;
