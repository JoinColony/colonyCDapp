import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Heading4 } from '~shared/Heading';

import RevealedVote from './RevealedVote';

import styles from './RevealWidgetHeading.css';

const displayName =
  'common.ActionDetailsPage.DefaultMotion.RevealWidgetHeading';

const MSG = defineMessages({
  voteHiddenInfo: {
    id: `${displayName}.voteHiddenInfo`,
    defaultMessage: `Your vote is hidden from others.`,
  },
  title: {
    id: `${displayName}.title`,
    defaultMessage: `{revealed, select,
        true {Waiting for other voters to reveal their votes.}
        other {Reveal your vote to others to claim your reward.}
      }`,
  },
  titleNotVoted: {
    id: `${displayName}.titleNotVoted`,
    defaultMessage: `Please wait for the voters to reveal their vote.`,
  },
});

interface RevealWidgetHeadingProps {
  hasUserVoted: boolean;
  userVoteRevealed: boolean;
  vote: number | null;
}

const RevealWidgetHeading = ({
  hasUserVoted,
  userVoteRevealed,
  vote,
}: RevealWidgetHeadingProps) => (
  <div className={styles.main}>
    <Heading4
      text={hasUserVoted ? MSG.title : MSG.titleNotVoted}
      textValues={hasUserVoted ? { revealed: userVoteRevealed } : undefined}
      appearance={{ weight: 'bold', theme: 'dark', margin: 'none' }}
    />
    {vote === null ? (
      hasUserVoted && (
        <div className={styles.voteHiddenInfo}>
          <FormattedMessage {...MSG.voteHiddenInfo} />
        </div>
      )
    ) : (
      <RevealedVote vote={vote} />
    )}
  </div>
);

RevealWidgetHeading.displayName = displayName;

export default RevealWidgetHeading;
