import React, { PropsWithChildren } from 'react';

import ExternalLink from '~shared/ExternalLink/ExternalLink';

import { LearnMoreProps } from './types';
import styles from './DropdownItems.module.css';

const displayName = 'Extensions.SubNavigation.DropdownItems.LearnMore';

const LearnMore: React.FC<PropsWithChildren<LearnMoreProps>> = ({ chunks, href }) => {
  return (
    <ExternalLink href={href}>
      <div className={styles.externalLink}>{chunks}</div>
    </ExternalLink>
  );
};

LearnMore.displayName = displayName;

export default LearnMore;
