import React, { FC } from 'react';

import { formatText } from '~utils/intl';
import { MotionState } from '~utils/colonyMotions';
import MenuWithSections from '~v5/shared/MenuWithSections';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';

import { useOutcomeStep } from './hooks';
import VoteStatuses from './partials/VoteStatuses';
import { OutcomeStepProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep';

const OutcomeStep: FC<OutcomeStepProps> = ({ motionData, motionState }) => {
  const { voteStatuses } = useOutcomeStep(motionData);

  const voters: UserAvatarsItem[] =
    motionData?.voterRecord.map((voter) => ({
      address: voter.address,
      voteCount: voter.voteCount,
      vote: voter.vote ?? undefined,
    })) || [];

  return (
    <MenuWithSections
      sections={[
        {
          key: '1',
          content: (
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-1 mb-2">
                {formatText({
                  id:
                    motionState === MotionState.Passed
                      ? 'motion.outcomeStep.win.title'
                      : 'motion.outcomeStep.lost.title',
                })}
              </h3>
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
