import React from 'react';

import styles from '../DetailsWidget.css';

const displayName = 'DetailsWidget.SafeValueDetail';

interface Props {
  safeValue: string;
}

const SafeValueDetail = ({ safeValue }: Props) => (
  <div className={styles.value}>
    <span>{safeValue}</span>
  </div>
);

SafeValueDetail.displayName = displayName;

export default SafeValueDetail;
