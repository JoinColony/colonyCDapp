import React from 'react';

import ColorTag from '~shared/ColorTag';
import { DomainColor, Domain } from '~types';

import styles from './TeamDetail.css';

const displayName = 'DetailsWidget.TeamDetail';

interface TeamDetailProps {
  domain: Domain;
}

const TeamDetail = ({ domain }: TeamDetailProps) => (
  <div>
    <ColorTag color={domain?.color ?? DomainColor.LightPink} />
    <span className={styles.text}>{` ${domain?.name}`}</span>
  </div>
);

TeamDetail.displayName = displayName;

export default TeamDetail;
