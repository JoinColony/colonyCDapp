import React, { FC } from 'react';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.DateInstalled';

const DateInstalled: FC<PanelTypeProps> = ({ title, date }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className={styles.panelData}>{date}</div>
  </div>
);

DateInstalled.displayName = displayName;

export default DateInstalled;
