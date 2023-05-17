import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers';

import { useAppContext } from '~hooks';
import { Heading4 } from '~shared/Heading';
import { MotionVote } from '~utils/colonyMotions';
import { formatActionType, getExtendedActionType } from '~utils/colonyActions';
import { MotionAction } from '~types/motions';

import { voteTitleMsg } from '../VotingWidget';
import { VoteResults } from './VoteResults';

import styles from './VoteOutcome.css';

const displayName =
  'common.ColonyActions.DefaultMotion.FinalizeMotion.VoteOutcome';

const MSG = defineMessages({
  outcomeCelebration: {
    id: `${displayName}.outcomeCelebration`,
    defaultMessage: `{outcome, select,
          true {🎉 Congratulations, your side won!}
          other {Sorry, your side lost. 😢}
        }`,
  },
});

interface VoteOutcomeProps {
  actionData: MotionAction;
}

const VoteOutcome = ({
  actionData: {
    type,
    transactionHash,
    pendingColonyMetadata,
    motionData: {
      revealedVotes: {
        raw: { yay: yayVotes, nay: nayVotes },
      },
      revealedVotes,
      voterRecord,
    },
  },
}: VoteOutcomeProps) => {
  const { user } = useAppContext();

  const votesHaveBeenRevealed = yayVotes !== '0' || nayVotes !== '0';

  if (!votesHaveBeenRevealed) {
    return null;
  }

  const currentUserRecord = voterRecord.find(
    ({ address }) => address === user?.walletAddress,
  );
  const { vote: currentUserVote } = currentUserRecord || {};

  // Yay votes must be greater than nay for Yays to win.
  const winningSide = BigNumber.from(yayVotes).gt(nayVotes)
    ? MotionVote.Yay
    : MotionVote.Nay;

  const userSideWon = winningSide === currentUserVote;

  return (
    <div className={styles.main}>
      {typeof currentUserRecord?.vote === 'number' && (
        <div className={styles.outcome}>
          <FormattedMessage
            {...MSG.outcomeCelebration}
            values={{
              outcome: userSideWon,
            }}
          />
        </div>
      )}
      <Heading4
        text={voteTitleMsg}
        textValues={{
          actionType: formatActionType(
            getExtendedActionType(transactionHash, type, pendingColonyMetadata),
          ),
        }}
        appearance={{ weight: 'bold', theme: 'dark' }}
      />
      <VoteResults revealedVotes={revealedVotes} voterRecord={voterRecord} />
    </div>
  );
};

VoteOutcome.displayName = displayName;

export default VoteOutcome;
