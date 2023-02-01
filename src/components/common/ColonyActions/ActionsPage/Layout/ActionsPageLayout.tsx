import React, { ReactNode } from 'react';

import styles from './ActionsPageLayout.css';

interface ActionsPageLayoutProps {
  children: ReactNode;
}

const displayName = 'common.ColonyActions.ActionsPageLayout';

const ActionsPageLayout = ({ children }: ActionsPageLayoutProps) => {
  return <div className={styles.main}>{children}</div>;
};

ActionsPageLayout.displayName = displayName;

export default ActionsPageLayout;
