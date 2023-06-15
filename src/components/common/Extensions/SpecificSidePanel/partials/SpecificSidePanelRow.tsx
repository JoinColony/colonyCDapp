import React, { FC } from 'react';

import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.SpecificSidePanelRow';

const SpecificSidePanelRow: FC<PanelTypeProps> = ({ title, description }) => (
  <div className={styles.panelRow}>
    <p className={styles.panelTitle}>{title}</p>
    <p className={styles.panelData}>{description}</p>
  </div>
);

SpecificSidePanelRow.displayName = displayName;

export default SpecificSidePanelRow;
