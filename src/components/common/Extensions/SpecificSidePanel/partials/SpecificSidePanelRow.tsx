import React, { FC } from 'react';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.SpecificSidePanelRow';

const SpecificSidePanelRow: FC<PanelTypeProps> = ({ title, description }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className={styles.panelData}>{description}</div>
  </div>
);

SpecificSidePanelRow.displayName = displayName;

export default SpecificSidePanelRow;
