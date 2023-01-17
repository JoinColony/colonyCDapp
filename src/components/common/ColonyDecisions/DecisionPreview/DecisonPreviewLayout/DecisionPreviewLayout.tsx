import React, { ReactNode } from 'react';

import styles from './DecisionPreviewLayout.css';

const displayName =
  'common.ColonyDecisions.DecisionPreview.DecisionPreviewLayout';

interface DecisionPreviewLayoutProps {
  children: ReactNode;
}

const DecisionPreviewLayout = ({ children }: DecisionPreviewLayoutProps) => (
  <div className={styles.layout}>
    <div className={styles.main}>{children}</div>
  </div>
);

DecisionPreviewLayout.displayName = displayName;

export default DecisionPreviewLayout;
