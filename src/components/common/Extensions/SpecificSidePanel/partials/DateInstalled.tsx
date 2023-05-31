import React, { FC } from 'react';
import { format } from 'date-fns';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.DateInstalled';

const DateInstalled: FC<PanelTypeProps> = ({ title, date = 0 }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className={styles.panelData}>{format(new Date(date * 1000), 'dd MMMM yyyy')}</div>
  </div>
);

DateInstalled.displayName = displayName;

export default DateInstalled;
