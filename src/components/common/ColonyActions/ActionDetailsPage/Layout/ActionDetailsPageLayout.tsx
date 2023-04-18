import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './ActionDetailsPageLayout.css';

interface ActionsPageLayoutProps {
  children: ReactNode;
  center?: boolean;
}

const displayName = 'common.ColonyActions.ActionDetailsPageLayout';

const ActionDetailsPageLayout = ({ children, center = false }: ActionsPageLayoutProps) => {
  return (
    <div
      className={classNames(styles.layout, {
        [styles.center]: center,
      })}
    >
      <div className={styles.main}>{children}</div>
    </div>
  );
};

ActionDetailsPageLayout.displayName = displayName;

export default ActionDetailsPageLayout;
