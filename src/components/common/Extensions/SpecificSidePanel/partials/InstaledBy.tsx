import React, { FC } from 'react';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.InstaledBy';

const InstaledBy: FC<PanelTypeProps> = ({ title, component }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div>{component}</div>
  </div>
);

InstaledBy.displayName = displayName;

export default InstaledBy;
