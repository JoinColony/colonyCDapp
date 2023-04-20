import React from 'react';

import ColorTag from '~shared/ColorTag';
import { DomainMetadata } from '~types';

import styles from './TeamDetail.css';

const displayName = 'DetailsWidget.TeamDetail';

interface TeamDetailProps {
  transactionHash?: string;
  domainMetadata: DomainMetadata;
}

const TeamDetail = ({ transactionHash, domainMetadata }: TeamDetailProps) => {
  const changelogItem = transactionHash
    ? domainMetadata.changelog?.find((item) => item.transactionHash === transactionHash)
    : undefined;

  const domainColor = changelogItem?.newColor ?? domainMetadata.color;
  const domainName = changelogItem?.newName ?? domainMetadata.name;

  return (
    <div>
      {domainColor && <ColorTag color={domainColor} />}
      <span className={styles.text}>{domainName}</span>
    </div>
  );
};

TeamDetail.displayName = displayName;

export default TeamDetail;
