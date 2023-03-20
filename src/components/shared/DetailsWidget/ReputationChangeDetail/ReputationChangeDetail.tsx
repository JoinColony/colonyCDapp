import React from 'react';

import Numeral from '~shared/Numeral';

import styles from './ReputationChangeDetail.css';

interface ReputationChangeDetailProps {
  reputationChange: string;
}

const displayName = 'DetailsWidget.ReputationChangeDetail';

const ReputationChangeDetail = ({
  reputationChange,
}: ReputationChangeDetailProps) => (
  <div className={styles.main}>
    <Numeral value={reputationChange} />
    <span>{reputationChange === '1' ? 'pt' : ' pts'}</span>
  </div>
);

ReputationChangeDetail.displayName = displayName;

export default ReputationChangeDetail;
