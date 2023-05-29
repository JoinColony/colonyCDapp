import React, { FC } from 'react';
import { FormattedDate } from 'react-intl';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.DateInstalled';

const DateInstalled: FC<PanelTypeProps> = ({ title, date = 0 }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className={styles.panelData}>
      <FormattedDate value={date * 1000} />
    </div>
  </div>
);

DateInstalled.displayName = displayName;

export default DateInstalled;
