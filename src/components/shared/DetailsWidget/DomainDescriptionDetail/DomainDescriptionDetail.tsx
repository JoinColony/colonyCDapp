import React from 'react';

import styles from './DomainDescriptionDetail.css';

const displayName = 'DetailsWidget.DomainDescriptionDetail';

interface DomainDescriptionDetailProps {
  description: string;
}

const DomainDescriptionDetail = ({ description }: DomainDescriptionDetailProps) => (
  <div className={styles.domainDescription} title={description}>
    {description}
  </div>
);

DomainDescriptionDetail.displayName = displayName;

export default DomainDescriptionDetail;
