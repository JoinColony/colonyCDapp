import React, { FC } from 'react';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.InstalledBy';

const InstalledBy: FC<PanelTypeProps> = ({ title, component }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className="flex">{component}</div>
  </div>
);

InstalledBy.displayName = displayName;

export default InstalledBy;
