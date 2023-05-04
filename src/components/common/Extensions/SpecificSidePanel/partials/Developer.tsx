import React, { FC } from 'react';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.Developer';

const Developer: FC<PanelTypeProps> = ({ title, developer }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className={styles.panelData}>{developer}</div>
  </div>
);

Developer.displayName = displayName;

export default Developer;
