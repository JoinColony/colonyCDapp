import { Placement } from '@popperjs/core';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { BigNumber } from 'ethers';
import { Extension } from '@colony/colony-js';

import ProgressBar, { ProgressBarAppearance } from '~shared/ProgressBar';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import { InstalledExtensionData, MotionData } from '~types';
import { useExtensionData } from '~hooks';

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

interface VotingProgressProps {
  motionData: MotionData;
}

const VotingProgress = ({
  motionData: { repSubmitted, skillRep },
}: VotingProgressProps) => {
  const { extensionData } = useExtensionData(Extension.VotingReputation);

  const maxVoteFraction = (extensionData as InstalledExtensionData)?.params
    ?.votingReputation?.maxVoteFraction;

  const currentReputationPercent = BigNumber.from(repSubmitted)
    .mul(100)
    .div(skillRep)
    .toNumber();

  const thresoldPercent = BigNumber.from(maxVoteFraction ?? '0')
    .mul(100)
    .div(BigNumber.from(10).pow(18))
    .toNumber();
  return (
    <div className={styles.progressStateContainer}>
      <span className={styles.text}>
        <FormattedMessage {...MSG.or} />
      </span>
      <div className={styles.progressBarContainer}>
        <ProgressBar
          value={currentReputationPercent}
          threshold={thresoldPercent}
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
