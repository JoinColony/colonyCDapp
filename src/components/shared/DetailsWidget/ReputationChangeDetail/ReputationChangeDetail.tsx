import React from 'react';

import Numeral from '~shared/Numeral';
import { formatReputationChange } from '~utils/reputation';

import styles from './ReputationChangeDetail.css';

interface ReputationChangeDetailProps {
  reputationChange: string;
  decimals: number;
}

const displayName = 'DetailsWidget.ReputationChangeDetail';

const ReputationChangeDetail = ({ reputationChange, decimals }: ReputationChangeDetailProps) => (
  <div className={styles.main}>
    <Numeral value={reputationChange} decimals={decimals} />
    <span>{formatReputationChange(reputationChange, decimals) === '1' ? 'pt' : 'pts'}</span>
  </div>
);

ReputationChangeDetail.displayName = displayName;

export default ReputationChangeDetail;
