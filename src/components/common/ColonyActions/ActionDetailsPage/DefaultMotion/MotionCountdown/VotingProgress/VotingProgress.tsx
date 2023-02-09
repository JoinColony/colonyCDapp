import { Placement } from '@popperjs/core';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ProgressBar, { ProgressBarAppearance } from '~shared/ProgressBar';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import styles from './VotingProgress.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingProgress';

const MSG = defineMessages({
  or: {
    id: `${displayName}.or`,
    defaultMessage: `OR`,
  },
  votingProgressBarTooltip: {
    id: `${displayName}.votingProgressBarTooltip`,
    defaultMessage: `Voting ends at the sooner of either time-out, or the reputation threshold being reached.`,
  },
});

const tooltipFormattingOptions = {
  placement: 'top-end' as Placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
    },
  ],
};

const progressBarAppearance = {
  size: 'small',
  backgroundTheme: 'dark',
  barTheme: 'primary',
  borderRadius: 'small',
} as ProgressBarAppearance;

const VotingProgress = () => {
  // const skillRep = 10;
  // const repSubmitted = 10;
  // const votingStateData = {
  //   thresholdValue: BigNumber.from('10').toString(),
  //   totalVotedReputation: repSubmitted.toString(),
  //   skillRep: skillRep.toString(),
  // };

  // const totalVotedReputationValue = BigNumber.from(
  //   votingStateData.totalVotedReputation || 0,
  // ).div(BigNumber.from(10).pow(18));

  // const threshold = BigNumber.from(votingStateData?.thresholdValue || 0).div(
  //   BigNumber.from(10).pow(18),
  // );

  // const skillRepValue = BigNumber.from(votingStateData?.skillRep || 0).div(
  //   BigNumber.from(10).pow(18),
  // );

  // const currentReputationPercent = !totalVotedReputationValue.isZero()
  //   ? Math.round(
  //       totalVotedReputationValue.div(skillRepValue).mul(100).toNumber(),
  //     )
  //   : 0;

  // const thresholdPercent = !skillRepValue.isZero()
  //   ? Math.round(threshold.mul(100).div(skillRepValue).toNumber())
  //   : 0;

  // if (!votingStateData) {
  //   return null;
  // }

  return (
    <div className={styles.progressStateContainer}>
      <span className={styles.text}>
        <FormattedMessage {...MSG.or} />
      </span>
      <div className={styles.progressBarContainer}>
        <ProgressBar
          value={5} // currentReputationPercent}
          threshold={10} // thresholdPercent}
          max={100}
          appearance={progressBarAppearance}
        />
      </div>
      <QuestionMarkTooltip
        tooltipText={MSG.votingProgressBarTooltip}
        className={styles.helpProgressBar}
        tooltipClassName={styles.tooltip}
        showArrow={false}
        tooltipPopperOptions={tooltipFormattingOptions}
      />
    </div>
  );
};

VotingProgress.displayName = displayName;

export default VotingProgress;
