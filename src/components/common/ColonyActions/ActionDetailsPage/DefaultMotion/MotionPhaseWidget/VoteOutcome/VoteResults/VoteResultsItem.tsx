import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { getMainClasses } from '~utils/css';
import Icon from '~shared/Icon';
import ProgressBar from '~shared/ProgressBar';
import { VoterRecord } from '~gql';

import ItemHeading from './VoterResultsItemHeading';
import VoterAvatars from './VoterAvatars';

import styles from './VoteResultsItem.css';

interface Appearance {
  theme?: 'approve' | 'disapprove';
}

interface Props {
  appearance?: Appearance;
  value: number;
  maxValue: number;
  maxPercentage?: number;
  title: string | MessageDescriptor;
  voters?: VoterRecord[];
  maxAvatars?: number;
}

const displayName = `common.ActionDetailsPage.FinalizeMotion.VoteResults.VoteResultsItem`;

const VoteResultsItem = ({
  appearance = { theme: 'approve' },
  value,
  maxValue,
  maxPercentage = 100,
  title,
  voters = [],
  maxAvatars = 3,
}: Props) => {
  const iconName =
    appearance.theme === 'approve' ? 'circle-thumbs-up' : 'circle-thumbs-down';
  const votePercentage = (value * maxPercentage) / maxValue;
  const barTheme = appearance.theme === 'approve' ? 'primary' : 'danger';

  return (
    <div className={`${styles.wrapper} ${getMainClasses(appearance, styles)}`}>
      <div className={styles.voteInfoContainer}>
        <Icon name={iconName} title={title} appearance={{ size: 'medium' }} />
        <div className={styles.voteResults}>
          <ItemHeading title={title} votePercentage={votePercentage} />
          <ProgressBar
            value={votePercentage}
            max={maxPercentage}
            appearance={{
              size: 'small',
              backgroundTheme: 'transparent',
              barTheme,
            }}
          />
        </div>
      </div>
      <VoterAvatars maxAvatars={maxAvatars} voters={voters} />
    </div>
  );
};

VoteResultsItem.displayName = displayName;

export default VoteResultsItem;
