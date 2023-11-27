import React, { FC } from 'react';

import CardWithSections from '~v5/shared/CardWithSections';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';

import { formatText } from '~utils/intl';
import { MotionState, MotionVote } from '~utils/colonyMotions';
import { useAppContext } from '~hooks';

import { OutcomeStepProps } from './types';
import { useOutcomeStep } from './hooks';
import VoteStatuses from './partials/VoteStatuses';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep';

const OutcomeStep: FC<OutcomeStepProps> = ({ motionData, motionState }) => {
  const { wallet, user } = useAppContext();
  const { voteStatuses } = useOutcomeStep(motionData);

  const canInteract = !!wallet && !!user;

  const voters: UserAvatarsItem[] =
    motionData?.voterRecord.map((voter) => ({
      address: voter.address,
      voteCount: voter.voteCount,
      vote: voter.vote ?? undefined,
    })) || [];

  const currentUserVote = voters.find(
    ({ address }) => address === wallet?.address,
  );
  const currentUserVoted = !!currentUserVote;

  let outcome = false;
  if (
    currentUserVote?.vote === MotionVote.Yay &&
    motionState === MotionState.Passed
  ) {
    outcome = true;
  }
  if (
    currentUserVote?.vote === MotionVote.Nay &&
    motionState === MotionState.Failed
  ) {
    outcome = true;
  }

  return (
    <CardWithSections
      sections={[
        {
          key: '1',
          content: (
            <div className="flex flex-col gap-4">
              {canInteract && currentUserVoted && (
                <h3 className="text-center text-1 mb-2">
                  {formatText({
                    id: outcome
                      ? 'motion.outcomeStep.win.title'
                      : 'motion.outcomeStep.lost.title',
                  })}
                </h3>
              )}
              <VoteStatuses items={voteStatuses} voters={voters} />
            </div>
          ),
        },
      ]}
    />
  );
};

OutcomeStep.displayName = displayName;

export default OutcomeStep;
