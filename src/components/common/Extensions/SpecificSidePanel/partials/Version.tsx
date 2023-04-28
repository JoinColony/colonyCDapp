import React, { FC } from 'react';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.Version';

const Version: FC<PanelTypeProps> = ({ title, version }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className={styles.panelData}>{version}</div>
  </div>
);

Version.displayName = displayName;

export default Version;
