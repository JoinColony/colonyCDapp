import React, { FC } from 'react';

import { useAppContext } from '~hooks';
import { MotionState, MotionVote } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';
import MenuWithSections from '~v5/shared/MenuWithSections';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';

import { useOutcomeStep } from './hooks';
import VoteStatuses from './partials/VoteStatuses';
import { OutcomeStepProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep';

const OutcomeStep: FC<OutcomeStepProps> = ({ motionData, motionState }) => {
  const { wallet, canInteract } = useAppContext();
  const { voteStatuses } = useOutcomeStep(motionData);

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
    <MenuWithSections
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
