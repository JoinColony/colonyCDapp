import React from 'react';

import { Heading5 } from '~shared/Heading';
import { Message } from '~types';

import styles from './VoterResultsItemHeading.css';

interface ResultsItemHeadingProps {
  title: Message;
  votePercentage: number;
}

const displayName =
  'common.ColonyActions.DefaultMotion.FinalizeMotion.VoteResults.VoterResultsItemHeading';

const ResultsItemHeading = ({
  title,
  votePercentage,
}: ResultsItemHeadingProps) => (
  <div className={styles.main}>
    <Heading5
      appearance={{
        theme: 'dark',
        margin: 'none',
      }}
      text={title}
    />
    <span className={styles.votePercentage}>{votePercentage}%</span>
  </div>
);

ResultsItemHeading.displayName = displayName;

export default ResultsItemHeading;
