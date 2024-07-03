import { BigNumber } from 'ethers';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import MenuWithSections from '~v5/shared/MenuWithSections/index.ts';
import { type UserAvatarsItem } from '~v5/shared/UserAvatars/types.ts';

import { useOutcomeStep } from './hooks.ts';
import VoteStatuses from './partials/VoteStatuses/index.ts';
import { type OutcomeStepProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep';

const MSG = defineMessages({
  voterWinTitle: {
    id: `${displayName}.voterWinTitle`,
    defaultMessage: 'Congratulations! Your side won.',
  },
  voterLostTitle: {
    id: `${displayName}.voterLostTitle`,
    defaultMessage: 'Sorry, your side lost.',
  },
  neutralWinTitle: {
    id: `${displayName}.neutralWinnerTitle`,
    defaultMessage: 'Action was fully supported.',
  },
  neutralLostTitle: {
    id: `${displayName}.neutralLoserTitle`,
    defaultMessage: 'Action was fully opposed.',
  },
});

const getOutcomeStepTitle = (
  currentUserVote: UserAvatarsItem | undefined,
  winningSide: MotionVote,
) => {
  if (currentUserVote) {
    if (currentUserVote.vote === winningSide) {
      return MSG.voterWinTitle;
    }

    return MSG.voterLostTitle;
  }

  if (winningSide === MotionVote.Yay) {
    return MSG.neutralWinTitle;
  }

  return MSG.neutralLostTitle;
};

const OutcomeStep: FC<OutcomeStepProps> = ({ motionData }) => {
  const { wallet } = useAppContext();
  const { voteStatuses, stakingData } = useOutcomeStep(motionData);
  const { stakers, stakeVoteStatuses } = stakingData || {};

  const voters: UserAvatarsItem[] =
    motionData?.voterRecord.map((voter) => ({
      address: voter.address,
      voteCount: voter.voteCount,
      vote: voter.vote ?? undefined,
    })) || [];

  const currentUserVote = voters.find(
    ({ address }) => address === wallet?.address,
  );
  const winningSide = BigNumber.from(
    motionData?.revealedVotes.raw.yay || '0',
  ).gt(motionData?.revealedVotes.raw.nay || '0')
    ? MotionVote.Yay
    : MotionVote.Nay;

  const showVotingData = voters.length !== 0;

  return (
    <MenuWithSections
      sections={[
        {
          key: '1',
          content: (
            <div className="flex flex-col">
              <h3 className="mb-4 text-center text-1">
                {formatText(getOutcomeStepTitle(currentUserVote, winningSide))}
              </h3>
              <VoteStatuses
                items={showVotingData ? voteStatuses : stakeVoteStatuses || []}
                voters={showVotingData ? voters : stakers || []}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

OutcomeStep.displayName = displayName;

export default OutcomeStep;
