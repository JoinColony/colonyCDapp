import React, { FC } from 'react';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.ContractAddress';

const ContractAddress: FC<PanelTypeProps> = ({ title, address }) => (
  <div className={styles.panelRow}>
    <div className={styles.panelTitle}>{title}</div>
    <div className={styles.panelData}>{address}</div>
  </div>
);

ContractAddress.displayName = displayName;

export default ContractAddress;
