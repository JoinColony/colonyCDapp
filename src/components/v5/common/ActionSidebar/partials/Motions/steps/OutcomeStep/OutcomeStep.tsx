import React, { FC } from 'react';
import { formatText } from '~utils/intl';

import CardWithSections from '~v5/shared/CardWithSections';
import { OutcomeStepProps } from './types';
import { useOutcomeStep } from './hooks';
import VoteStatuses from './partials/VoteStatuses';
import { MotionState } from '~utils/colonyMotions';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep';

const OutcomeStep: FC<OutcomeStepProps> = ({ motionData, motionState }) => {
  const { voteStatuses } = useOutcomeStep(motionData);

  return (
    <CardWithSections
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
              <VoteStatuses
                items={voteStatuses}
                voters={motionData?.voterRecord || []}
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
