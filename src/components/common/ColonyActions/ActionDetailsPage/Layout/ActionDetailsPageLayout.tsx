import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './ActionDetailsPageLayout.css';

interface ActionsPageLayoutProps {
  children: ReactNode;
  center?: boolean;
  isMotion?: boolean;
}

const displayName = 'common.ColonyActions.ActionDetailsPageLayout';

const ActionDetailsPageLayout = ({
  children,
  center = false,
  isMotion = false,
}: ActionsPageLayoutProps) => {
  return (
    <div
      className={classNames(styles.layout, {
        [styles.center]: center,
        [styles.noTopPadding]: isMotion,
      })}
    >
      <div className={styles.main}>{children}</div>
    </div>
  );
};

ActionDetailsPageLayout.displayName = displayName;

export default ActionDetailsPageLayout;
